import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { Members } from './components/members/members';
import { MemberDetails } from './components/members/member-details/member-details';
import { Messages } from './components/messages/messages';
import { Lists } from './components/lists/lists';
import { authGuard } from './guards/auth-guard';
import { TestErrors } from './components/test-errors/test-errors';
import { NotFound } from './shared/errors/not-found/not-found';


export const routes: Routes = [

  //lista routingów dostępnych wyłącznie po zalogowaniu
  //dodana aby nie dodawać za każdym razem tego samego guardu (authGuard)
  //ponieważ ścieżka zbiorczego rootingu to '' trzeba wcześniej jawnie wskazać przekierowanie
  //ze ściezki '' na komponent Home - pomimo że path pod ściezką ** obsłuży ten przypadek
  {
    path: '',
    component: Home
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'members', component: Members },
      { path: 'members/:id', component: MemberDetails },
      { path: 'messages', component: Messages },
      { path: 'lists', component: Lists },
    ]
  },
  //pozostałe routingi
  {
    path: 'home',
    component: Home
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'test-errors',
    component: TestErrors
  },
  {
    path: 'not-found',
    component: NotFound
  },
  {
    path: '**',
    component: Home
  }
];
