$(function(){

  /* Auctions Chart
   * Categories:
   * * Average winning bid
   *   We are looking for the median winning bid, so we should
   *   do something like:
   *   var auctions = Auctions.all()
   *   bidWinner = auctions.each(function(d){
          return d.bids.winner
       })
   *   var medianBid = d3.median(bidWinner)
   * * Bids/auction
   *   Similarly, so we should do something like:
   *   var auctinos = Bids.all()
   *   bidCounts = auctions.each(function(d){
          return d.bids.count
       })
   *   d3.median(bidCounts)
 */
  var chartAuctions = c3.generate({
    bindto: '#chart-auctions',
    axis: {
      x: {
        type: 'category',
        categories: ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4', 'Batch 5', 'Batch 6']
      },
      y: {
        tick: {
          count: 4,
          format: function (d) { return Math.round(d); }
        }
      }
    },

    data: {
      columns: [
        ['Average winning bid ($)', 30, 200, 100, 400, 150, 250],
        ['Bids/auction', 130, 100, 140, 200, 150, 50]
      ],
      type: 'bar'
    },
    bar: {
      width: {
        ratio: 0.5 // this makes bar width 50% of length between ticks
      }
    },
    color: {
      pattern: ['#1C304A','#00CFFF','#046B99','#B3EFFF']
    }
  });


  /* Community Chart
   * Categories:
   * * Vendors
   *   Simpler
   *   var vendors = Vendors.count
   * * Open-source projects
   *   Not really sure if there is something to flag here? :shrug:
   * * Auctions
   *   Simpler
   *   var auctions = Auctions.count
 */
  var chartCommunity = c3.generate({
    bindto: '#chart-community',
    axis: {
      x: {
        type: 'category',
        categories: ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4', 'Batch 5', 'Batch 6']
      },
      y: {
        tick: {
          count: 4,
          format: function (d) { return Math.round(d); }
        }
      }
    },
    data: {
      columns: [
        ['Vendors', 30, 200, 100, 400, 150, 250],
        ['Open-source projects', 130, 100, 140, 200, 150, 50],
        ['Auctions', 13, 10, 140, 600, 50, 550]
      ],
      type: 'bar'
    },
    bar: {
      width: {
          ratio: 0.5 // this makes bar width 50% of length between ticks
      }
    },
    color: {
      pattern: ['#046B99','#B3EFFF','#1C304A','#00CFFF']
    }
  });

  /* Project Types Chart
   * We need to have tags attached to auctions
 */
  var chartProjectTypes = c3.generate({
    bindto: "#chart-project-types",
    data: {
      columns: [
        ['software', 300],
        ['non-software', 120],
      ],
      type : 'donut',
      onclick: function (d, i) { console.log("onclick", d, i); },
      onmouseover: function (d, i) { console.log("onmouseover", d, i); },
      onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    donut: {
      title: "Projects by type"
    },
    color: {
      pattern: ['#1C304A','#00CFFF','#046B99','#B3EFFF']
    }
  });

  setTimeout(function () {
    chartProjectTypes.load({
      columns: [
      ["software", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
      ["non-software", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3]        ]
    });
  }, 1500);


  /* Software Types Chart
   * Within 'software' tag, repos should have tags for
 */
  var chartSoftwareTypes = c3.generate({
    bindto: "#chart-software-types",
    data: {
      columns: [
        ['feature', 300],
        ['bug', 120],
        ['design', 12],
        ['user research', 1200]
      ],
      type : 'donut',
      onclick: function (d, i) { console.log("onclick", d, i); },
      onmouseover: function (d, i) { console.log("onmouseover", d, i); },
      onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    donut: {
      title: "Software by type"
    },
    color: {
      pattern: ['#046B99','#B3EFFF','#1C304A','#00CFFF']
    }
  });

  setTimeout(function () {
    chartSoftwareTypes.load({
      columns: [
      ["feature", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 20.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
      ["bug", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
      ["design", 0.2, 10.2, 0.2, 0.2, 0.32, 0.4, 0.3, 0.2, 402.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
      ["user research", 11.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3]
    ]
    });
  }, 1500);


  // Software Dollars Chart
  var chartSoftwareDollars = c3.generate({
    bindto: "#chart-software-dollars",
    data: {
      columns: [
        ['feature', 300],
        ['bug', 120],
        ['design', 12],
        ['user research', 1200]
      ],
      type : 'donut',
      onclick: function (d, i) { console.log("onclick", d, i); },
      onmouseover: function (d, i) { console.log("onmouseover", d, i); },
      onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    donut: {
      title: "Software by dollars"
    },
    color: {
      pattern: ['#1C304A','#00CFFF','#046B99','#B3EFFF']
    }
  });

  setTimeout(function () {
    chartSoftwareDollars.load({
      columns: [
        ["feature", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
        ["bug", 1.4, 1.5, 1.5, 14.3, 1.5, 1.3, 21.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
        ["design", 0.2, 0.2, 0.2, 40.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
        ["user research", 1.4, 1.5, 1.5, 13.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3]
      ]
    });
  }, 1500);

});

