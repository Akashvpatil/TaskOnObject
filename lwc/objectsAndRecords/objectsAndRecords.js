import { LightningElement } from 'lwc';
import { api,track} from 'lwc';
import ObjectNames from '@salesforce/apex/RecordsFetcherClass.FetchObjectName';
import { NavigationMixin } from 'lightning/navigation';

export default class ObjectsAndRecords extends NavigationMixin(LightningElement) {
  @track SelectedFieldList=[];  
  @track objectList=[];
  @track fieldsList=[];
  @api selectedObject;
  @track gotTheobjectNames=false;
  
 @track name;
 
constructor(){
  super();
     ObjectNames({objectName: this.selectedObject}).then((result)=> {
      if(result) {
        this.objectList=[];
        
        for(let key in result){
         
          this.objectList.push({label:key , value:key});
        }
        this.gotTheobjectNames=true;
        
       
      }else{
        console.log('Error occured');
      }});

}

  HandleFields(event){
   this.name=event.detail.value;
   this.salectedObject=event.detail.value;
  this.template.querySelector('c-field-names').uncheckFields();
 
   this.template.querySelector('c-field-names').getAllFields(event.detail.value);
   this.template.querySelector('c-records').changeRecords();
    console.log('Selected------->'+this.salectedObject); 
   
        
    
  }
  Handlecheckbox(event){
    console.log('in the parent javascript');
    console.log('event.detail.value'+event.detail);
    this.SelectedFieldList = event.detail;
    console.log('this.selectedObject'+this.name);
    console.log('back to parent'+this.SelectedFieldList);
    this.template.querySelector('c-records').getTheRecords(this.name,this.SelectedFieldList);
  }
  createrecord() {
   this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName: this.name,
        actionName: "new"
      }
    });
  }

}