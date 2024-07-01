import { Routes } from '@angular/router';
import { DocumentosPage } from './paginas/documentos/documentos.page';
import { ProductoPage } from './paginas/producto/producto.page';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./paginas/home/home.page').then((m) => m.HomePage).catch(),
  },
    {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'consultando',
    loadComponent: () => import('./paginas/consultando/consultando.page').then( m => m.ConsultandoPage).catch()
  },
  {
    path: 'autenticidad',
    loadComponent: () => import('./paginas/autenticidad/autenticidad.page').then( m => m.AutenticidadPage).catch()
  },
  {
    path: 'producto',
    component: ProductoPage,
    //loadComponent: () => import('./paginas/producto/producto.page').then( m => m.ProductoPage),
  },
  {
    path: 'documentos',
    component: DocumentosPage
    //loadComponent: () => import('./paginas/documentos/documentos.page').then( m => m.DocumentosPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./paginas/registro/registro.page').then( m => m.RegistroPage).catch()
  },
];
