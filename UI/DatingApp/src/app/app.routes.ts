import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Register } from './components/register/register';


export const routes: Routes = [
    {
        path: 'home',
        component: Home
    },
    {
        path: 'register',
        component: Register
    }
];
