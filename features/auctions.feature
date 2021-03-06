Feature: Basic Auction Views
  As an unauthenticated user
  I want to be able to view auctions on the site
  So that I can learn about micropurchase

  Scenario: Visiting the home page
    Given there is an open auction
    And there is also an unpublished auction
    When I visit the home page
    Then I expect to see the auction
    And I expect to not see the unpublished auction
    And I expect to see a "Bid" button
    And there should be meta tags for the index page for 1 open and 0 future auctions

  Scenario: Many auctions
    Given there are many different auctions
    When I visit the home page
    Then the auctions should be in reverse chronological order
    Then there should be meta tags for the index page for 5 open and 1 future auctions

  Scenario: Visiting a auction detail page
    Given there is an open auction
    And there is also an unpublished auction
    
    When I visit the auction page
    Then I expect to see the auction title
    And I expect to see the auction description
    And I expect to see an Open status
    And I expect to see when the auction started
    And I expect to see when the auction ends
    And I expect to see a current bid amount
    And there should be meta tags for the open auction
    #When I visit the unpublished auction
    #Then I expect to see a routing error

  Scenario: There are no auctions
    When I visit the home page
    Then I expect to see a message about no auctions
    And there should be meta tags for the index page for 0 open and 0 future auctions

  Scenario: Navigating to bid history
    Given there is an open auction
    When I visit the home page
    Then I expect to see the number of bid for the auction
    And I expect to see the auction summary
    
    When I click on the link to the bids
    Then I expect to see the bid history

  Scenario: There is a closed auction
    Given there is a closed auction
    When I visit the home page
    Then I expect to see a Closed label
    And I expect to not see a "Bid" button
    And there should be meta tags for the index page for 0 open and 0 future auctions

    When I visit the auction page
    Then I expect to see a Closed status
    And I expect to not see a "Bid" button
    And there should be meta tags for the closed auction

  Scenario: There is an expiring auction
    Given there is an expiring auction
    When I visit the home page
    Then I expect to see an Expiring label
    And I expect to see a "Bid" button
    And there should be meta tags for the index page for 1 open and 0 future auctions

    When I visit the auction page
    Then I expect to see an Open status
    And I expect to see a "BID" button
    And there should be meta tags for the open auction

  Scenario: There is a future auction
    Given there is a future auction
    When I visit the home page
    Then I expect to see a Coming Soon label
    And I expect to not see a "Bid" button
    And there should be meta tags for the index page for 0 open and 1 future auctions

    When I visit the auction page
    Then I expect to see a Closed status
    And I expect to not see a "Bid" button
    And there should be meta tags for the closed auction
