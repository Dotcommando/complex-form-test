import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormPageComponent } from './pages/form-page/form-page.component';
import { ResultPageComponent } from './pages/result-page/result-page.component';
import { SubmittedOnlyGuard } from './guards/submitted-only.guard';

const routes: Routes = [
  { path: '', component: FormPageComponent },
  { path: 'result', component: ResultPageComponent, canActivate: [SubmittedOnlyGuard], },
  { path: '**', component: FormPageComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
