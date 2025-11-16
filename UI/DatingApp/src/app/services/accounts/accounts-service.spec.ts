import { SnackbarService } from './../snackbar/snackbar-service';
import { LoginModel } from './../../models/login-model';
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { AccountsService } from "./accounts-service";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { UserModel } from "../../models/user-model";
import { RegisterModel } from '../../models/register-model';


describe('accountsService', () => {
  let accountsService: AccountsService
  let httpTestingController: HttpTestingController;
  const snackbarServiceMock = {
    error: jest.fn()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountsService,
        { provide: SnackbarService, useValue: snackbarServiceMock },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    accountsService = TestBed.inject(AccountsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('creates service', () => {
    expect(accountsService).toBeTruthy()
  })

  describe('login', () => {
    it('sets correct user after succesfully login', () => {
      let user: UserModel = {
        id: "id",
        displayName: "user1",
        email: "user1@test.com",
        token: "12345test",
      };

      let loginModel: LoginModel = {
        email: "user1@test.com",
        password: "12345p#"
      }

      let result;

      accountsService.login(loginModel).subscribe(resp => {
        result = resp;
      })

      const req = httpTestingController.expectOne('https://localhost:7144/api/accounts/login');
      req.flush(user)

      expect(result).toBe(user);
      expect(accountsService.currentUser()).toBe(user);
    });

    it('when http request returns error then result should be null ad snackbar service error function should been called', () => {
      let loginModel: LoginModel = {
        email: "user1@test.com",
        password: "12345p#"
      }

      let result;

      accountsService.login(loginModel).subscribe(resp => {
        result = resp;
      })

      const req = httpTestingController.expectOne('https://localhost:7144/api/accounts/login');
      req.flush("", { status: 404, statusText: "Not Found" });

      expect(result).toBe(null)
      expect(snackbarServiceMock.error).toHaveBeenCalled()
    });
  });

  describe('logout', () => {
    it('accountsService currentUser should to be null and user key should be removed from localStorage', () => {
      let user: UserModel = {
        id: "id",
        displayName: "user1",
        email: "user1@test.com",
        token: "12345test",
      };

      accountsService.currentUser.set(user)
      localStorage.setItem('user', JSON.stringify(user));

      accountsService.logout();

      expect(accountsService.currentUser()).toBe(null)

      const userFromLocalStorage = localStorage.getItem('user');
      expect(userFromLocalStorage).toBe(null);
    });
  });

  describe('register', () => {
    it('test', ()=>{
       var registerModel: RegisterModel = {
      email: "user1@test.com",
      displayName: "name",
      password: "password"
    };

    let user: UserModel = {
      id: "id",
      displayName: "user1",
      email: "user1@test.com",
      token: "12345test",
    };

    let result;

    accountsService.register(registerModel).subscribe(resp => {
      result = resp;
    })

    const req = httpTestingController.expectOne('https://localhost:7144/api/accounts/register');
    req.flush(user)

    expect(accountsService.currentUser()).toBeTruthy()
    expect(accountsService.currentUser()).toBe(user)
    });
  });
})
