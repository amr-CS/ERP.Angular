import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { map } from 'rxjs';
import { Constants } from '../services/constants';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  helper = new JwtHelperService();
  decodedToken:any;
  token:any;
constructor(private http:HttpClient,private router:Router ) { }

login(model:any){
return this.http.post(Constants.ApiUrlMain+'user/authenticate',model).pipe(
  map((result:any)=>{
const user=result;
const token=user.token;
if(user&&!this.helper.isTokenExpired(token)){
  this.decodedToken = this.helper.decodeToken(token);
localStorage.setItem('token',token);
console.log(this.decodedToken)
}
  })
)

}
loggedin(){
    this.token=localStorage.getItem('token') ;
   
  return !this.helper.isTokenExpired(this.token);
   }
 
   logout(){
    localStorage.removeItem('token');
  this.router.navigate(['']);
  
  }
}
