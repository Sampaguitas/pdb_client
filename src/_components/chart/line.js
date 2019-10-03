import React, { Component } from 'react';
// import Chart from 'chart.js';
import { Line } from 'react-chartjs-2';

class LineChart extends Component {

    render() {
        // const { data } = this.props;
        const options = {
            legend: {
                display: true,
                position: 'right',
                // onClick: this.onLegendClick
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

        const {data, height, onElementsClick } = this.props;

        return <Line
            data={data} 
            options={options} 
            height={height}
            onElementsClick={onElementsClick} 
        />;
    }
}

export default LineChart;