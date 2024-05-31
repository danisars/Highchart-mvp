import data from './data.js'

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const { iv, hist_volatility, iv_hist_vol_diff, last_value } = data;

  if (typeof Highcharts === "undefined") {
    console.error("Highcharts is not loaded");
  } else {
    console.log("Highcharts is loaded");
  }

  const avgIvHistVolDiff =
    iv_hist_vol_diff.y.reduce((sum, value) => sum + value, 0) /
    iv_hist_vol_diff.y.length;

  Highcharts.stockChart("container", {
    rangeSelector: {
      selected: 0,
      inputEnabled: false,
      buttons: [
        {
          type: "month",
          count: 1,
          text: "1m",
        },
        {
          type: "month",
          count: 3,
          text: "3m",
        },
        {
          type: "month",
          count: 6,
          text: "6m",
        },
        {
          type: "ytd",
          text: "YTD",
        },
        {
          type: "year",
          count: 1,
          text: "1y",
        },
        {
          type: "all",
          text: "All",
        },
      ],
    },

    title: {
      text: "Example Chart with Subplots",
    },

    xAxis: [
      {
        type: "datetime",
        title: {
          text: "Date",
        },
        offset: 0,
        lineWidth: 1,
      },
    ],

    yAxis: [
      {
        title: {
          text: "Implied Volatility",
        },
        opposite: false,
        lineWidth: 1,
      },
      {
        title: {
          text: "Realised Volatility",
        },
        opposite: true,
        offset: 0,
        lineWidth: 1,
      },
      {
        title: false,
        offset: 0,
        lineWidth: 1,
      },
    ],

    series: [
      {
        name: "Implied Volatility",
        data: iv.x.map((date, index) => [
          new Date(date).getTime(),
          iv.y[index],
        ]),
        type: "line",
        tooltip: {
          valueDecimals: 2,
        },
        xAxis: 0,
        yAxis: 0,
        dataLabels: {
          enabled: true,
          formatter() {
            let points = this.series.points;
            if (this.x === points[points.length - 1].x) {
              return last_value.iv;
            }
          },
        },
        id: "iv_series",
      },
      {
        name: "Realised Volatility",
        data: hist_volatility.x.map((date, index) => [
          new Date(date).getTime(),
          hist_volatility.y[index],
        ]),
        type: "line",
        tooltip: {
          valueDecimals: 2,
        },
        xAxis: 0,
        yAxis: 0,
        dataLabels: {
          enabled: true,
          formatter() {
            let points = this.series.points;
            if (this.x === points[points.length - 1].x) {
              return last_value.hist_volatility;
            }
          },
        },
        id: "hist_volatility_series",
      },
      {
        name: "IV-HV Difference Histogram",
        data: iv_hist_vol_diff.x.map((date, index) => [
          new Date(date).getTime(),
          iv_hist_vol_diff.y[index],
        ]),
        type: "column",
        xAxis: 0,
        yAxis: 0,
        colorByPoint: true,
        colors: iv_hist_vol_diff.x.map((date, index) => {
          const relativeAge =
            (iv_hist_vol_diff.x.length - index) / iv_hist_vol_diff.x.length;
          return Highcharts.color(`rgba(0,0,255,${relativeAge})`).get();
        }),
        id: "histogram",
      },
    ],

    tooltip: {
      split: true,
      formatter: function () {
        var tooltip = `Date: ${Highcharts.dateFormat("%Y-%m-%d", this.x)}<br/>`;
        this.points.forEach(function (point) {
          tooltip += `${point.series.name}: ${point.y}<br/>`;
        });
        tooltip += `<b>Last Values:</b><br/>
                      IV: ${last_value.iv}<br/>
                      RV: ${last_value.hist_volatility}<br/>
                      Vol. Spread: ${last_value.iv_hist_vol_diff}<br/>
                      Vol. Spread Percentile: ${last_value.iv_hist_vol_diff_percentile}`;
        return tooltip;
      },
    },

    annotations: [
      {
        labels: [
          {
            point: {
              x: new Date(iv.x[iv.x.length - 1]).getTime(),
              y: last_value.iv,
              xAxis: 0,
              yAxis: 0,
            },
            text: `IV: ${last_value.iv}`,
          },
          {
            point: {
              x: new Date(
                hist_volatility.x[hist_volatility.x.length - 1]
              ).getTime(),
              y: last_value.hist_volatility,
              xAxis: 0,
              yAxis: 1,
            },
            text: `RV: ${last_value.hist_volatility}`,
          },
          {
            point: {
              x: new Date(
                iv_hist_vol_diff.x[iv_hist_vol_diff.x.length - 1]
              ).getTime(),
              y: last_value.iv_hist_vol_diff,
              xAxis: 1,
              yAxis: 2,
            },
            text: `Vol. Spread: ${last_value.iv_hist_vol_diff}`,
          },
        ],
      },
    ],
  });

  console.log("Chart with subplots rendered");
});

