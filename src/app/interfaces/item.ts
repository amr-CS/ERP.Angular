import { InvItemEquipmentDto } from "../Dto/InvItemEquipmentDto";
import { ItemsUnitsPricesDto } from "../Dto/ItemsUnitsPricesDto";
import { ItemUnitBarcodeDto } from "../Dto/ItemUnitBarcodeDto";
import { ItemUnitDto } from "../Dto/ItemUnitDto";
import { TblInvItemReplaceDto } from "../Dto/TblInvItemReplaceDto";

export interface Item {
  id: number;
  code: string;
  itemNo: string;
  categoryId: number;
  barcode: string;
  nameL1: string;
  nameL2: string;
  factoryId: number;
  orderLimit: number;
  symbol: string;
  currencyId?: number;
  measurements: string;
  lastCost: number;
  productDate: Date;
  madeIn: string;
  hasExpiryDate: boolean;
  isVat: boolean;
  isSelling: boolean;
  isCompound: boolean;
  isProduct: boolean;
  isService: boolean;
  bonusLimit: number;
  bonusAmount: number;
  discountLimit: number;
  discountPercentage: number;
  discountMaxQuantity: number;
  discountMinQuantity: number;
  lastBuy: string;
  lastSell: string;
  notes: string;
  image: string;
  isDeleted: boolean;
  isActive: boolean;
  orderNo: number;
  warehouseId: number;
  itemTypeId: number;
  isDetailsGroup: boolean;
  itemGroupId: number;
  createdOn:Date;
  createdBy:number;
  lastUpdatedBy:number;
  lastUpdatedOn:Date;
  itemMinQty:number;
  itemMaxQty:number;

  isSelected:boolean;

  tblInvItemUnit:ItemUnitDto[];
  tblInvItemReplace:TblInvItemReplaceDto[];
  tblInvItemEquipment:InvItemEquipmentDto[];
  tblInvItemsUnitsPrices:ItemsUnitsPricesDto[];
}
