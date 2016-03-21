module Presenter
  class TimeInWords
    include ActionView::Helpers::DateHelper   # distance_of_time_in_words

    attr_reader :time, :now

    def initialize(time)
      @time = time
      @now = Time.now
    end

    def past?
      time < now
    end

    def convert
      past? ? past_time : future_time
    end

    def difference_in_words
      distance_of_time_in_words(now, time)
    end

    def past_time
      "#{difference_in_words} ago"
    end

    def future_time
      "in #{difference_in_words}"
    end

    def self.convert(time)
      new(time).convert
    end
  end
end
