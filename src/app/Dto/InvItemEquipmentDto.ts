import { InvItemEquipment } from "../interfaces/InvItemEquipment";

export class InvItemEquipmentDto implements InvItemEquipment{
  invItemEquipmentId : number=0;
  invItemEquipmentCode?: number=0;
  itemId : number=0;
  equipmentId : number=0;
  notes: string='';
  invItemEquipmentIsActive: boolean=false;
  isDeleted: boolean=false;
  createdBy : number=0;
  createdOn: Date=new Date();
  lastUpdatedBy : number=0;
  lastUpdatedOn: Date=new Date();
  equipName?:string='';
}
