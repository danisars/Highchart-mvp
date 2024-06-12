import data2 from "./data2.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    const { close, bar_chart } = data2;

    console.log(close);

    // Prepare the data for Highcharts line chart
    const lineData = close.x.map((date, index) => [
        new Date(date).getTime(),
        close.y[index],
    ]);
    console.log(lineData, "line data");

    // Get the charts container
    const chartsContainer = document.getElementById("chartsContainer");

    // Dynamically create chart containers based on bar_chart length
    bar_chart.forEach((_, index) => {
        const div = document.createElement("div");
        div.className = "chart";
        chartsContainer.appendChild(div);
    });

    const containers = document.querySelectorAll(".chart");

    bar_chart.forEach(function (chartData, i) {
        Highcharts.chart(containers[i], {
            chart: {
                type: "bar",
                marginLeft: i === 0 ? 100 : 10,
                inverted: true,
            },

            title: {
                text: `Bar Chart ${i + 1}`,
                align: "left",
                x: i === 0 ? 90 : 0,
            },

            credits: {
                enabled: false,
            },

            xAxis: [
                {
                    categories: chartData.price,
                    title: {
                        text: "Price Range",
                    }
                },
                {
                    type: "datetime",
                    opposite: true,
                    visible: true,
                    dateTimeLabelFormats: {
                        day: '%Y-%m-%d',
                        week: '%Y-%m-%d',
                        month: '%Y-%m-%d',
                        year: '%Y-%m-%d'
                    },
                },
            ],

            yAxis: [
                {
                    allowDecimals: false,
                    title: {
                        text: "Bar Chart Values",
                    },
                    min: 0,
                    max: 10,
                },
                {
                    type: 'datetime',
                    title: {
                        text: "Close Values",
                    },
                    opposite: true,
                    min: 0,
                },
            ],

            legend: {
                enabled: false,
            },

            series: [
                {
                    name: `Bar ${i + 1}`,
                    data: chartData.value,
                },
                {
                    name: "Close",
                    data: lineData,
                    type: "line",
                    yAxis: 1,
                    xAxis: 1,
                },
            ],
        });
    });
});