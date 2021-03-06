import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountDetail, AccountMain } from '../interfaces/accountMain.interface';
import { TreeService } from '../services/tree.service';

@Component({
  selector: 'app-chartOfAccount',
  templateUrl: './chartOfAccount.component.html',
  styleUrls: ['./chartOfAccount.component.css']
})
export class ChartOfAccountComponent implements OnChanges {
  @Input() getData=new EventEmitter<any>();
  buttonToggle: boolean = false;
  public pageName="دليل الحسابات"
 
  //test
  data:any = 0
  account={
    id:0,
    nameL1:'',
  }


  name!: string;
  messageFromButton:string = 'No Message';
  messageFromButton1:string = 'No Message';

  constructor(private tree:TreeService) {
    this.name = 'Angular2'

   }


  ngOnChanges(changes: SimpleChanges): void {
  }
  @ViewChild('myButton') myButton: any;
  @ViewChild('myButton1') myButton1: any;
  reload(id:any){
    this.data = id;
    this.tree.GetAccount(id).subscribe((result)=>{
      console.log(result)
    this.account=result
    })
    
}

save(): void {
  this.buttonToggle = !this.buttonToggle;
}


}
