import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home-page/home-page').then((c) => c.HomePage),
  },
  {
    path: 'recipe-details/:id',
    loadComponent: () =>
      import('./features/recipe-details/recipe-details').then((c) => c.RecipeDetails),
  },
  {
    path: 'user-details',
    loadComponent: () => import('./features/user-details/user-details').then((c) => c.UserDetails),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((c) => c.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register').then((c) => c.Register),
  },
  {
    path: 'favourites',
    loadComponent: () =>
      import('./features/favourites/favourites-page/favourites-page').then((c) => c.FavouritesPage),
  },
];
