import data from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const { iv, hist_volatility, iv_hist_vol_diff, last_value } = data;

  const avgIvHistVolDiff =
    iv_hist_vol_diff.y.reduce((sum, value) => sum + value, 0) /
    iv_hist_vol_diff.y.length;

  function filterDataByDateRange(startDate, endDate) {
    const filteredData = {
      iv: { x: [], y: [] },
      hist_volatility: { x: [], y: [] },
      iv_hist_vol_diff: { x: [], y: [] },
    };

    iv.x.forEach((date, index) => {
      const dateTime = new Date(date).getTime();
      if (dateTime >= startDate && dateTime <= endDate) {
        filteredData.iv.x.push(dateTime);
        filteredData.iv.y.push(iv.y[index]);
        filteredData.hist_volatility.x.push(dateTime);
        filteredData.hist_volatility.y.push(hist_volatility.y[index]);
        filteredData.iv_hist_vol_diff.x.push(dateTime);
        filteredData.iv_hist_vol_diff.y.push(iv_hist_vol_diff.y[index]);
      }
    });

    return filteredData;
  }

  function createHistogramChart(filteredData) {
    Highcharts.chart("container2", {
      title: {
        text: "IV Hist Vol Diff Histogram",
      },
      boost: {
        useGPUTranslations: true,
        usePreAllocated: true,
      },
      xAxis: [
        {
          title: { text: "IV Hist Vol Diff" },
          plotLines: [
            {
              color: "blue",
              value: last_value.iv_hist_vol_diff,
              width: 2,
              zIndex: 5,
              label: {
                text: `Last: ${last_value.iv_hist_vol_diff.toFixed(2)}`,
                align: "left",
                style: {
                  color: "blue",
                  fontWeight: "bold",
                },
              },
            },
            {
              color: "red",
              value: avgIvHistVolDiff,
              width: 2,
              zIndex: 5,
              label: {
                text: `Mean: ${avgIvHistVolDiff.toFixed(2)}`,
                align: "left",
                style: {
                  color: "red",
                  fontWeight: "bold",
                },
              },
            },
          ],
        },
      ],
      yAxis: [
        {
          title: { text: "Frequency" },
        },
      ],
      series: [
        {
          name: "Histogram",
          type: "histogram",
          baseSeries: "s1",
          zIndex: -1,
          dataGrouping: {
            enabled: true,
          },
          turboThreshold: 0,
        },
        {
          name: "IV Hist Vol Diff",
          type: "scatter",
          data: filteredData.iv_hist_vol_diff.x.map((x, index) => [
            x,
            filteredData.iv_hist_vol_diff.y[index],
          ]),
          id: "s1",
          boostThreshold: 1000,
          turboThreshold: 0,
          marker: {
            radius: 1,
          },
          visible: false,
          showInLegend: false,
        },
      ],
    });
  }

  const chart = Highcharts.stockChart("container", {
    rangeSelector: {
      selected: 0,
      inputEnabled: true,
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
          events: {
            click: function () {
              const filteredData = filterDataByDateRange(
                new Date(iv.x[0]).getTime(),
                new Date(iv.x[iv.x.length - 1]).getTime()
              );
              createHistogramChart(filteredData);
            },
          },
        },
      ],
    },

    title: {
      text: "Example Chart with Subplots",
    },

    xAxis: {
      type: "datetime",
      tickInterval: 24 * 3600 * 1000,
      crosshair: true,
      labels: {
        formatter: function () {
          return Highcharts.dateFormat(
            "%Y-%m-%d",
            new Date(this.value).getTime()
          );
        },
      },
      events: {
        afterSetExtremes: (event) => {
          const min = event.min;
          const max = event.max;
          const filteredData = filterDataByDateRange(min, max);
          createHistogramChart(filteredData);
        },
      },
    },

    yAxis: [
      {
        title: {
          text: "Implied Volatility",
        },
        opposite: false,
        lineWidth: 1,
        offset: 0,
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
        title: {
          text: "IV-HV Difference",
        },
        plotLines: [
          {
            color: "red",
            value: avgIvHistVolDiff,
            width: 2,
            zIndex: 4,
            label: {
              text: `Average IV-HV Difference: ${avgIvHistVolDiff.toFixed(2)}`,
              align: "right",
              style: {
                color: "red",
                fontWeight: "bold",
              },
            },
          },
        ],
        opposite: true,
        offset: 60,
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
        zIndex: 2,
        id: "iv_series",
        boostThreshold: 1000,
        dataGrouping: {
          enabled: true,
        },
        turboThreshold: 0,
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
        yAxis: 1,
        zIndex: 2,
        id: "hist_volatility_series",
        boostThreshold: 1000,
        dataGrouping: {
          enabled: true,
        },
        turboThreshold: 0,
      },
      {
        name: "IV-HV Difference",
        data: iv_hist_vol_diff.x.map((date, index) => [
          new Date(date).getTime(),
          iv_hist_vol_diff.y[index],
        ]),
        type: "column",
        xAxis: 0,
        yAxis: 2,
        zIndex: -1,
        id: "histogram",
        boostThreshold: 1000,
        dataGrouping: {
          enabled: true,
        },
        turboThreshold: 0,
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
  });

  const initialMin = chart.xAxis[0].getExtremes().min;
  const initialMax = chart.xAxis[0].getExtremes().max;
  const initialFilteredData = filterDataByDateRange(initialMin, initialMax);
  createHistogramChart(initialFilteredData);
});
