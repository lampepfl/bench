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
      acc.push({ y: item.avg, x: index, obj: item });
      index++;
    }

    return acc;
  }

  var points = Bench.dataset.reduce(accumulate, []);

  var labels = [];
  for (var i = 0; i < points.length; i++) {
    labels.push(i);
  }

  return {
    labels: labels,
    datasets: [{
      label: "dataset",
      data: points,
      fill: false,
      borderColor: "rgba(100,100,100,0.2)",
      backgroundColor: "transparent",
      pointBorderColor: "rgba(220,220,220,1)",
      pointBackgroundColor: "yellow",
      pointBorderWidth: 1
    }]
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
      title: { display: false, text: "Benchmarks for " + this.props.name },
      legend: { display: false },
      tooltips: {
        callbacks: {
          title: function (data) {
            return "";
          }.bind(this),
          label: function (point) {
            var item = getItem(point.datasetIndex, point.index);
            var time = new Date(item.time);
            return point.yLabel + "µs \n" + "PR#" + item.pr + " \n" + time.toDateString();
          }
        }
      },
      scales: {
        yAxes: [{
          display: true,
          scaleLabel: { display: false, labelString: 'µs' }
        }]
      },
      onClick: function(e) {
        var activeElems = this.getElementsAtEvent(e);
        if (actionSelect.length == 1) {
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


var _ChoiceList = React.createClass({
  selected: function (item) {
    return this.props.charts.filter(function (d) { return d.name === item.name }).length > 0;
  },
  handleChange: function (chart, e) {
    if (e.target.checked) {
      this.props.select(chart);
    } else {
      this.props.deselect(chart);
    }
  },
  render: function () {
    var items = allCharts().map(function (chart) {
      return <span className="sidebar-nav-item" key={chart.key}>
        <input type="checkbox" defaultChecked={this.selected(chart)} onChange={this.handleChange.bind(this, chart)} />
        {chart.name}
      </span>
    }.bind(this));

    return <nav className="sidebar-nav">{items}</nav>
  }
})

var ChoiceList = ReactRedux.connect(function (state) { return { charts: state.charts } },
  { select: actionSelect, deselect: actionDeselect })(_ChoiceList);

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

  ReactDOM.render(
    <ReactRedux.Provider store={store}><ChoiceList /></ReactRedux.Provider>,
    document.getElementById('sidebar-app')
  );
})
