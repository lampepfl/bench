var Bench = Bench || {};

function process(item) {
  return { y: item[3], x: new Date(item[1]), obj: item };
}

function sort(points) {
  return points.sort(function(a, b) {
    return new Date(a.obj[1]) - new Date(b.obj[1]);
  });
}

function sample(points, rate) {
  return points.reduce(function(acc, item) {
    if (Math.random() < rate) acc.push(item);

    return acc;
  }, []);
}

function dedup(points) {
  var lastDate = null;
  points = points.reduce(function(acc, point) {
    var curDate = new Date(point.x).toLocaleDateString();
    if (!lastDate || lastDate !== curDate) {
      lastDate = curDate;
      acc.push(point);
    }
    return acc;
  }, []);

  return points;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function flatten() {
  Bench.flattened = [];

  Bench.charts.map(function(chart) {
    chart.lines.map(function(line) {
      var name = chart.name;
      if (chart.lines.length > 1) name = name + " - " + line.label;
      Bench.flattened.push({
        "key": line.key,
        "name": name,
        "url": chart.url
      });
    });
  });
}

function ChartView(chart, dom) {
  var view = {
    dom: dom,
    chart: chart,
    data: {},
    options: {},
    ready: false,
    render: render
  };

  function render() {
    var width = $("#app").width(); // window size may change

    if (view.ready) {
      dom.innerHTML =
        `<div>
          <h3>
            <a href=${view.chart.url}>${view.chart.name}</a>
          </h3>
          <div class="chart" width=${width} height="300"></div>
        </div>`

      Plotly.newPlot($('.chart', dom)[0], view.data, view.options);
    }
    else {
      dom.innerHTML = `<div><h2>${view.chart.name}</h2><p>Loading...</p></div>`
    }
  }

  render();

  return view;
};

function showChartList(charts, dataProvider, optionProvider) {
  var container = document.getElementById('app');
  container.innerHTML = "";
  charts.map(function (chart) {
    var dom = document.createElement("div");
    container.appendChild(dom);
    var view = ChartView(chart, dom);

    dataProvider(chart, false, function(data) {
      view.data = data;
      view.ready = true;
      view.options = optionProvider(view);
      view.render();
    })
  });
}

window.showTime = function() {
  var colorNames  = ['yellow', 'purple', 'orange', 'green', 'blue', 'red', 'grey'];
  var colors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  };

  function getData(chart, isDedup, callback) {
    var dataset = []
    var deferreds = chart.lines.map(function(line) {
      return $.get("data/" + line.key + ".json", function(data) {
        dataset.push({ line: line, data: data });
      })
    })

    $.when.apply($, deferreds).then(function() {
      callback(prepareData(dataset, isDedup));
    })
  }

  function prepareData(datasets, isDedup) {
    return datasets.map(function(tuple) {

      var points = sort(tuple.data.map(process))
      if (isDedup) points = dedup(points);

      return {
        name: tuple.line.label,
        mode: "lines+markers",
        type: "scatter",
        line: {shape: 'hvh'},
        x: points.map(p => { return p.x; }),
        y: points.map(p => { return p.y; })
      };
    });
  }

  function options(view) {
    function getItem(didx, pidx) {
      return view.data["datasets"][didx].data[pidx].obj;
    }

    return {
      legend: {
        orientation: "h",
        yanchor: "bottom",
        y: 1.02,
        xanchor: "right",
        x: 1
      },
      xaxis: {
        autorange: true,
        autotick: true,
        // range: ['2019-01-17', new Date()],
        rangeselector: {buttons: [
            {
              count: 1,
              label: '1m',
              step: 'month',
              stepmode: 'backward'
            },
            {
              count: 6,
              label: '6m',
              step: 'month',
              stepmode: 'backward'
            },
            {step: 'all'}
          ]},
        // rangeslider: {range: ['2015-02-17', '2017-02-16']},
        type: 'date'
      },
      yaxis: {
        title: 'milliseconds',
        autorange: true,
        // range: [86.8700008333, 138.870004167],
        type: 'linear'
      }
    };

    // return {
    //   responsive: true,
    //   legend: {
    //     display: view.chart.lines.length > 1
    //   },
    //   tooltips: {
    //     callbacks: {
    //       title: function (data) {
    //         var item = getItem(data[0].datasetIndex, data[0].index);
    //         var date = new Date(item[1]);
    //         var day = date.getDate();
    //         var month = date.getMonth() + 1;
    //         var year = date.getFullYear();
    //         return "PR#" + item[0] + " \n" + item[2] + " \n" + day + "/" + month + "/" + year;
    //       },
    //       label: function (point) {
    //         var item = getItem(point.datasetIndex, point.index);
    //         return numberWithCommas(point.yLabel) + "ms";
    //       }
    //     },
    //     mode: "index",
    //     intersect: false
    //   },
    //   scales: {
    //     xAxes: [{
    //       type: "time",
    //       time: {
    //         // format: 'MM/DD/YYYY HH:mm',
    //         // round: 'day'
    //         tooltipFormat: 'll HH:mm'
    //       },
    //       scaleLabel: {
    //         display: false
    //       }
    //     }],
    //     yAxes: [{
    //       display: true,
    //       scaleLabel: { display: true, labelString: 'ms' },
    //       ticks: {
    //         min: 0,
    //         callback: function(value, index, values) { return numberWithCommas(value); }
    //       }
    //     }]
    //   },
    //   onClick: function(e) {
    //     var activeElems = this.getElementsAtEvent(e);
    //     if (activeElems.length > 0) {
    //       var pindex = activeElems[0]._index;
    //       var dindex = activeElems[0]._datasetIndex;
    //       var obj = getItem(dindex, pindex);
    //       var win = window.open(Bench.config.pr_base_url + obj[0], '_blank');
    //       win.focus();
    //     }
    //   }
    // }
  }

  showChartList(Bench.charts, getData, options);
}

