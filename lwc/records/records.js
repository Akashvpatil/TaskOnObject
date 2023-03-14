import { LightningElement, track, api } from 'lwc';
import getRecords from '@salesforce/apex/RecordsFetcherClass.getRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import deleteAccount from '@salesforce/apex/RecordsFetcherClass.deleteAccount'
export default class Records extends NavigationMixin(LightningElement) {
    @track column = [];
    @track GotTheRecords = false;
    @track recordList = [];
    @track columnsName = [];
    @track fetchedrecords = [];
    @track valueForLabel = [];
    @track valueForcolumn = [];
    @track columns = [];
    recordId;
    @track actions = [
        { label: 'View', name: 'view' },
        { label: 'Edit', name: 'edit' },
        { label: 'Delete', name: 'delete' }
    ];
    _title = 'The Given Object Does not return any Records';
    message = 'Please Insert Some Records';
    variant = 'error';

    @api getTheRecords(selected, fieldsList) {

        console.log('selected object in record.js: ' + selected);
        console.log('fieldsList: ' + fieldsList);

        this.valueForLabel = fieldsList;
        this.valueForColumn = fieldsList.map((value, index) =>
            ({
                label: this.valueForLabel[index],
                fieldName: value
            }))
        this.columns = this.valueForColumn;
        this.columns = this.columns.concat([
            {
                type: 'action',
                typeAttributes: {
                    rowActions: this.actions
                }
            }
        ]);

        getRecords({ objectName: selected, fieldNames: fieldsList })
            .then(result => {
                console.log('in records result page: ' + selected);
                if (result) {
                    this.recordList = result;

                    console.log('results' + JSON.stringify(result));
                    this.GotTheRecords = true;
                    console.log('recordList' + JSON.stringify(this.recordList));
                    console.log('size of records: ' + this.recordList.length);
                    if (this.recordList.length === 0) {
                        console.log('in toast message');
                        this.GotTheRecords = false;
                        this.showNotification();
                    }
                } else {
                    console.log('error occurred');
                }
            })
            .catch(error => {
                console.log('Error on record method: ' + error.message);
            });
    }

    @api changeRecords() {
        this.GotTheRecords = false;
    }

    showNotification() {
        const evt = new ShowToastEvent({
            title: this._title,
            message: this.message,
            variant: this.variant,
        });
        this.dispatchEvent(evt);
    }
    handleRowActions(event){
        console.log("in handleactions");
        console.log(event.detail.action.name);
        const actionName= event.detail.action.name;
        const row = event.detail.row;
        this.recordId = row.Id;
        switch (actionName) {
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                console.log('in view');
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'edit'
                    }
                });
                break;
            case 'delete':
                this.deleteCurrentAccount(row);
                break;
        }
    }
    
    deleteCurrentAccount(currentRow) {
       console.log('in deleteCurrentAccount');
        deleteAccount({ accountObject: currentRow }).then(result => {
         
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: currentRow.Name + ' account deleted.',
                variant: 'success'
            }));
           
        }).catch(error => {
            console.log('Error ' + error);
            
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!',
                message: JSON.stringify(error),
                variant: 'error'
            }));
        });
    }
}
