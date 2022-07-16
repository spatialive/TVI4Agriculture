import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AppMainComponent} from './main/app.main.component';
import {AppLoginComponent} from './auth/login/app.login.component';
import {AppSignupComponent} from './auth/signup/app.signup.component';
import {HarvestComponent} from './harvest/harvest.component';
import {ClassComponent} from './class/class.component';
import {CampaignComponent} from './campaign/campaign.component';
import {PublicComponent} from './public/public.component';
import {AuthGuardService} from './services/auth/auth-guard.service';
import {DashboardDemoComponent} from './main/dashboard/dashboarddemo.component';
import {AppErrorComponent} from './pages/error/app.error.component';
import {AppAccessdeniedComponent} from './pages/accessdenied/app.accessdenied.component';
import {AppNotfoundComponent} from './pages/notfound/app.notfound.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                canActivate: [AuthGuardService],
                children: [
                    {path: '', component: DashboardDemoComponent},
                    {path: 'campaign', component: CampaignComponent},
                    {path: 'class', component: ClassComponent},
                    {path: 'harvest', component: HarvestComponent}
                ]
            },
            {path: 'public', component: PublicComponent},
            {path: 'error', component: AppErrorComponent},
            {path: 'access', component: AppAccessdeniedComponent},
            {path: 'notfound', component: AppNotfoundComponent},
            {path: 'login', component: AppLoginComponent},
            {path: 'signup', component: AppSignupComponent},
            {path: '**', redirectTo: '/notfound'},
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
