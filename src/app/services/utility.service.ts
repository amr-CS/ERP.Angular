import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RowCommon } from '../interfaces/rowcommon.interface';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(public router:Router) { }
  
  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  setFocus(t:any,inputElemet:any,itemDetailOld:any, rows: Array<string>) {  
     
    //childeNodes of 1 refer to the table body
    var tbodyRows = t.childNodes[1].children.length;  
    //childeNodes of 2 refer to the table footer
    var footerNodes = t.childNodes[2].children[0].childNodes; 
    
    var isOldItem = false; 
    rows.forEach(row => {
      Object.keys(itemDetailOld).forEach(prop => {            
        if(prop == row && itemDetailOld[prop]){
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
       
       var element = t.childNodes[1].children[tbodyRows - 1].childNodes[index].childNodes[0];
       if(element.hasChildNodes())
           element.childNodes[0].focus()
       else
           element.focus(); 
    }
    
}
  
}
