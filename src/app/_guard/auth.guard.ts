import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  /**
   *
   */
  constructor(private authservice:AuthService,private router:Router,private alertify:AlertifyService) {
    
  }
  canActivate(): boolean  {
if(this.authservice.loggedin()){

    return true;
}

this.alertify.error('يجب تسجيل الدخول')
this.router.navigate(['']);

return false;
  }
  
}
