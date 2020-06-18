import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class LineChart extends Component {

    render() {

        const {onLegendClick, data, width, height, clPo, clPoRev, unit, period} = this.props; //onElementsClick, getElementsAtEvent, getDatasetAtEvent 
        const fontFamily = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';"
        const options = {
            maintainAspectRatio: false,
            title: {
                display: true,
                position: 'top',
                text: `Client Po: "${clPo}"   |   Revision: "${clPoRev}"`,
                fontSize: 14,
                fontFamily: fontFamily
            },
            legend: {
                display: true,
                position: 'right',
                labels: {
                    fontFamily: fontFamily
                },
                onClick: function(e, legendItem) {
                    onLegendClick(legendItem);
                    var index = legendItem.datasetIndex;
                    var ci = this.chart;
                    var meta = ci.getDatasetMeta(index);
                    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
                    ci.update();
                }
            },
            tooltips: {
               mode: 'label',
               label: 'mylabel',
               callbacks: {
                   label: function(tooltipItem, data) {
                       return Intl.NumberFormat().format(tooltipItem.yLabel);
                    }, 
                },
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: `${unit}`,
                        fontSize: 12,
                        fontFamily: fontFamily
                    },
                    ticks: {
                        callback: function(label, index, labels) {
                            return Intl.NumberFormat().format(label); 
                        },
                        beginAtZero:true,
                        fontSize: 10,
                    },
                    gridLines: {
                        display: true
                    },
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: `${period}`,
                        fontSize: 12,
                        fontFamily: fontFamily
                    },
                    ticks: {
                        beginAtZero: true,
                        fontSize: 10
                    },
                    gridLines: {
                        display:true
                    },
                }]
            }
        }

        return <Line
            data={data} 
            options={options}
            width={width}
            height={height}
            responsive={true}
        />;
    }
}

export default LineChart;