import { ItemUnitBarcode } from "../interfaces/ItemUnitBarcode";
import { ItemUnitDto } from "./ItemUnitDto";

export class ItemUnitBarcodeDto implements ItemUnitBarcode{
  id: number=0;
  itemUnitId: number=0;
  barcode: string='';
  isDeleted:boolean=false;
  //itemUnit: ItemUnitDto=new ItemUnitDto();


}
