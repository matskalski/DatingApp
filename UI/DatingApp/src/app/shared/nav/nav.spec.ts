import { UserModel } from './../../models/user-model';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Nav } from "./nav";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideRouter, Router } from "@angular/router";
import { AccountsService } from "../../services/accounts/accounts-service";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from "@angular/material/button/testing";
import { of } from 'rxjs';

describe('nav component', () => {
  let component: Nav;
  let fixture: ComponentFixture<Nav>;
  let accountsService: AccountsService;
  let loader: HarnessLoader;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Nav
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'home', component: HomeTest },
          { path: 'members', component: MembersTest },
          { path: 'lists', component: ListsTest },
          { path: 'messages', component: MessagesTest },
        ]),
        provideZonelessChangeDetection()
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(Nav);
    component = fixture.componentInstance;

    accountsService = TestBed.inject(AccountsService);
    router = TestBed.inject(Router)

    //tworzenie stanu inicjalnego
    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
  })

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  it('if usert is not logged in should display login form', async () => {
    const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
    expect(formFields.length).toBe(2);
  });

  it('if usert is logged in should not display login form', async () => {
    accountsService.currentUser.set(
      {
        id: '1',
        displayName: 'test_user',
        email: 'test@test.pl',
        token: '1234#',
        imageUrl: 'http://image.com'
      }
    );

    const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
    expect(formFields.length).toBe(0);
  });

  it('should not display login form when user logs in correctly', async () => {
    const loginInput = await loader.getHarness(MatInputHarness.with({ placeholder: 'email' }))
    const passwordInput = await loader.getHarness(MatInputHarness.with({ placeholder: 'password' }))
    const loginButton = await loader.getHarness(MatButtonHarness.with({ text: 'Login' }));

    const userModel: UserModel =
    {
      id: '1',
      displayName: 'test_user',
      email: 'test@test.pl',
      token: '1234#',
      imageUrl: 'http://image.com'
    }

    jest.spyOn(accountsService, 'login').mockImplementation(() => {
      accountsService.currentUser.set(userModel);
      return of(userModel)
    });

    await loginInput.setValue('test@test.pl');
    await passwordInput.setValue('12345_test')
    await loginButton.click();

    await fixture.whenStable();

    //po prawidłowym zalogowaniu formularz logowania nie powinien być już wyświetlany
    expect(await loader.getHarnessOrNull(MatInputHarness.with({ placeholder: 'email' }))).toBeFalsy()
    expect(await loader.getHarnessOrNull(MatInputHarness.with({ placeholder: 'password' }))).toBeFalsy()
    expect(await loader.getHarnessOrNull(MatButtonHarness.with({ text: 'Login' }))).toBeFalsy()

    //powinno nastąpić przekierowanie pod adres /members
    expect(router.url).toEqual('/members')
  })
})

//#region tests components
@Component({
  selector: 'da-home-test',
  template: '<h1>RegisterTest</h1>',
})
export class HomeTest {

}

@Component({
  selector: 'da-members-test',
  template: '<h1>RegisterTest</h1>',
})
export class MembersTest {

}

@Component({
  selector: 'da-lists-test',
  template: '<h1>RegisterTest</h1>',
})
export class ListsTest {

}

@Component({
  selector: 'da-messages-test',
  template: '<h1>RegisterTest</h1>',
})
export class MessagesTest {

}
//#endregion "My Region"
