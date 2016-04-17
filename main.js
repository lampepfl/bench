var React = require('react');
var ReactDOM = require('react-dom');
var LineChart = require("./react-chartjs").Line;
var DSV = require('d3-dsv')
var Redux = require('redux')
var ReactRedux = require('react-redux')

function prepareData(tsvData) {
  function accumulate(acc, item) {
    acc.push({ y: item['value'] | 0, x: new Date(item['date'])})

    return acc;
  }

  return {
    datasets : [{
        label: "dataset",
        pointBorderWidth : 1,
        data : tsvData.reduce(accumulate, []),
        fill: false,
        borderColor: "rgba(100,100,100,0.2)",
        backgroundColor: "transparent",
        pointBorderColor: "rgba(220,220,220,1)",
        pointBackgroundColor: "yellow",
        pointBorderWidth: 1
    }]
  }
}

// get all charts from ScalaMeter.data.index
function allCharts() {
  return ScalaMeter.data.index.map(function(item) {
    return {
      name: item.name,
      file: item.file.substr(3)
    }
  });
}

function initialState() {
  var charts = [];

  if (window.localStorage && window.localStorage['dotty-benchmark'])
    return JSON.parse(window.localStorage['dotty-benchmark']);
  else
    return { charts: allCharts().slice(0, 11) };
}

function actionSelect(item) {
  return { type: 'SELECT', item: item };
}

function actionDeselect(item) {
  return { type: 'DESELECT', item: item };
}

function sortList(charts) {
  return charts.sort(function(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}

function reducer(state, action) {
  var charts = [];
  switch (action.type) {
    case 'SELECT':
      charts = state.charts.map(function(item) { return item; });
      charts.push(action.item);
      return { charts: sortList(charts) };
    case 'DESELECT':
      charts = state.charts.filter(function(item) { return item.name !== action.item.name });
      return { charts: sortList(charts) };
    default:
      return state;
  }
}

var store = Redux.createStore(reducer, initialState());

// persist state to localStorage
store.subscribe(function() {
  if (window.localStorage)
    window.localStorage['dotty-benchmark'] = JSON.stringify(store.getState());
})


var ChartComponent = React.createClass({
  getInitialState: function() {
    return { data: {}, options: {}, ready: false };
  },
  componentDidMount: function() {
    var options = {
        responsive: false,
        title: { display: false, text: "Benchmarks for " + this.props.name },
        legend: { display: false },
        tooltips: {
          callbacks: {
            title: function(data) {
              return "";
            }.bind(this),
            label: function(data) {
              return data.yLabel + "ms, " + data.xLabel.toDateString();
            }
          }
        },
        scales: {
          xAxes: [{
            type: "time",
            display: true,
            scaleLabel: { display: false },
            ticks: {
              display: true,
              userCallback: function(tick) {
                // var date = new Date(tick);
                // return (date.getMonth() + 1) + "/" +  (date.getFullYear() - 2000);
                return tick;
              }
            },
            time: {
              displayFormats: {
                'day': "MM'YY", // Sep 4 2015
              }
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: { display: false, labelString: 'ms' }
          }]
        }
      }

    $.get("data/" + this.props.file, function(data) {
      this.setState({ data: prepareData(DSV.tsvParse(data)), ready: true, options: options })
    }.bind(this))
  },
  render: function() {
    if (this.state.ready)
      return <div>
               <h2>{this.props.name}</h2>
               <LineChart data={this.state.data} options={this.state.options} width="800" height="300"/>
             </div>
    else
      return <div><h2>{this.props.name}</h2><p>Loading...</p></div>
  }
});

var _ChartList = React.createClass({
  render: function() {
    var chartNodes = this.props.charts.map(function(chart) {
      return <ChartComponent file={chart.file} name={chart.name} key={chart.name} />
    });

    return <div className="chart-list">{chartNodes}</div>
  }
})

var ChartList = ReactRedux.connect(function(state) { return { charts: state.charts } })(_ChartList);


var _ChoiceList = React.createClass({
  selected: function(item) {
    return this.props.charts.filter(function(d) { return d.name === item.name }).length > 0;
  },
  handleChange: function(chart, e) {
    if (e.target.checked) {
      this.props.select(chart);
    } else {
      this.props.deselect(chart);
    }
  },
  render: function() {
    var items = allCharts().map(function(chart) {
      return <span className="sidebar-nav-item" key={chart.name}>
               <input type="checkbox" defaultChecked={this.selected(chart)} onChange={this.handleChange.bind(this, chart)} />
               {chart.name}
             </span>
    }.bind(this));

    return <nav className="sidebar-nav">{items}</nav>
  }
})

var ChoiceList = ReactRedux.connect(function(state) { return { charts: state.charts } },
                                    { select: actionSelect, deselect: actionDeselect })(_ChoiceList);


ReactDOM.render(
  <ReactRedux.Provider store={store}><ChartList/></ReactRedux.Provider>,
  document.getElementById('app')
);

ReactDOM.render(
  <ReactRedux.Provider store={store}><ChoiceList/></ReactRedux.Provider>,
  document.getElementById('sidebar-app')
);
