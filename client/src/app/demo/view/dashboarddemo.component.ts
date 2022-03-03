import {Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import {AppMainComponent} from '../../main/app.main.component';
import {MenuItem} from 'primeng/api';

@Component({
    templateUrl: './dashboard.component.html'
})
export class DashboardDemoComponent implements OnInit {

    overviewChart: any;

    overviewChartOptions: any;

    overviewWeek: any;

    selectedOverviewWeek: any;

    chartData: any;

    chartOptions: any;

    chart: any;

    constructor(public app: AppComponent, public appMain: AppMainComponent) { }

    ngOnInit() {
        this.overviewChart = {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            datasets: [
                {
                    data: [2, 1, 0.5, 0.6, 0.5, 1.3, 1],
                    borderColor: [
                        '#FADB5F',
                    ],
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'transparent',
                    type: 'line',
                    fill: false,
                },
                {
                    data: [4.88, 3, 6.2, 4.5, 2.1, 5.1, 4.1],
                    backgroundColor: [this.app.colorScheme === 'dark' ? '#879AAF' : '#E4E7EB'] ,
                    fill: true,
                    borderRadius: 10,
                    borderSkipped: 'top bottom',
                    barPercentage: 0.3
                }
            ]
        };

        this.overviewChartOptions = this.getOrdersOptions();

        this.overviewWeek = [
            {name: 'Last Week', code: '0'},
            {name: 'This Week', code: '1'}
        ];

        this.chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    data: [11, 17, 30, 60, 88, 92],
                    borderColor: 'rgba(25, 146, 212, 0.5)',
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'transparent',
                    fill: false,
                    tension: .4
                },
                {
                    data: [11, 19, 39, 59, 69, 71],
                    borderColor: 'rgba(25, 146, 212, 0.5)',
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'transparent',
                    fill: false,
                    tension: .4
                },
                {
                    data: [11, 17, 21, 30, 47, 83],
                    backgroundColor: 'rgba(25, 146, 212, 0.2)',
                    borderColor: 'rgba(25, 146, 212, 0.5)',
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'transparent',
                    fill: true,
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    max: 100,
                    min: 0,
                    ticks: {
                        color: '#A0A7B5'
                    }
                },
                x: {
                    grid: {
                        display: true,
                    },
                    ticks: {
                        color: '#A0A7B5',
                        beginAtZero: true,
                    }
                }
            }
        };

        this.getGradient();

        this.appMain['refreshChart'] = () => {
            this.overviewChartOptions = this.getOrdersOptions();
            this.overviewChart.datasets[1].backgroundColor[0] = this.app.colorScheme === 'dark' ? '#879AAF' : '#E4E7EB';
        };

    }

    getGradient() {
        // this.chart = document.getElementsByTagName('canvas')[1].getContext('2d');
        // const gradientStroke = this.chart.createLinearGradient(100, 0, 1150, 100);
        // gradientStroke.addColorStop(0, 'rgba(21, 184, 194, 0)');
        // gradientStroke.addColorStop(0.5, 'rgba(25, 146, 212, 1)');
        // gradientStroke.addColorStop(1, 'rgba(23, 88, 124, 1)');
        //
        // const gradientFill = this.chart.createLinearGradient(0, 0, 1150, 0);
        // gradientFill.addColorStop(1, 'rgba(25, 146, 212, 0.34)');
        // gradientFill.addColorStop(0, 'rgba(232, 247, 255, 0.34)');
        //
        // this.chartData.datasets[0].borderColor = gradientStroke;
        // this.chartData.datasets[1].borderColor = gradientStroke;
        // this.chartData.datasets[2].borderColor = gradientStroke;
        //
        // this.chartData.datasets[2].backgroundColor = gradientFill;
    }

    getOrdersOptions() {
        return {
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            hover: {
                mode: 'index'
            },
            scales: {
                y: {
                    max: 7,
                    min: 0,
                    ticks: {
                        stepSize: 0,
                        callback: function(value, index) {
                            if (index === 0) {
                                return value;
                            }
                            else {
                                return value + 'k';
                            }
                        },
                        color: this.app.colorScheme === 'dark' ? '#DBE2EB' : '#3E4C59'
                    },
                    grid: {
                        borderDash: [2, 2],
                        color: this.app.colorScheme === 'dark' ? '#4E657F' : '#E4E7EB',
                        drawBorder: false,
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        beginAtZero: true,
                        color: this.app.colorScheme === 'dark' ? '#DBE2EB' : '#3E4C59'
                    }
                }
            }
        };
    }

    changeOverviewWeek(event) {
        const dataSet1 = [
            [2, 1, 0.5, 0.6, 0.5, 1.3, 1],
            [4.88, 3, 6.2, 4.5, 2.1, 5.1, 4.1]
        ];
        const dataSet2 = [
            [3, 2.4, 1.5, 0.6, 4.5, 3.3, 2],
            [3.2, 4.1, 2.2, 5.5, 4.1, 3.6, 3.5],
        ];

        if (event.value.code === '1') {
            this.overviewChart.datasets[0].data = dataSet2[parseInt('0')];
            this.overviewChart.datasets[1].data = dataSet2[parseInt('1')];
        } else {
            this.overviewChart.datasets[0].data = dataSet1[parseInt('0')];
            this.overviewChart.datasets[1].data = dataSet1[parseInt('1')];
        }
    }
}
