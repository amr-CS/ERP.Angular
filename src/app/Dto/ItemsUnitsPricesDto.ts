import { InvItemsUnitsPrices } from "../interfaces/InvItemsUnitsPrices";

export class ItemsUnitsPricesDto implements InvItemsUnitsPrices{
  unitId: number=0;
  companyId: number=0;
  priceCat: number=0;
  price: number=0;
  priceIsActive: boolean=false;
  priceCode?: number=0;
  priceName?:string='';
  sellCostType: number=0;
  notes: string='';
  priceId: number=0;
  itemId: number=0;
  isDeleted: boolean=false;
  createdBy: number=0;
  createdOn: Date=new Date();
  lastUpdatedBy: number=0;
  lastUpdatedOn: Date=new Date();

}
