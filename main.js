var React = require('react');
var ReactDOM = require('react-dom');
var LineChart = require("./react-chartjs").Line;
var DSV = require('d3-dsv')


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
        fill: false
    }]
  }
}

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
                var date = new Date(tick);
                return (date.getMonth() + 1) + "/" +  (date.getFullYear() - 2000);
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
            scaleLabel: { display: true, labelString: 'ms' }
          }]
        }
      }

    $.get("data/" + this.props.test, function(data) {
      this.setState({ data: prepareData(DSV.tsvParse(data)), ready: true, options: options })
    }.bind(this))
  },
  render: function() {
    if (this.state.ready)
      return <div>
               <h1>{this.props.name}</h1>
               <LineChart data={this.state.data} options={this.state.options} width="800" height="300"/>
             </div>
    else
      return <div><h1>{this.props.name}</h1><p>Loading...</p></div>
  }
});

ReactDOM.render(
  <ChartComponent test="tests.dotc.dotc.dsv" name="dotc" />,
  document.getElementById('react-chart')
);

