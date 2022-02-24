import { Component, OnInit, Input } from '@angular/core';
import { RowCommon } from 'src/app/interfaces/rowcommon.interface';

@Component({
  selector: 'app-table-details',
  templateUrl: './table-details.component.html',
  styleUrls: ['./table-details.component.css']
})
export class TableDetailsComponent implements OnInit {
  @Input() item:any;  
  @Input() details: any;  
  @Input() itemDetailNew: any;
  @Input() columns :Array<string>;  
  @Input() rows :Array<RowCommon>;  
  
  itemDetailOld:any;

  constructor() { 
    this.columns = [];
    this.rows = [];
  }

  ngOnInit(): void {
        
  }


  removeItemDetail(index:number) {
    this.item.demographicTypeDtltbl.splice(index, 1);
  }

  addItemDetail() {        
    this.itemDetailNew.demTypeId = this.item.demTypeId;
    if (this.item.demographicTypeDtltbl === null) {
      this.item.demographicTypeDtltbl = [];
    }
    this.item.demographicTypeDtltbl.push(this.itemDetailNew);
    this.itemDetailOld = this.itemDetailNew;    
    this.itemDetailNew = {};
  }

  
  
  setFocus(t:any,inputElemet:any) {  
    
    
    var tbodyRows = t.childNodes[1].children.length;  
    //childeNodes of 2 refer to the table footer
    var footerNodes = t.childNodes[2].children[0].childNodes; 
    
   
    var isOldItem = false; 
    this.rows.forEach(row => {
      Object.keys(this.itemDetailOld).forEach(prop => {            
        if(prop == row.propertyName && this.itemDetailOld[prop]){
          isOldItem = true;
        }      
      });
    });
      
    
    // adjust focus only if we have data on the new inserted row
    if(tbodyRows > 0 
      && isOldItem
      )
    {
      // get the index dynamically to the next column to focus on 
      var index = 0;          
      for (let i = 0; i < footerNodes.length; i++) {
         index ++;   
        if(inputElemet == footerNodes[i].childNodes[0]){
          break;
        }         
       }

      //childeNodes of 1 refer to the table body
     t.childNodes[1].children[tbodyRows - 1].childNodes[index].childNodes[0].focus(); 
    }

    this.itemDetailOld = {};   
}
}
