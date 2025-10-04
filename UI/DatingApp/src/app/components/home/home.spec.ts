import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Home } from "./home";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter, Router } from "@angular/router";
import { By } from "@angular/platform-browser";
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('home component', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let router: Router
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([
          { path: 'register', component: RegisterTest }
        ]),
        provideZonelessChangeDetection()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    router = TestBed.inject(Router)
    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  })

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  it('register buuton should route to /register path', async () => {
    const button = fixture.debugElement.query(
      By.css('[test-id="register-button"]')
    );

    button.nativeElement.click();
    await fixture.whenStable()

    expect(router.url).toEqual('/register')
  });

  it('register buuton should route to /register path - with harness', async () => {
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'Register' }));

    await button.click();

    expect(router.url).toEqual('/register')
  });
});

@Component({
  selector: 'da-test',
  template: '<h1>RegisterTest</h1>',
})
export class RegisterTest {

}
