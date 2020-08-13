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

function ChartView(chart, dom, dataProvider) {

  var data = [];

  function defaultRange() {
    var now = new Date();
    var start = new Date()
    start.setMonth(start.getMonth()-3);
    return [start, now];
  }

  var options = {
      legend: {
        orientation: "h",
        yanchor: "bottom",
        y: 1.02,
        xanchor: "right",
        x: 1
      },
      xaxis: {
        autorange: false,
        // autotick: true,
        range: defaultRange(),
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
        // rangeslider: {},
        type: 'date'
      },
      yaxis: {
        title: 'milliseconds',
        autorange: true,
        rangemode: "tozero",
        // range: [86.8700008333, 138.870004167],
        type: 'linear'
      },
      hovermode:'closest'
  };

  function render() {
    var width = $("#app").width(); // window size may change

    dom.innerHTML =
      `<div>
        <h3>
          <a href=${chart.url}>${chart.name}</a>
        </h3>
        <div class="chart" width=${width} height="300"></div>
      </div>`

    Plotly.newPlot($('.chart', dom)[0], data, options);
  }

  $(dom).on('plotly_click', function(event, edata) {
    if (edata.points.length == 1) {
      var pindex = edata.points[0].pointNumber;
      var dindex = edata.points[0].curveNumber;
      var obj = data[dindex].objects[pindex].obj;
      var win = window.open(Bench.config.pr_base_url + obj[0], '_blank');
      win.focus();
    }
  });

  dom.innerHTML = `<div><h2>${chart.name}</h2><p>Loading...</p></div>`

  dataProvider(chart, function(json) {
    data = json;
    render();
  })
};

function showChartList(charts, dataProvider) {
  var container = document.getElementById('app');
  container.innerHTML = "";
  charts.map(function (chart) {
    var dom = document.createElement("div");
    container.appendChild(dom);
    ChartView(chart, dom, dataProvider);
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

  function getData(chart, callback) {
    var dataset = []
    var deferreds = chart.lines.map(function(line) {
      return $.get("data/" + line.key + ".json", function(data) {
        dataset.push({ line: line, data: data });
      })
    })

    $.when.apply($, deferreds).then(function() {
      callback(prepareData(dataset));
    })
  }

  function prepareData(datasets) {
    return datasets.map(function(tuple) {

      var points = sort(tuple.data.map(process))

      return {
        name: tuple.line.label,
        mode: "lines+markers",
        type: "scatter",
        line: {shape: 'hvh'},
        x: points.map(p => { return p.x; }),
        y: points.map(p => { return p.y; }),
        objects: points
      };
    });
  }

  showChartList(Bench.charts, getData);
}

window.showCommit = function () {
  function getData(chart, callback) {
    $.get("data/" + chart.key + ".json", function (data) { // data cached by browser
      callback(prepareData(data))
    })
  }

  function prepareData(data) {
    var points = sort(data.map(process))

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
