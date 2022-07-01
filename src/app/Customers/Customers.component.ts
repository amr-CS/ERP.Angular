import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-Customers',
  templateUrl: './Customers.component.html',
  styleUrls: ['./Customers.component.css']
})
export class CustomersComponent implements OnInit {
  pageName:string="";
  constructor() { 
    this.pageName="العملاء";
  }

  ngOnInit() {
  }

}
