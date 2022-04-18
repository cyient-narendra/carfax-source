import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { DataentryComponent } from '../dataentry/dataentry.component';

@Injectable()
export class DirectAccessGuard implements CanActivate,CanDeactivate<DataentryComponent> {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // If the previous URL was blank, then the user is directly accessing this page
    if (this.router.url === '/') {
      this.router.navigate(['']); // Navigate away to some other page
      return false;
    }
    return true;
  }
  canDeactivate(component: DataentryComponent): boolean {
    if (component.form.dirty) {
        return confirm('Are you sure you want to discard your changes?');
    }
    return true;
}
}