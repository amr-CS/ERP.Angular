import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-Invoice',
  templateUrl: './Invoice.component.html',
  styleUrls: ['./Invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  public pageName="فاتورة شراء"
  constructor() { }

  ngOnInit() {
  }

}
