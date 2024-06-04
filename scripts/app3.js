document.addEventListener('DOMContentLoaded', function () {
    Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },
        title: {
            text: 'Candlestick Chart with Pivot Points and Volume by Price'
        },
        yAxis: [{
            title: {
                text: 'Price'
            },
            height: '60%',
            lineWidth: 2,
            resize: {
                enabled: true
            }
        }, {
            title: {
                text: 'Volume'
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
        }],
        tooltip: {
            split: true
        },
        series: [{
            type: 'candlestick',
            name: 'AAPL',
            data: [
                // Sample data in OHLC format
                [Date.UTC(2020, 0, 1), 120, 135, 115, 130],
                [Date.UTC(2020, 0, 2), 130, 140, 125, 135],
                // More data points...
            ],
            id: 'candlestick'
        }, {
            type: 'column',
            name: 'Volume',
            data: [
                // Sample volume data
                [Date.UTC(2020, 0, 1), 100000],
                [Date.UTC(2020, 0, 2), 150000],
                // More data points...
            ],
            yAxis: 1
        }, {
            type: 'vbp',
            linkedTo: 'candlestick',
            params: {
                volumeSeriesID: 'volume'
            },
            dataLabels: {
                enabled: true,
                format: '{point.vbpValue:.2f}'
            },
            zoneLines: {
                enabled: false
            }
        }, {
            type: 'pivotpoints',
            linkedTo: 'candlestick'
        }]
    });
});
