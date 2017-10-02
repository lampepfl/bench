var React = require('react');
var ReactDOM = require('react-dom');
var LineChart = require("./react-chartjs").Line;
var Redux = require('redux');
var ReactRedux = require('react-redux');
Bench = Bench || {};

function prepareData(key) {
  var index = 0;
  function accumulate(acc, item) {
    if (item.key === key) {
      acc.push({ y: item.median, x: index, obj: item });
      index++;
    }

    return acc;
  }

  function sample(points, rate) {
    return points.reduce(function(acc, item) {
      if (Math.random() < rate) acc.push(item);

      return acc;
    }, []);
  }

  var points = Bench.dataset.reduce(accumulate, []).sort(function(a, b) {
    return new Date(a.obj.time) - new Date(b.obj.time);
  });

  var pts1 = sample(points.slice(0, -100), 50 / (points.length - 100));
  var pts2 = sample(points.slice(-100, -40), 0.5);
  var pts3 = points.slice(-40);

  points = pts1.concat(pts2).concat(pts3);

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
    var date = new Date(points[i].obj.time);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    labels.push(day + "/" + month);
  }

  index = 0
  var minPoints = points.map(function(p) {
    return { y: Math.min.apply(null, p.obj.runs), x: p.index, obj: p.obj }
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

function allCharts() {
  return Bench.charts;
}

function actionSelect(item) {
  return { type: 'SELECT', item: item };
}

function actionDeselect(item) {
  return { type: 'DESELECT', item: item };
}

function reducer(state, action) {
  var charts = [];
  switch (action.type) {
    case 'SELECT':
      charts = state.charts.map(function (item) { return item; });  // must create new array for Redux to work
      charts.push(action.item);
      return { charts: charts };
    case 'DESELECT':
      charts = state.charts.filter(function (item) { return item.name !== action.item.name }); // same as above
      return { charts: charts };
    default:
      return state;
  }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var ChartComponent = React.createClass({
  getInitialState: function () {
    return { data: {}, options: {}, ready: false };
  },
  componentDidMount: function () {
    var data = prepareData(this.props.id);

    function getItem(didx, pidx) {
      return data["datasets"][didx].data[pidx].obj;
    }

    var options = {
      responsive: true,
      tooltips: {
        callbacks: {
          title: function (data) {
            var item = getItem(data[0].datasetIndex, data[0].index);
            var date = new Date(item.time);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            return "PR#" + item.pr + " \n" + item.commit + " \n" + day + "/" + month + "/" + year;
          }.bind(this),
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
          var win = window.open(Bench.pr_base_url + obj.pr, '_blank');
          win.focus();
        }
      }
    }

    this.setState({ data: data, ready: true, options: options })
  },
  render: function () {
    var width = $("#app").width();

    if (this.state.ready)
      return <div>
        <h3><a href={this.props.url}>{this.props.name}</a></h3>
        <LineChart data={this.state.data} options={this.state.options} width={width} height="300" />
      </div>
    else
      return <div><h2>{this.props.name}</h2><p>Loading...</p></div>
  }
});

var _ChartList = React.createClass({
  render: function () {
    var chartNodes = this.props.charts.map(function (chart) {
      return <ChartComponent url={chart.url} name={chart.name} id={chart.key} />
    });

    return <div className="chart-list">{chartNodes}</div>
  }
})

var ChartList = ReactRedux.connect(function (state) { return { charts: state.charts } })(_ChartList);

function initialState() {
  return { charts: allCharts() };
}

$.get("data/dataset.json", function (dataset) {
  Bench.dataset = dataset;

  var store = Redux.createStore(reducer, initialState());

  ReactDOM.render(
    <ReactRedux.Provider store={store}><ChartList /></ReactRedux.Provider>,
    document.getElementById('app')
  );
})