window.showCommit = function () {
  function getData(chart, isSample, callback) {
    $.get("data/" + chart.key + ".json", function (data) { // data cached by browser
      callback(prepareData(data, isSample))
    })
  }

  function prepareData(data, isSample) {
    var points = sort(data.map(process))

    if (isSample) {
      var pts1 = sample(points.slice(0, -100), 50 / (points.length - 100));
      var pts2 = sample(points.slice(-100, -40), 0.5);
      var pts3 = points.slice(-40);

      points = pts1.concat(pts2).concat(pts3);
    }

    var median = {
        label: "median",
        data: points,
        fill: false,
        borderColor: "rgba(100,100,100,0.2)",
        backgroundColor: "yellow",
        pointBorderColor: "rgba(220,220,220,1)",
        pointBackgroundColor: "yellow",
        pointBorderWidth: 1
    }

    var labels = [];
    for (var i = 0; i < points.length; i++) {
      var date = new Date(points[i].obj[1]);
      var day = date.getDate();
      var month = date.getMonth() + 1;
      labels.push(day + "/" + month);
    }

    var minPoints = points.map(function(p) {
      return { y: p.obj[4], x: p.index, obj: p.obj }
    });

    var min = {
        label: "min",
        data: minPoints,
        fill: false,
        borderDash: [5, 5],
        pointBorderWidth: 1
    }

    return {
      labels: labels,
      datasets: [median, min]
    }
  }

  function options(view) {
    function getItem(didx, pidx) {
      return view.data["datasets"][didx].data[pidx].obj;
    }

    return {
      responsive: true,
      tooltips: {
        callbacks: {
          title: function (data) {
            var item = getItem(data[0].datasetIndex, data[0].index);
            var date = new Date(item[1]);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            return "PR#" + item[0] + " \n" + item[2] + " \n" + day + "/" + month + "/" + year;
          },
          label: function (point) {
            var item = getItem(point.datasetIndex, point.index);
            return numberWithCommas(point.yLabel) + "ms";
          }
        },
        mode: "index",
        intersect: false
      },
      scales: {
        yAxes: [{
          display: true,
          scaleLabel: { display: true, labelString: 'ms' },
          ticks: {
            min: 0,
            callback: function(value, index, values) { return numberWithCommas(value); }
          }
        }]
      },
      onClick: function(e) {
        var activeElems = this.getElementsAtEvent(e);
        if (activeElems.length > 0) {
          var pindex = activeElems[0]._index;
          var dindex = activeElems[0]._datasetIndex;
          var obj = getItem(dindex, pindex);
          var win = window.open(Bench.config.pr_base_url + obj[0], '_blank');
          win.focus();
        }
      }
    }
  }

  showChartList(Bench.flattened, getData, options);
}

$(function () {
  flatten();
  showTime();
})
