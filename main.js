var React = require('react');
var ReactDOM = require('react-dom');
var LineChart = require("./react-chartjs").Line;
var DSV = require('d3-dsv')


function prepareData(tsvData) {
  function accumulate(acc, item) {
    acc.push({ y: item['value'] | 0, x: new Date(item['date'])})

    return acc;
  }

  function randomColorFactor() {
    return Math.round(Math.random() * 255);
  }

  function randomColor(opacity) {
    return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
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

    $.get("data/" + this.props.file, function(data) {
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

var ChartList = React.createClass({
  render: function() {
    var chartNodes = this.props.data.map(function(chart) {
      return <ChartComponent file={chart.file} name={chart.name} />
    });

    return <div class="chart-list">{chartNodes}</div>
  }
})

ReactDOM.render(
  <ChartList data={allCharts().slice(0, 5)} />,
  document.getElementById('app')
);

