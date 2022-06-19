import { Currency } from "../interfaces/currency.interface.";
import { Item } from "../interfaces/item";
import { ItemUnit } from "../interfaces/ItemUnit";
import { CurrencyDto } from "./CurrencyDto";
import { ItemDto } from "./ItemDto";
import { ItemUnitBarcodeDto } from "./ItemUnitBarcodeDto";
import { lookupDetailsDto } from "./LookupDetailsDto";


export class ItemUnitDto implements ItemUnit{
  unit: lookupDetailsDto=new lookupDetailsDto();
  UnitParent: lookupDetailsDto=new lookupDetailsDto();
  priceCurrency: number=0;
  invItemUnitId: number=0;
  companyId: number=0;
  unitParentId: number=0;
  partsInParents: number=0;
  defaultUnit: number=0;
  unitIsActive: boolean=false;
  unitProductio: boolean=false;
  sellUnit: boolean=false;
  isDecreasable: boolean=false;
  unitOrderLimit: number=0;
  unitCode: string='';
  unitNameL1: string='';
  unitNameL2: string='';
  branchId: number=0;
  id: number=0;
  itemId: number=0;
  unitId: number=0;
  notes: string='';
  orderLimit: number=0;
  code: number=0;
  unitCost: number=0;
  unitPrice: number=0;
  currencyId: number=0;
  isDefault: boolean=false;
  isDeleted: boolean=false;
  createdBy: number=0;
  createdOn: Date=new Date();
  lastUpdatedBy: number=0;
  lastUpdatedOn: Date=new Date();

  itemUnitBarcode:ItemUnitBarcodeDto[]=[];
  item:ItemDto=new ItemDto();
  currency:CurrencyDto=new CurrencyDto();

  // currency: CurrencyDto=new CurrencyDto();
  // item: ItemDto=new ItemDto();


  //unitCode:number=0;
  unitName?:string;
  unitParentCode?:number;
  unitParentName?:string;
  currencyCode:number=0;
  currencyName?:string;
}
