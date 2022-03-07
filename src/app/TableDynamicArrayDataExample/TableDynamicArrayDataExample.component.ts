
import { Component, Input, ViewChild,OnChanges, SimpleChanges, OnInit,DoCheck} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource, _MatTableDataSource} from '@angular/material/table';
import { AlertifyService } from '../services/alertify.service';
import { TreeService } from '../services/tree.service';


@Component({
  selector: 'app-TableDynamicArrayDataExample',
  templateUrl: './TableDynamicArrayDataExample.component.html',
  styleUrls: ['./TableDynamicArrayDataExample.component.css']
})
export class TableDynamicArrayDataExampleComponent implements OnChanges  {
  displayedColumns: string[] = ['add','accountNo', 'nameL1','currencyName','accountTypeName','accountReportName','isCumulative','isCostCenter','delete'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @Input() parentData: any;

  @Input()
  buttonTrigger!: boolean;
  buttonToggle: boolean = false;
id:number=0
  
  ngOnChanges(changes: SimpleChanges) {
    
    this.tree.AccountTree(this.parentData).subscribe(result => {
      this.dataSource=new MatTableDataSource(result);
     this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;

     }, error => console.error(error));
   
  }
  constructor(private tree:TreeService,private alertify:AlertifyService) {
 
    this.tree.AccountTreeNull().subscribe(result => {
      this.dataSource=new MatTableDataSource(result);
     this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;

     }, error => console.error(error));
   }
 

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  addData() {
    let ELEMENT_DATA=this.dataSource.filteredData
    const randomElementIndex = Math.floor(Math.random() * ELEMENT_DATA.length);
    this.dataSource.filteredData = [...this.dataSource.filteredData, ELEMENT_DATA[randomElementIndex]];
    this.dataSource=new MatTableDataSource(this.dataSource.filteredData);
  }
  
  removeData(id:any,index:any) {
    this.alertify.confirm('هل انت متأكد من مسح هذا الحساب',() =>{
      this.Delete(id,index)
    })
    
    
  }
   Delete(id:any,index:any){
    let ELEMENT_DATA=this.dataSource.filteredData
    this.tree.DeleteAccount(id).subscribe(result => {
      ELEMENT_DATA.splice(index,1);
      this.dataSource=new MatTableDataSource(ELEMENT_DATA);
     }, error => console.error(error));
  }
  

}


