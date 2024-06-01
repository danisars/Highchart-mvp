import data2 from "./data2.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const { close, bar_chart } = data2;

  if (typeof Highcharts === "undefined") {
    console.error("Highcharts is not loaded");
  } else {
    console.log("Highcharts is loaded");
  }

  function formatDate(date) {
    return new Date(date).toISOString().split("T")[0];
  }

  function parsePriceRange(priceRange) {
    const [min, max] = priceRange.split("-").map(Number);
    console.log({ min }, { max });
    return { min, max };
  }
  
  function initializeCombinedChart() {
    const combinedChartOptions = {
      chart: {
        type: "line",
      },
      title: {
        text: "Close Values and Bar Charts",
      },
      xAxis: {
        type: "datetime",
        title: {
          text: "Date",
        },
        labels: {
          formatter() {
            return Highcharts.dateFormat(
              "%Y-%m-%d",
              new Date(this.value).getTime()
            );
          },
        },
      },
      yAxis: [
        {
          title: {
            text: "Value",
          },
          plotLines: [
            {
              value: 0,
              width: 1,
              color: "#808080",
            },
          ],
        },
        {
          title: {
            text: "Bar Chart Values",
          },
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
      },
      series: [
        {
          name: "Close",
          data: close.x.map((date, index) => [
            new Date(date).getTime(),
            close.y[index],
          ]),
          tooltip: {
            valueDecimals: 1,
          },
        },
        {
          type: "candlestick",
          name: "Candlestick",
          data: close.x.map((date, index) => {
            const closeValue = close.y[index];
            const openValue = closeValue + (Math.random() * 50 - 25);
            const highValue =
              Math.max(openValue, closeValue) + Math.random() * 25;
            const lowValue =
              Math.min(openValue, closeValue) - Math.random() * 25;
            return [
              new Date(date).getTime(),
              openValue,
              highValue,
              lowValue,
              closeValue,
            ];
          }),
          tooltip: {
            valueDecimals: 1,
          },
          color: "red",
          upColor: "green",
          lineColor: 'red',
          upLineColor: 'green',
          dataGrouping: {
            units: [
              ["day", [1]],
              ["week", [1]],
              ["month", [1, 3, 6]],
            ],
          },
        },
      ],
    };

    Highcharts.stockChart("container", combinedChartOptions);
  }

  initializeCombinedChart();
});
