import { CurrencyDto } from "../Dto/CurrencyDto";
import { ItemDto } from "../Dto/ItemDto";
import { ItemUnitBarcodeDto } from "../Dto/ItemUnitBarcodeDto";
import { lookupDetailsDto } from "../Dto/LookupDetailsDto";
import { Currency } from "./currency.interface.";
import { Item } from "./item";

export interface ItemUnit {
          id:number;
          itemId :number;
          unitId :number;
          notes :string;
          orderLimit:number;
          code:number;
          unitCost :number;
          unitPrice:number;
          currencyId :number;
          isDefault:boolean;
          isDeleted :boolean;
          createdBy :number;
          createdOn:Date;
          lastUpdatedBy :number;
         lastUpdatedOn :Date;
          // currency: Currency;
          // item :Item ;




        invItemUnitId  :number;
        companyId    :number;
        unitParentId   :number;
        partsInParents  :number;
        defaultUnit     :number;
        unitIsActive   :boolean;
        unitProductio :boolean;
        sellUnit    :boolean;
        isDecreasable  :boolean;
        unitOrderLimit :number;
        unitCode  :string;
        unitNameL1:string;
        unitNameL2:string;
        branchId    :number;
        priceCurrency :number;

        currency:CurrencyDto;
        unit:lookupDetailsDto;
        UnitParent:lookupDetailsDto;
        item:ItemDto;
        itemUnitBarcode:ItemUnitBarcodeDto[]
        //unit :Unit
        // ItemUnitBarcode
}
