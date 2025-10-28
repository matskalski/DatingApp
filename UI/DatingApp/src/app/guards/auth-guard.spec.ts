import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterModule, RouterStateSnapshot } from "@angular/router";
import { authGuard } from "./auth-guard";
import { AccountsService } from "../services/accounts/accounts-service";
import { Component, provideZonelessChangeDetection, signal } from "@angular/core";
import { SnackbarService } from "../services/snackbar/snackbar-service";

describe('authGuard', () => {
  const accountsServiceMock = {
    currentUser: signal<{ id: string, displayName: string, email: string, token: string, imageUrl: string | null } | null>(null)
  };

  const snackbarServiceMock = {
    warning() { return true }
  };

  let router: Router;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        [RouterModule.forRoot([
          {path: 'home', component: DummyComponent}
        ])]
      ],
      providers: [
        {
          provide: AccountsService,
          useValue: accountsServiceMock
        },
        {
          provide: SnackbarService,
          useValue: snackbarServiceMock
        },
        provideZonelessChangeDetection()
      ]
    });

    TestBed.inject(AccountsService)
    router = TestBed.inject(Router);

  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('guard returns true when user is not null', () => {
    //test musi mieć własną instancję serwisu
    //aby nie nadpisywać współdzielonej zmiennej
    const accountService = TestBed.inject(AccountsService)

    accountService.currentUser.set({
      id: '1',
      displayName: 'displayName',
      email: "test@test.pl",
      token: '12345@$',
      imageUrl: undefined
    })

    //zdefiniowanie parametrów
    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {
      url: '/',
    } as any;

    //wywołanie guarda
    const result = executeGuard(route, state) as boolean;

    expect(result!).toBe(true)
  })

  it('guard returns false when user is null', () => {
    //test musi mieć własną instancję serwisu
    //aby nie nadpisywać współdzielonej zmiennej
    const accountService = TestBed.inject(AccountsService)

    accountService.currentUser.set(null);

    //zdefiniowanie parametrów
    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {
      url: '/',
    } as any;

    //wywołanie guarda
    const result = executeGuard(route, state) as boolean;

    expect(result!).toBe(false)
  })
})

@Component({
  selector: 'da-dummy',
  template: '',
})
export class DummyComponent  { }

