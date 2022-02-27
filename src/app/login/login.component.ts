import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model : any ={};
  constructor(public authservice:AuthService,private alertify:AlertifyService,private router:Router) { }

  ngOnInit() {
  }

  login(){
this.authservice.login(this.model).subscribe(next=>{
  this.router.navigate(['/Area/home']);
  console.log('login successfully')
}
,error=>{
  console.log('login failed');
  this.alertify.error('خطأ في اسم المستخد او الرقم السري');
}
)
}




}
