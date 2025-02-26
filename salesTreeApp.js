import { LightningElement, track, api } from 'lwc';
import getStoreDetails from '@salesforce/apex/SalesTreeController.getGroupedTrans';

export default class SalesTreeApp extends LightningElement {
    @track gridColumns = [
        { label: 'Store Type', fieldName: 'Name' },
        { label: 'Sales Rep', fieldName: 'Sales_Rep__c' },
        { label: 'Shoe', fieldName: 'Shoe__c' },
        { label: 'Sale Price', fieldName: 'Sale_Price__c' },
        { label: 'Total Sale Price', fieldName: 'Total_Sale_Price__c' }
    ];

    @track gridData;
    @api recordId;
    storeLocationId;

    connectedCallback() {
        console.log('Record Id:', this.recordId);
        if (!this.recordId) {
            console.error('recordId is undefined');
            return;
        }

        this.storeLocationId = this.recordId;  // Assign recordId to storeLocationId
        this.fetchStoreDetails();
    }

    fetchStoreDetails() {
        console.log('Fetching store details for:', this.storeLocationId);
        
        getStoreDetails({ storeLocationId: this.storeLocationId })
            .then(result => {
                const temp = JSON.parse(JSON.stringify(result));
                for (let i = 0; i < temp.length; i++) {
                    const transgroup = temp[i]._children || [];
                    for (let j = 0; j < transgroup.length; j++) {
                        if (transgroup[j].isTotalRow) {
                            transgroup[j]._rowVariant = 'total-row';
                        }
                    }
                }

                this.gridData = temp;
                console.log('Formatted grid data: ', JSON.stringify(this.gridData));
            })
            .catch(error => {
                console.error('Error fetching store details:', error);
            });
    }
}
