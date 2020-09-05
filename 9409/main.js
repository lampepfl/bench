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
      autorange: true,
      zeroline: false,
      nticks: 20,
      // autotick: true,
      // range: defaultRange(),
      // rangeslider: {},
      // type: 'date'
    },
    yaxis: {
      title: 'milliseconds',
      autorange: true,
      rangemode: "nonnegative",
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

    Plotly.newPlot($('.chart', dom)[0], data, optionsProvider(data, chart));
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

function showChartList(charts, dataProvider, optionsProvider) {
  var container = document.getElementById('app');
  container.innerHTML = "";
  charts.map(function (chart) {
    var dom = document.createElement("div");
    container.appendChild(dom);
    ChartView(chart, dom, dataProvider, optionsProvider);
  });
}

window.showCommit = function () {
  function getData(chart, callback) {
    $.get("data/" + chart.key + ".json", function (data) { // data cached by browser
      callback(prepareData(data, chart));
    });
  }

  function prepareData(data, chart) {
    var points = sort(data.map(process))

    var index = 0;

    function visible(trace) {
      if (chart.key === "dotty") {
        return true;
      }
      else if (trace === "moving") return true;
      else return "legendonly";
    }

    var median = {
      visible: visible("median"),
      name: "median",
      mode: "markers",
      type: "scatter",
      line: {shape: 'spline'},
      hoverinfo: "x+y+text",
      hovertext: points.map(p => { return "#" + p.obj[0] + ", " + p.obj[2] }),
      x: points.map(p => { return index++; }),
      y: points.map(p => { return p.y; }),
      objects: points
    }

    var min = {
      visible: "legendonly",
      name: "min",
      mode: "markers",
      type: "scatter",
      line: {shape: 'spline'},
      x: median.x,
      y: points.map(p => { return p.obj[4]; }),
      objects: points
    }

    var moving = {
      visible: visible("moving"),
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

  function getOptions(data, chart) {
    var options = defaultOptions();
    options.xaxis.tickmode = "auto";

    const x_data = data[0].x;
    const y_data = data[0].y;

    let range = x_data.length > 100 ? 100 : x_data.length;

    options.xaxis.autorange = false;
    options.xaxis.range = [x_data.length - range, x_data.length];

    var max_y = 0;
    var min_y = y_data[0];
    for (let i = y_data.length - range; i < y_data.length; i++) {
      max_y = Math.max(max_y, y_data[i]);
      min_y = Math.min(min_y, y_data[i]);
    }
    max_y *= 1.1;              // Give a small margin on top
    min_y *= 0.9;              // Give a small margin at bottom
    options.yaxis.autorange = false;
    options.yaxis.range = [min_y, max_y];

    options.xaxis.customTickFn = function(i) {
      if (i >= 0 && i < data[0].objects.length) {
        var date = data[0].objects[i].x;
        return date.toISOString().substring(0, 10);
      }
      else {
        return "";
      }
    };
    return options;
  }

  showChartList(Bench.flattened, getData, getOptions);
}

$(function () {
  flatten();
  showCommit();
})
