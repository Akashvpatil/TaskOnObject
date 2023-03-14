public with sharing class RecordsFetcherClass {
    @AuraEnabled
    public static map<String,String> FetchObjectName(){
        try {
            Map<String,String> objmap=new Map<String,String>();
         
            for(Schema.SObjectType objNameType : Schema.getGlobalDescribe().values()){
                Schema.DescribeSObjectResult DescribeSObjectResult=objNameType.getDescribe(); 
                 String name=objNameType.getDescribe().getLocalName();
                 String label=objNameType.getDescribe().getLabel();
                objmap.put(name,label);
            }
          return objmap;
            }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Map<String,String> getFields(String ObjectName){
        try {
            Map<String, String> fieldNamesMap=new Map<String,string>();
            Map<String, Schema.SObjectType> fieldMap = Schema.getGlobalDescribe();
              //Schema.SObjectType objectType = Schema.getlobalDescribe.get(ObjectName); 
            for(Schema.SObjectField fields:fieldMap.get(ObjectName).getDescribe().fields.getMap().values()){
                fieldNamesMap.put(fields.getDescribe().getName(),fields.getDescribe().getName());
            }  
            return fieldNamesMap;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static list<sObject> getRecords(String objectName, List<String> fieldNames) {
        List<sObject> records = new List<sObject>();
       
        //List<String> fieldNames = (List<String>) JSON.deserialize(field, List<String>.class);

        if (fieldNames != null && !fieldNames.isEmpty()) {
            String soql = 'SELECT ';
            for (String fieldName : fieldNames) {
                soql += fieldName + ',';
            }
            soql = soql.removeEnd(',');
            soql += ' FROM ' + objectName;
            records = Database.query(soql);
        }
        return records;
    }

    @AuraEnabled
    public static void deleteAccount(sObject accountObject){
        try {
            delete accountObject;
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
    
}