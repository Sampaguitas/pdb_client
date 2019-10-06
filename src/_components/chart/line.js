import React, { Component } from 'react';
// import Chart from 'chart.js';
import { Line } from 'react-chartjs-2';




class LineChart extends Component {

    render() {
        
        var newLegendClickHandler = function(e, legendItem) {
            var index = legendItem.datasetIndex;
            var ci = this.chart;
            var meta = ci.getDatasetMeta(index);
        
            // See controller.isDatasetVisible comment
            meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
        
            // We hid a dataset ... rerender the chart
            ci.update();
        }


        // const { data } = this.props;
        const options = {
            legend: {
                display: true,
                position: 'right',
                onClick: newLegendClickHandler
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
                    ticks: {
                        beginAtZero: true,
                        fontSize: 10
                    },
                    gridLines: {
                        display:true
                    },
                    scaleLabel: {
                        display: true,
                        fontSize: 10,
                   }
                }]
            }
        }

        const {data, height, onElementsClick, getElementsAtEvent } = this.props;

        return <Line
            data={data} 
            options={options} 
            height={height}
            // onElementsClick={onElementsClick}
            // getElementsAtEvent={getElementsAtEvent}
        />;
    }
}

export default LineChart;