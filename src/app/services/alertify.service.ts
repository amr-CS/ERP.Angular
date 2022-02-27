import { Injectable } from '@angular/core';
declare let alertify:any;
@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }


confirm(message:string,okCallback:()=>any){
 alertify.confirm(message,function(e: any){
   if(e){
    okCallback()
   }else{

   }
 })

}
success(message:any){
  alertify.success(message);
};
error(message:any){
  alertify.error(message);
};


}
