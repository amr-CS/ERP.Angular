import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { TreeService } from '../services/tree.service';
import { AccountMain } from '../interfaces/accountMain.interface';
import { newArray } from '@angular/compiler/src/util';


let TREE_DATA: AccountMain[] 



/** Flat node with expandable and level information */
interface AccountNode {
 expandable: boolean;
 id:any,
 name: string;
 level: number;
 
}
@Component({
 selector: 'app-tree-component',
 templateUrl: './tree-component.component.html',
 styleUrls: ['./tree-component.component.css']
})
export class TreeComponentComponent implements OnInit {
@Output() passId = new EventEmitter<any>();
  @Input()
  message!: string;

  
private _transformer = (node: AccountMain, level: number) => {
 return {
 expandable: !!node.children && node.children.length > 0,
 name: node.nameL1,
 id: node.id,
 level: level,
 };
 }

treeControl = new FlatTreeControl<AccountNode>(
 node => node.level, node => node.expandable);
treeFlattener = new MatTreeFlattener(
 this._transformer, node => node.level, node => node.expandable, node => node.children);
dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
constructor(private tree:TreeService) {

  this.tree.accountGetAll().subscribe((result) => {
  
  TREE_DATA=result
  this.dataSource.data =this.treeConstruct(TREE_DATA);


   }, error => console.error(error));
 }
hasChild = (_: number, node: AccountNode) => node.expandable;

ngOnInit() {
 

 }


 treeConstruct(treeData:any) {
  let constructedTree: never[] = [];
  for (let i of treeData) {
    let treeObj = i;
    let assigned = false;
    this.constructTree(constructedTree, treeObj, assigned)
  }
  return constructedTree;
}
constructTree(constructedTree:any, treeObj:any, assigned:any) {
if (treeObj.parentId == null) {
    treeObj.children = [];
    constructedTree.push(treeObj);
    return true;
  } else if (treeObj.parentId == constructedTree.id) {
    treeObj.children = [];
    constructedTree.children.push(treeObj);
    return true;
  }
  else {
    if (constructedTree.children != undefined) {
      for (let index = 0; index < constructedTree.children.length; index++) {
        let constructedObj = constructedTree.children[index];
        if (assigned == false) {
          assigned = this.constructTree(constructedObj, treeObj, assigned);
        }
      }
    } else {
      for (let index = 0; index < constructedTree.length; index++) {
        let constructedObj = constructedTree[index];
        if (assigned == false) {
          assigned = this.constructTree(constructedObj, treeObj, assigned);
        }
      }
    }
    return false;
  }
}

clickHandler(event: any) {
  if (event && event.target && event.target.childNodes[0]) {
    /*  alert(event.target.childNodes[0].ariaLabel)*/
    this.passId.emit(event.target.childNodes[0].ariaLabel)
  }
}

}
