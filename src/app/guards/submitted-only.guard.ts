import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormDataService } from '../services/form-data.service';

@Injectable({
  providedIn: 'root'
})
export class SubmittedOnlyGuard implements CanActivate {

  constructor(private formDataService: FormDataService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.formDataService.getShowResults()) {
      this.router.navigate(['/']);
      return false;
    }
    return this.formDataService.getShowResults();
  }
}
