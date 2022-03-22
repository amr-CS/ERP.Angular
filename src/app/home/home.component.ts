import { Component, OnInit } from '@angular/core';
import { TreeService } from '../services/tree.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private tree:TreeService) {


   }

  ngOnInit() {
    //this.tree.accountGetAll();

  }

}
