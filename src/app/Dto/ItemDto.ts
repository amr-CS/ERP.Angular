import { Item } from "../interfaces/item";
import { InvItemEquipmentDto } from "./InvItemEquipmentDto";
import { ItemsUnitsPricesDto } from "./ItemsUnitsPricesDto";
import { ItemUnitBarcodeDto } from "./ItemUnitBarcodeDto";
import { ItemUnitDto } from "./ItemUnitDto";
import { TblInvItemReplaceDto } from "./TblInvItemReplaceDto";

export class ItemDto implements Item{
  id: number=0;
  code: string='';
  itemNo: string='';
  categoryId: number=0;
  barcode: string='';
  nameL1: string='';
  nameL2: string='';
  factoryId: number=0;
  orderLimit: number=0;
  symbol: string='';
  currencyId: number=0;
  measurements: string='';
  lastCost: number=0;
  productDate: Date=new Date();
  madeIn: string='';
  hasExpiryDate: boolean=false;
  isVat: boolean=false;
  isSelling: boolean=false;
  isCompound: boolean=false;
  isProduct: boolean=false;
  isService: boolean=false;
  bonusLimit: number=0;
  bonusAmount: number=0;
  discountLimit: number=0;
  discountPercentage: number=0;
  discountMaxQuantity: number=0;
  discountMinQuantity: number=0;
  lastBuy: string='';
  lastSell: string='';
  notes: string='';
  image: string='';
  isDeleted: boolean=false;
  isActive: boolean=false;
  orderNo: number=0;
  warehouseId: number=0;
  itemTypeId: number=0;
  isDetailsGroup: boolean=false;
  itemGroupId: number=0;
  createdOn:Date=new Date();

  tblInvItemUnit:ItemUnitDto[]=[];
  tblInvItemReplace:TblInvItemReplaceDto[]=[];
  tblInvItemEquipment:InvItemEquipmentDto[]=[];
  tblInvItemsUnitsPrices:ItemsUnitsPricesDto[]=[];

}
