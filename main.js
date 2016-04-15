var Chart = require("chart.js");
var React = require('react');
var ReactDOM = require('react-dom');
var LineChart = require("react-chartjs/lib/line");


var MyComponent = React.createClass({
  render: function() {
    return <LineChart data={chartData} options={chartOptions} width="600" height="250"/>
  }
});

Chart.defaults.global.responsive = true;

function rand(min, max, num) {
  var rtn = [];
  while (rtn.length < num) {
    rtn.push((Math.random() * (max - min)) + min);
  }
  return rtn;
}


function data1() {
  return {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: rand(32, 100, 7)
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: rand(32, 100, 7)
        }
    ]
  };
}


var ChartContainer = React.createFactory(React.createClass({
  getInitialState: function() {
    return {
      data: this.props.props.data()
    };
  },
  render: function() {
    var props = this.props.props;
    var factory = this.props.factory;
    var _props = _.defaults({
      data: this.state.data
    }, props);
    var component = new factory(_props);
    return React.createElement('div', {},
        React.createElement('div', {},
          React.createElement('button', {onClick: this.regen}, "Regenerate")
        ),
        component
    );
  },
  regen: function() {
    this.setState({data: this.props.props.data()});
  }
}));

function example(type, commonJSName, props) {
  var factory = React.createFactory(Chart.React[type]);
  var component = new ChartContainer({props: props, factory: factory});
  var container = $('#examples');
  var root = document.createElement('div');
  container.append(root);
  var title = $('<h2>' + type + ' Chart</h2>');
  root.appendChild(title[0]);
  var varName = type + 'Chart';
  var code = 'var ' + varName + ' = require("react-chartjs").' + type + ';\n\n' +
             'var MyComponent = React.createClass({\n' +
             '  render: function() {\n' +
             '    return &lt;' + varName + ' data={chartData} options={chartOptions}/&gt;\n' +
             '  }\n' +
             '});';
  root.appendChild($('<pre><code>' + code + '</code></pre>')[0]);
  var chartContainer = document.createElement('div');
  root.appendChild(chartContainer);
  React.render(component, chartContainer);
}
