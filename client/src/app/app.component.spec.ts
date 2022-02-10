import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppMenuComponent } from './app.menu.component';
import { MenuService } from './app.menu.service';
import { TopbarMenuService } from './app.topbarmenu.service';

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
