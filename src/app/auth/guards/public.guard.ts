import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, UrlSegment, UrlTree, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PublicGuard implements CanMatch, CanActivate {
  constructor(
    public authService:AuthService,
    public router:Router
  ) { }
  private checkAuthStatus(): boolean | Observable<boolean>{
    return this.authService.checkAuthentication()
    .pipe(
      tap(isAuthenticated=>console.log('Authenticated',isAuthenticated)),
      tap(isAuthenticated=>{
        if(isAuthenticated) this.router.navigate(['./'])
      }),
      map(isAuthenticated =>!isAuthenticated)
    )
  }
  canMatch(route: Route, segments: UrlSegment[]): boolean  | Observable<boolean > {
    return this.checkAuthStatus();
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean| Observable<boolean>  {
    return this.checkAuthStatus();
  }

}
