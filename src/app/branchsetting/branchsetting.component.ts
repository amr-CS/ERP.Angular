import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Branchsetting } from '../interfaces/branchsetting.interface';
import { AlertifyService } from '../services/alertify.service';
import { BranchsettingService } from '../services/branchsetting.service';

@Component({
  selector: 'app-branchsetting',
  templateUrl: './branchsetting.component.html',
  styleUrls: ['./branchsetting.component.css']
})
export class BranchsettingComponent implements OnInit {
  selectedTab='generalData'
  public pageName="اعدادات الفرع"

  constructor(private service:BranchsettingService,private alertify:AlertifyService) { this.getAll() }

  public branchsetting: Branchsetting={
    id:0  ,
    code:0 ,
    nameL1:'' ,
    nameL2:'' ,
    branchId:0 ,
    fraction:0 ,
    maskAmount:'' ,
    formatDate:0 ,
    empAtType:0 ,
    empDate:new Date(),
    plateCode:0 ,
    desFormat:'' ,
    desName:'' ,
    desType:'' ,
    reportServer:'' ,
    rrovirtualdir:'' ,
    reportsnumbererface:'' ,
    hostname:'' ,
    virtualdir:'' ,
    physicaldir:'' ,
    useorarrp:'' ,
    usequeuetables:'' ,
    repExtnumberion:'' ,
    defaultLocation:0 ,
    imgPath:'' ,
    plateStore:0 ,
    plateUnit:0 ,
    sellStore:0 ,
    pcDetectionType:0 ,
    holdInvTimer:0 ,
    insuranceLimit:0 ,
    invoiceRemark:'' ,
    kitchenPrinter:'' ,
    fontPath:'' ,
    branchPhone:'' ,
    sheepCat:0 ,
    allowSwithoutcPrinters:0 ,
    locationImgPath:'' ,
    foodPrepareCat:0 ,
    cashCode:0 ,
    showRefItem:false ,
    showRefProduct:false ,
    custAcc:0 ,
    recevAcc:0 ,
    costCenter:'' ,
    bounsAccount:'' ,
    laterAccounts:'' ,
    vPosCaneclAcc:'' ,
    rentAccounts:'' ,
    driverSeq:0 ,
    kitchenStore:0 ,
    sheepCatProduct:0 ,
    sheepOutRes:0 ,
    sellAcc:0 ,
    insurAcc:0 ,
    rentAcc:0 ,
    showQty:0 ,
    subSeqInv:0 ,
    branchMgr:0 ,
    reservType:0 ,
    deliveryTrans:0 ,
    allowBlkList:false ,
    itemDelivery:0 ,
    allowCancelInvoice:false ,
    grpAddPlate:0 ,
    qtyPlateRice:0 ,
    riceCat:0 ,
    showQtyZero:false ,
    orderEmp:'' ,
    orderPhone:'' ,
    branchPhoneOrder:'' ,
    branchAddress:'' ,
    defaultProdCost:false ,
    subSeqOrder:0 ,
    decreaseProdAuto:false ,
    commAccount:0 ,
    shortNum:'' ,
    newOrderTime:0 ,
    deliveryCashier:false ,
    payCashierAmount:false ,
    assemblingPrinter:false ,
    defaultLocationDelivery:0 ,
    modifyInvoice:false ,
    printCancelInvoice:false ,
    displayDirverAccount:false ,
    displayUpdateDirver:false ,
    printUpdateInvoice:false ,
    limitInvId:0 ,
    printBasicInvId:false ,
    autoOpenPeriod:false ,
    autoClosePeriod:false ,
    lengthPeriodDay:0 ,
    compIdPost:0 ,
    updateInvoiceDriver:false ,
    showAllInvoiceForCancel:false ,
    showAllInvoiceForUpdate:false ,
    changeUpdateDate:false ,
    manualProduction:false ,
    changeUpdateCashier:false ,
    discountMax:0 ,
    enterHelfoodAllowed:false ,
    enterPartbuildAllowed:false ,
    allowDiscount:false ,
    convertProductionFullQty:false ,
    closeFormUpdateAuto:false ,
    storeBasic:0 ,
    productTypeOut:0 ,
    assemblingPost:false ,
    clientStoreId:'' ,
    branchAccount:'' ,
    empCostId:0 ,
    storeProduction:0 ,
    choiceStoreProdAuto:false ,
    addQyProductbeforeSpend:false ,
    companyId:0 ,
    isVat:'' ,
    vatCode:'' ,
    vatPerc:0 ,
    roundLowerHalf:0 ,
    isDeleted:false  ,
    createdBy:0 ,
    createdOn:new Date (),
    lastUpdatedBy:0 ,
    lastUpdatedOn:new Date () ,
    isPOSPrinterNetwork:false ,
    orderRemark:'' ,
    mailHost:'' ,
    mailPassword:'' ,
    mailPort:'' ,
    mailSubject:'' ,
    mailBody:'' ,
    mailFrom:'' ,
    mailTo:'' ,
    iban:'' ,
  };


  
 



  ngOnInit() {
  }
  
save()
{
console.log(this.branchsetting)
this.service.SaveBranchsetting(this.branchsetting).subscribe(()=>{
this.alertify.success('تم الحفظ بنجاح')
})
}
getAll(){
this.service.getAllBranchsetting().subscribe(arg => {
  this.branchsetting=arg;
  console.log(arg)
this.branchsetting.id=arg.id
  console.log(this.branchsetting)

});}


getLookup(){
  this.service.getLookup(16);
}


}
