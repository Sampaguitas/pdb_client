import React, { Component } from 'react';
// import Chart from 'chart.js';
import { Line } from 'react-chartjs-2';

class LineChart extends Component {

    render() {

        const {onLegendClick} = this.props;

        const options = {
            legend: {
                display: true,
                position: 'right',
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

        const {data, height} = this.props; //onElementsClick, getElementsAtEvent, getDatasetAtEvent 

        return <Line
            data={data} 
            options={options} 
            height={height}
            responsive={true}
            // onElementsClick={onElementsClick}
            // getElementsAtEvent={getElementsAtEvent}
            // getDatasetAtEvent={getDatasetAtEvent}
        />;
    }
}

export default LineChart;