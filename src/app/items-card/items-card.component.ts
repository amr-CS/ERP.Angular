import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-items-card',
  templateUrl: './items-card.component.html',
  styleUrls: ['./items-card.component.css']
})
export class ItemsCardComponent implements OnInit {
  pageName:string='بطاقة الاصناف';
  constructor() { }

  ngOnInit(): void {
  }
  SaveChanges(){}
  openPopup(){}
}
