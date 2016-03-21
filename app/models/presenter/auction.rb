require 'action_view'

module Presenter
  class Auction < SimpleDelegator
    include ActiveModel::SerializerSupport    # adds implicit connection to AuctionSerializer
    include ActionView::Helpers::DateHelper   # distance_of_time_in_words
    include ActionView::Helpers::NumberHelper # number_to_currency

    # This has two concepts: should I show the button, and can I bid
    # separate!
    def user_can_bid?(user)
      if !available? # not_avaliable?
        false
      elsif user && !user.sam_account? #user_without_sam_account?
        false
      elsif single_bid? && user_is_bidder?(user) # single_bid_already_attempted_by_user?
        false
      else # no user or user with same or singlebid first bid or multibid
        true
      end
    end

    def current_bid?
      current_bid_record != nil
    end

    # highlighted_bid
    # 1) single bid (RENAME): current user's bid on this auction
    # 2) multi bid (RENAME): winning bid.
    def current_bid
      return Presenter::Bid::Null.new unless current_bid_record
      Presenter::Bid.new(current_bid_record)
    end

    # this should be moved down into the bid and null bid objects
    def current_max_bid
      if current_bid.is_a?(Presenter::Bid::Null)
        return start_price - PlaceBid::BID_INCREMENT
      else
        return current_bid.amount - PlaceBid::BID_INCREMENT
      end
    end

    delegate :amount, :time,
             to: :current_bid, prefix: :current_bid

    delegate :bidder_name, :bidder_duns_number,
             to: :current_bid, prefix: :current

    # this also needs to move down into the bid/null bid
    def current_bid_amount_as_currency
      number_to_currency(current_bid_amount)
    end

    def user_bid_amount_as_currency(user)
      number_to_currency(lowest_user_bid_amount(user))
    end

    def bids?
      bid_count > 0
    end

    def bids
      model.bids.to_a
           .map {|bid| Presenter::Bid.new(bid) }
           .sort_by(&:created_at)
           .reverse
    end

    def veiled_bids(user)
      # For single bid auctions, we reveal no bids if the auction is running
      # For multi bid auctions, we let the bids go through, but depend on
      # Presenter::Bid to veil certain attributes.

      # redact all bids if auction is still running and type is single bid
      if available? && single_bid? && user.nil?
        []
      elsif available? && single_bid?
        bids.select {|bid| bid.bidder_id == user.id}
      else
        bids
      end
    end

    def bid_count
      bids.size
    end

    def starts_at
      Presenter::DcTime.convert_and_format(model.start_datetime)
    end

    def ends_at
      Presenter::DcTime.convert_and_format(model.end_datetime)
    end

    def starts_in
      Presenter::TimeInWords.convert(model.start_datetime)
    end

    def ends_in
      Presenter::TimeInWords.convert(model.end_datetime)
    end

    def delivery_deadline_expires_in
      Presenter::TimeInWords.convert(model.delivery_deadline)
    end

    # isn't the same as starts_in?
    def human_start_time
      starts_in
    end

    # rubocop:disable Style/DoubleNegation
    def available?
      !!(
        (model.start_datetime && !future?) &&
          (model.end_datetime && !over?)
      )
    end
    # rubocop:enable Style/DoubleNegation

    def over?
      model.end_datetime < Time.now
    end

    def future?
      model.start_datetime > Time.now
    end

    def expiring?
      available? && model.end_datetime < 12.hours.from_now
    end

    def user_is_winning_bidder?(user)
      if !current_bid?
        false
      else
        user.id == winning_bidder_id
      end
    end

    def type
      model.type
    end

    def single_bid?
      model.type == 'single_bid'
    end

    def multi_bid?
      model.type == 'multi_bid'
    end

    def formatted_type
      if multi_bid?
        'multi-bid'
      elsif single_bid?
        'single-bid'
      else
        # nil ??
      end
    end

    def winning_bid
      if single_bid?
        single_bid_winning_bid
      elsif multi_bid?
        multi_bid_winning_bid
      else
        # ?? nil
      end
    end

    # --- NULL OBJECT FOR NEXT THREE METHODS, started in the one above
    def winning_bidder
      winning_bid.bidder rescue nil
    end

    def winning_bidder_id
      winning_bid.bidder_id rescue nil
    end

    def winning_bid_id
      winning_bid.id rescue nil
    end

    def single_bid_winning_bid
      if available?
        nil
      elsif lowest_bids.length == 1
        lowest_bids.first
      else
        lowest_bids.sort_by(&:created_at).first
      end
    end

    def multi_bid_winning_bid
      current_bid
    end

    def lowest_bids
      bids.select {|b| b.amount == lowest_amount }
    end

    def lowest_amount
      bids.sort_by(&:amount).first.amount
    end

    class NullBidUser
      def intialize(user, bids)
      end

      def has_bid?
        false
      end

      def my_bids
        []
      end
    end

    class BidUser
      attr_accessor :user, :bids

      def intialize(user, bids)
        @user = user
        @bids = bids
      end

      def has_bid? # change to !my_bids.empty?
        bids.detect {|b| user.id == b.bidder_id } != nil
      end

      def my_bids
        bids.select {|b| user.id == b.bidder_id }
      end
    end

    def bid_user
      # if-else to get to the right instance
    end


    def user_is_bidder?(user)
      # bid_user.has_bids?
      return false if user.nil?
      bids.detect {|b| user.id == b.bidder_id } != nil
    end

    def user_bids(user)
      return [] if user.nil?
      bids.select {|b| user.id == b.bidder_id }
    end

    def lowest_user_bid(user)
      user_bids(user).sort_by(&:amount).first
    end

    def lowest_user_bid_amount(user)
      bid = lowest_user_bid(user)
      # null pattern again
      if bid
        bid.amount
      else
        nil
      end
    end

    def html_description
      return '' if description.blank?
      markdown.render(description)
    end

    def html_summary
      return '' if summary.blank?
      markdown.render(summary)
    end

    def status
      if available?
        'Open'
      else
        'Closed'
      end
    end

    delegate :label_class, :label, :tag_data_value_status, :tag_data_label_2, :tag_data_value_2,
             to: :status_presenter


    private

    def status_presenter_class
      status_name = if expiring?
                      'Expiring'
                    elsif over?
                      'Over'
                    elsif future?
                      'Future'
                    else
                      'Open'
                    end
      "::Presenter::AuctionStatus::#{status_name}".constantize
    end

    def status_presenter
      @status_presenter ||= status_presenter_class.new(self)
    end

    def current_bid_record
      @current_bid_record ||= bids.sort_by {|bid| [bid.amount, bid.created_at, bid.id] }.first
    end

    def markdown
      # FIXME: Do we want the lax_spacing?
      @markdown ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML,
                                            no_intra_emphasis: true,
                                            autolink: true,
                                            tables: true,
                                            fenced_code_blocks: true,
                                            lax_spacing: true)
    end

    def model
      __getobj__
    end
  end
end
