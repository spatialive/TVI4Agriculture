import {Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import {AppMainComponent} from '../app.main.component';
import jwtDecode from 'jwt-decode';
import {LocalStorageService} from 'ngx-webstorage';
import {User} from '../../@core/interfaces/user.interface';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';

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
    user: User;
    userId: number;
    numberCampaigns: number;
    numberPoints: number;
    constructor(
        public app: AppComponent,
        public appMain: AppMainComponent,
        private storage: LocalStorageService,
        private userService: UserService,
        private router: Router
        ) {
        this.numberCampaigns = 0;
        this.numberPoints = 0;
        const token = this.storage.retrieve('token');
        const jwtToken = jwtDecode(token);
        // @ts-ignore
        this.userId = jwtToken.id;
    }

    ngOnInit() {
        this.userService.countUserCampaign(this.userId).subscribe(result => {
            if (result.data.count){
                this.numberCampaigns = result.data.count;
            }
        });
        this.userService.getPointsInspected(this.userId).subscribe(result => {
            if (Array.isArray(result.data.pointsInspected)){
                this.numberPoints = result.data.pointsInspected.length;
            }
        });
    }
    goToCampaigns(){
        this.router.navigate(['/campaign']);
    }
}
