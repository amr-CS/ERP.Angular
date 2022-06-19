import { ItemUnitDto } from '../Dto/ItemUnitDto';

export interface ItemUnitBarcode {
  id: number;
  itemUnitId: number;
  barcode: string;
  //itemUnit: ItemUnitDto;
}
