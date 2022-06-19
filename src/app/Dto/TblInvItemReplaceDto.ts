import { TblInvItemReplace } from "../interfaces/TblInvItemReplace";

export class TblInvItemReplaceDto implements TblInvItemReplace{
  invItemReplaceId  : number=0;
  invItemReplaceCode: string='';
  itemId  : number=0;
  replaceItemId  : number=0;
  notes: string='';
  invItemReplaceIsActive: boolean=false;
  isDeleted: boolean=false;
  createdBy  : number=0;
  createdOn: Date=new Date();
  lastUpdatedBy  : number=0;
  lastUpdatedOn: Date=new Date();


  invItemReplaceName: string='';

}
