import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { Members } from './components/members/members';
import { MemberDetails } from './components/members/member-details/member-details';
import { Messages } from './components/messages/messages';
import { Lists } from './components/lists/lists';


export const routes: Routes = [
    {
        path: 'home',
        component: Home
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'members',
        component: Members
    },
    {
        path: 'members/:id',
        component: MemberDetails
    },
    {
        path: 'messages',
        component: Messages
    },
    {
        path: 'lists',
        component: Lists
    },
    {
        path: '**',
        component: Home
    }
];
