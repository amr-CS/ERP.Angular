import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.css']
})
export class UtilitiesComponent implements OnInit {
@Output() clickSave = new EventEmitter();
@Output() clickPopup = new EventEmitter();
@Output() UpdateableToggle = new EventEmitter();
@Output() reload = new EventEmitter();
@Output() printReport = new EventEmitter();

@Output() getFirst = new EventEmitter();
@Output() getLast = new EventEmitter();
@Output() getNext = new EventEmitter();
@Output() getPrev = new EventEmitter();

@Input() IsUpdateFromParent: any;

@Input() name: any;

constructor() { }

  ngOnInit() {
  }

  save(){
this.clickSave.emit();
  }
  openPopup()
  {
  this.clickPopup.emit();

  }
  isUpdateableToggle(){
this.UpdateableToggle.emit();
  }

  print(){
this.printReport.emit();
    
  }
  reloadComponent(){
  this.reload.emit();
}


first(){
  this.getFirst.emit();

}

last(){
  this.getLast.emit();
  
}
next(){
  this.getNext.emit();
  
}
prev(){
  this.getPrev.emit();
  
}

}
