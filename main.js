var Chart = require("chart.js");
var React = require('react');
var ReactDOM = require('react-dom');
var LineChart = require("react-chartjs/lib/line");


var MyComponent = React.createClass({
  render: function() {
    return <LineChart data={chartData} options={chartOptions} width="600" height="250"/>
  }
});

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementsByTagName('body')[0]
);
