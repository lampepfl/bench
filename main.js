var React = require('react');
var ReactDOM = require('react-dom');
var LineChart = require("./react-chartjs").Line;

Bench = Bench || {};

function prepareData(key, isSample) {
  var index = 0;
  function accumulate(acc, item) {
    if (item.key === key) {
      acc.push({ y: item.median, x: index, obj: item });
      index++;
    }

    return acc;
  }

  var points = Bench.dataset.reduce(accumulate, []).sort(function(a, b) {
    return new Date(a.obj.time) - new Date(b.obj.time);
  });

  function sample(points, rate) {
    return points.reduce(function(acc, item) {
      if (Math.random() < rate) acc.push(item);

      return acc;
    }, []);
  }

  if (isSample) {
    var pts1 = sample(points.slice(0, -100), 50 / (points.length - 100));
    var pts2 = sample(points.slice(-100, -40), 0.5);
    var pts3 = points.slice(-40);

    points = pts1.concat(pts2).concat(pts3);
  }

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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getState(id, showAll) {
  var data = prepareData(id, !showAll);

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
        var win = window.open(Bench.pr_base_url + obj.pr, '_blank');
        win.focus();
      }
    }
  }

  return { data: data, ready: true, options: options, showAll: showAll };
}

var ChartComponent = React.createClass({
  getInitialState: function () {
    return { data: {}, options: {}, ready: false, showAll: false };
  },
  handleChange: function (e) {
    this.setState(getState(this.props.id, e.target.checked));
  },
  componentDidMount: function () {
    this.setState(getState(this.props.id, this.state.showAll));
  },
  render: function () {
    var width = $("#app").width();

    if (this.state.ready)
      return <div>
        <h3>
          <a href={this.props.url}>{this.props.name}</a>
          <span style={{float: "right"}}>
            <input type="checkbox" defaultChecked={this.props.showAll} onChange={this.handleChange} />
            <small style={{color: "#aaa", fontSize: "15px"}}> show all points</small>
          </span>
        </h3>
        <LineChart data={this.state.data} options={this.state.options} width={width} height="300" />
      </div>
    else
      return <div><h2>{this.props.name}</h2><p>Loading...</p></div>
  }
});

var ChartList = React.createClass({
  render: function () {
    var chartNodes = this.props.charts.map(function (chart) {
      return <ChartComponent url={chart.url} name={chart.name} id={chart.key} />
    });

    return <div className="chart-list">{chartNodes}</div>
  }
})


$.get("data/dataset.json", function (dataset) {
  Bench.dataset = dataset;

  ReactDOM.render(
    <ChartList charts={Bench.charts}/>,
    document.getElementById('app')
  );
})
