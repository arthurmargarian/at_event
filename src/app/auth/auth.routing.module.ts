import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthComponent } from './auth.component';
import { NotAuthGuard } from '../guards/not-auth.guard';

const routes: Routes = [
  {
    path: '', component: AuthComponent,
    children: [
      {path: '', redirectTo: 'sign-in'},

      {
        path: 'sign-in',
        component: LoginComponent,
        canActivate: [NotAuthGuard],
      },
      {
        path: 'sign-up',
        component: RegisterComponent,
        canActivate: [NotAuthGuard],
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
