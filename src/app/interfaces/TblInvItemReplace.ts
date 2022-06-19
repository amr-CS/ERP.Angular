export interface TblInvItemReplace {
  invItemReplaceId:number;
  invItemReplaceCode  :string;
  itemId   :number;
  replaceItemId :number;
  notes   :string;
  invItemReplaceIsActive :boolean;
  isDeleted   :boolean;
  createdBy   :number;
  createdOn   :Date;
  lastUpdatedBy   :number;
  lastUpdatedOn  :Date;
}
