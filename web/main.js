var Bench = Bench || {};

function process(item) {
  return { y: item[3], x: new Date(item[1]), obj: item };
}

function sort(points) {
  return points.sort(function(a, b) {
    return a.x - b.x;
  });
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

function defaultOptions() {
  return {
    // paper_bgcolor: "#eee",
    // plot_bgcolor: "#ffe",
    margin: {
      l: 60,
      r: 40,
      t: 60,
      b: 40
    },
    legend: {
      orientation: "h",
      yanchor: "bottom",
      y: 1.02,
      xanchor: "right",
      x: 1
    },
    xaxis: {
      autorange: false,
      zeroline: false,
      nticks: 30,
      // autotick: true,
      // range: defaultRange(),
      // rangeslider: {},
      type: 'date'
    },
    yaxis: {
      title: 'milliseconds',
      autorange: true,
      rangemode: "tozero",
      // fixedrange: true,
      // range: [86.8700008333, 138.870004167],
      type: 'linear'
    },
    hovermode:'closest'
  };
}

function ChartView(chart, dom, dataProvider, optionsProvider) {

  var data = [];

  function render() {
    var width = $("#app").width(); // window size may change

    dom.innerHTML =
      `<div>
        <h3>
          <a href=${chart.url}>${chart.name}</a>
        </h3>
        <div class="chart" width=${width} height="300"></div>
      </div>`

    Plotly.newPlot($('.chart', dom)[0], data, optionsProvider(data));
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

  dataProvider(chart, false, function(json) {
    data = json;
    render();
  })
};

function showChartList(charts, dataProvider, optionsProvider) {
  var container = document.getElementById('app');
  container.innerHTML = "";
  charts.map(function (chart) {
    var dom = document.createElement("div");
    container.appendChild(dom);
    ChartView(chart, dom, dataProvider, optionsProvider);
  });
}

window.showTime = function() {

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
        line: {shape: 'spline'},
        x: points.map(p => { return p.x; }),
        y: points.map(p => { return p.y; }),
        objects: points
      };
    });
  }

  function getOptions(data) {
    var options = defaultOptions();
    var now = new Date();
    var start = new Date()
    start.setMonth(start.getMonth()-3);
    options.xaxis.range = [start, now];
    options.xaxis.rangeselector = {buttons: [
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
    ]};

    return options;
  }

  showChartList(Bench.charts, getData, getOptions);
}

window.showCommit = function () {
  function getData(chart, isSample, callback) {
    $.get("data/" + chart.key + ".json", function (data) { // data cached by browser
      callback(prepareData(data), isSample)
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

    var index = 0;

    var median = {
        visible: "legendonly",
        name: "median",
        mode: "lines+markers",
        type: "scatter",
        line: {shape: 'spline'},
        x: points.map(p => { return index++; }),
        y: points.map(p => { return p.y; }),
        objects: points
    }

    var min = {
        visible: "legendonly",
        name: "min",
        mode: "lines+markers",
        type: "scatter",
        line: {shape: 'spline'},
        x: median.x,
        y: points.map(p => { return p.obj[4]; }),
        objects: points
    }

    var moving = {
      visible: true,
      name: "moving average",
      mode: "lines",
      type: "scatter",
      line: {shape: 'spline'},
      x: median.x,
      y: median.x.map(i => {
        if (i < 2 || i > median.x.length - 3) return median.y[i];
        else return (median.y[i - 2] + median.y[i - 1] + median.y[i] + median.y[i + 1]  + median.y[i + 2]) / 5;
      }),
      objects: points
    }

    return [moving, median, min];
  }

  function getOptions(data) {
    var labelIndices = sample(data[0].x, 60 / data[0].x.length);
    var labels = [];
    for (var i = 0; i < labelIndices.length; i++) {
      var date = data[0].objects[i].x;
      labels.push(date.toISOString().split('T')[0]);
    }

    var options = defaultOptions();
    options.xaxis.range = [data[0].x.length - 100, data[0].x.length - 1];
    options.xaxis.type = "linear";
    // options.xaxis.tickmode = "array";
    // options.xaxis.tickvals = labelIndices;
    // options.xaxis.ticktext = labels;
    return options;
  }

  showChartList(Bench.flattened, getData, getOptions);
}

$(function () {
  flatten();
  showCommit();
})
