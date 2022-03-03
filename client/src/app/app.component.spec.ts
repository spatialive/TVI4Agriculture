import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppTopBarComponent } from './main/topbar/app.topbar.component';
import { AppFooterComponent } from './main/footer/app.footer.component';
import { AppMenuComponent } from './main/menu/app.menu.component';
import { MenuService } from './main/menu/app.menu.service';
import { TopbarMenuService } from './main/topbar/topbarmenu/app.topbarmenu.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [
          AppComponent,
          AppTopBarComponent,
          AppMenuComponent,
          AppFooterComponent
      ],
        providers: [MenuService, TopbarMenuService]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
