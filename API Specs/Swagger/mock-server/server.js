process.env.DEBUG = 'swagger:middleware';

var fs = require('fs');
var path = require('path');
var express = require('express');
var swaggerParser = require('swagger-parser');
var middleware = require('swagger-express-middleware');
var YAML = require('json2yaml');

var app = express();
var MemoryDataStore = middleware.MemoryDataStore;
var Resource = middleware.Resource;
var data = [];
var resourcesDir = 'resources';
var RESOURCE_CONFIG = require('./config.json');

require('array-prototype-last');
var bodyParser = require('body-parser');
var parser = bodyParser.json();

global.Resource = Resource;
global.data = data;

const totalCountHeader = 'X-Total-Count';


// Start listening on port 8010
middleware(path.join(__dirname, '../src/swagger.yaml'), app, function (err, middleware) {
    var normalizedPath = path.join(__dirname, resourcesDir);
    var myDB = new MemoryDataStore();
    require("fs")
        .readdirSync(normalizedPath).forEach(
            (file) => {
                var fileDir = "./" + resourcesDir + '/' + file;
                require(fileDir);
                // POST is tricky
                // 1. First check if the API falls for POST
                // 2. Based on the POST operation set the body of the response appropriately
                if (RESOURCE_CONFIG.POST.Resources.some(currentResource => currentResource.resourceFileName === file) ||
                    RESOURCE_CONFIG.DELETE.Resources.some(currentResource => currentResource.resourceFileName === file)) {
                    var postResource = RESOURCE_CONFIG.POST.Resources.find((resource) => resource.resourceFileName === file);

                    if (postResource && postResource.operationIds) {
                        postResource.operationIds.forEach((operationId) => {
                            console.log(operationId);
                            app.post(operationId, function (req, res, next) {
                                console.log(operationId);
                                res.set('Access-Control-Expose-Headers', totalCountHeader);
                                res.body = [];
                                findAndSetDataForOperationManually(res, operationId, req);
                                findAndSetDataForOperation(res, operationId);
                                next();
                            });
                        });
                    }

                    var deleteResource = RESOURCE_CONFIG.DELETE.Resources.find((resource) => resource.resourceFileName === file);
                    if (deleteResource && deleteResource.operationIds) {
                        deleteResource.operationIds.forEach((operationId) => {
                            console.log(operationId);
                            app.delete(operationId, function (req, res, next) {
                                console.log(operationId);
                                res.set('Access-Control-Expose-Headers', totalCountHeader);
                                res.body = [];

                                findAndSetDataForOperation(res, operationId);

                                next();
                            });
                        });
                    }
                }
            }
        );

    // For all GET the below memory DB is sufficient for swagger mock

    app.use('/ui', express.static(path.join(__dirname, './swagger')));

    myDB.save(data);
    app.use(
        middleware.metadata(),
        middleware.CORS(),
        middleware.files({ rawFilesPath: '/specs/' }),
        middleware.parseRequest(),
        middleware.validateRequest(),
        middleware.mock(myDB)
    );


    app.listen(8010, function () {
        console.log('Aurea AES CIS Swagger api is now running at http://localhost:8010/');
    });
});

function findAndSetDataForOperation(res, operationId) {
    if (!res.body || res.body.length == 0) {
        global.storeData.forEach((item) => {
            if (item.key == operationId) {
                res.body = item.value;
                return;
            }
        });
    }
}

function findAndSetDataForOperationManually(res, operationId, req) {
    switch (operationId) {
        case global.loginOperationId:
            res.body = {
                "access_token": "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYW9zc2lwIiwic3ViIjoiOTU1IiwibmFtZSI6IkFsZXhhbmRyIE9zc2lwIiwiZW1haWwiOiJhbGV4YW5kci5vc3NpcEBhdXJlYS5jb20iLCJsYXN0TG9naW4iOiIxMC8zMC8yMDE3IDExOjIzOjA5IEFNIiwibmJmIjoxNTA5MzgzMTU2LCJleHAiOjE1MDkzODQ5NTYsImlzcyI6InN0cmVhbWVuZXJneS5iaWxsaW5nLmNvbSJ9.ZeAhZEiT6Soj1QDmXrY8_tngV6j8ZO2uD8vmwZwrFYM",
                "token_type": "bearer",
                "expires_in": 1799
            };
            break;
        case global.customerSearchOperationId:
            myDB.getCollection('/api/customer/search/result', (err, resources) => {
                resources.map(x => res.body.push(x.data));
            });
            res.set(totalCountHeader, 95);
            break;
        case global.adjustmentreport:
        case global.activeunbilledreport:
        case global.billreadytrackingreport:
        case global.billreadytrackingreportdrilldown:
        case global.billreadymarketfiles:
            useRequestQuery(req, res, operationId);
            break;
        case global.CustomerCommunicationLogOperationId:
            var searchResult = data.find((resource) => resource.collection === '/notes/communicationlog');
            res.body = searchResult.data;
            break;
        case global.customerUpdateCommunicationLogOperationId:
            var searchResult = data.find((resource) => resource.collection === '/notes/updatecommunicationlog');
            res.statusMessage = 'MockOK';
            break;
        case global.cancelPendingChangeRequestOperationId:
            res.body = {
                Status: "Success",
                Message: "Canceled pending change reqeust."
            };
            break;
        case global.customerEnrollmentSearchOperationId:
            res.body = {
                Status: "Success",
                Message: "Enrollment Interface API is overriden."
            };
            break;
        case global.enrollmentReSubmitInterfaceApiCheckOperationId:
            res.body = {
                Status: "Success",
                Message: "Enrollment Interface API is re-submitted."
            };
            break;
        case global.customerLetterResendOperationId:
            res.body = {
                Status: "Success",
                Message: "Letter Re-Sent Successfully."
            };
            break;
        case global.sendNewLetterOperationId:
            res.body = {
                Status: "Success",
                Message: "Letter Sent Successfully."
            };
            break;
        case global.callLogAddnewItemOperationId:
            res.body = {
                Status: 'Success',
                Message: "New communication entry added."
            };
            break;
        case global.utilityAccountsOperationId:
            myDB.getCollection('/api/customer/10085/utilities/result', (err, resources) => {
                resources.map(x => res.body.push(x.data));
            });
            break;
        case global.consumptionAmountsOperationId:
            myDB.getCollection('/api/customer/10085/consumptionamounts/result', (err, resources) => {
                resources.map(x => res.body.push(x.data));
            });
            break;
        case global.utilityTransactionsOperationId:
            myDB.getCollection('/api/premise/84/transactions/result', (err, resources) => {
                resources.map(x => res.body.push(x.data));
            });
            break;
        case global.finalReadsOperationId:
            myDB.getCollection('/api/customer/10085/finalread/result', (err, resources) => {
                resources.map(x => res.body.push(x.data));
            });
            break;
        case global.emailqueueOperation:
            res.body = {
                Status: "Success",
                Message: "Email resent."
            };
            break;
        case global.billcyclelockOperationId:
            res.body = {
                Status: "Success",
                Message: "Batch successfully locked."
            };
            break;
        case global.specialchargeaddcommand:
            res.body = {
                Status: 'Success',
                Message: "Charge successfully added."
            };
            break;
        case global.igniteInfoChangeOperationId:
            res.body = {
                Status: "Success",
                Message: "Independent agent successfully changed."
            };
            break;
        case global.validateAccountOperationId:
        case global.validateAddressOperationId:
        case global.validateDepositOperationId:
        case global.validateSepOperationId:
            res.body = {
                Result: "Success",
                Message: "The form details are valid."
            };
            break;
        case global.customerEnrollmentSearchOperationId:
            var searchResult = data.filter(
                (res) => res.collection === '/api/request-for-service/search'
            ).map(res => res.data);
            res.body = searchResult.data;
            break;
        case global.sendInvoiceMailOperationId:
            res.body = {
                Status: "Success",
                Message: "Invoice Scheduled for send."
            };
            break;
        case global.rawMarketUpdateOperationId:
            res.body = {
                Status: "Success",
                Message: "Raw market transaction successfully updated!"
            };
            break;
        case global.saveEnrollmentOperationId:
            res.body = {
                Status: "Success",
                Message: "Customer enrollment request successfully saved!"
            };
            break;
        case global.billCyclesUpdateOperationId:
            res.body = {
                Status: "Success",
                Message: "BillCyle updated successfully!"
            };
            break;
        case global.billCyclesRegisterOperationId:
            res.body = {
                Status: "Success",
                Message: "BillCyle registered successfully!"
            };
            break;
        case global.meterDateUpdatePath:
            res.body = {
                Status: "Success",
                Message: "Meter dates successfully updated!"
            };
            break;
        case global.consumptionsPath:
            res.body = {
                Status: "Success",
                Message: "Consumption successfully added!"
            };
            break;
        case global.consumptionUpdatePath:
            res.body = {
                Status: "Success",
                Message: "Consumption successfully updated!"
            };
            break;
        case global.consumptionDeletePath:
            res.body = {
                Status: "Success",
                Message: "Consumption successfully deleted!"
            };
            break;
        case global.consumptionEstimationsPath:
            res.body = {
                Status: "Success",
                Message: "Consumption estimation successfully added!"
            };
            break;
        case global.requestForQuoteCreateOperationId:
            res.body = {
                Status: "Success",
                Message: "Request for quote created. Ref Id: 605837."
            };
            break;
        case global.rateSearchOperationId:
            res.body = [];
            myDB.getCollection('/api/rate/search/result', (err, resources) => {
                resources.map(x => res.body.push(x.data));
            });
            res.set('X-Total-Count', 95);
            break;
        case global.rateRegisterOperationId:
        case global.rateUpdateOperationId:
            res.body = {
                Status: "Success",
                Message: "Rate successfully saved!"
            }
            break;
        case global.customerPostPaymentOpId:
            res.body = {
                Status: "Success",
                Message: "Payment applied to the invoice."
            }
            break;
        case global.batchSearchOperationId:
            res.body = [];
            myDB.getCollection('/api/batch/search/result', (err, resources) => {
                resources.map(x => res.body.push(x.data));
            });
            res.set('X-Total-Count', 2);
            break;
        case global.customerswithunbilledconsumptionOperationId:
            res.body = [
                {
                    "CustomerId": 10085,
                    "CustomerNumber": "3000000498",
                    "CustomerName": "Customer X",
                    "TotalMeterCount": 1,
                    "MeterCount": 1,
                    "ConsumptionCount": 1,
                    "MinConsumptionDate": "29-01-2018",
                    "DaysSinceLastBill": 58
                },
                {
                    "CustomerId": 10086,
                    "CustomerNumber": "3000000139",
                    "CustomerName": "Customer Y",
                    "TotalMeterCount": 2,
                    "MeterCount": 1,
                    "ConsumptionCount": 2,
                    "MinConsumptionDate": "30-01-2018",
                    "DaysSinceLastBill": 34
                }
            ];
            break;
        case global.invoiceThreshold1UpdateOperationId:
            res.body = {
                Status: "Success",
                Message: "Invoice threshold updated successfully!"
            };
            break;
        case global.invoiceThreshold2UpdateOperationId:
            res.body = {
                Status: "Error",
                Message: "Some error occured."
            };
            break;
        case global.rule1DeleteOperationId:
            res.body = {
                Status: "Success",
                Message: "Rule deleted successfully."
            };
            break;
        case global.rule2DeleteOperationId:
            res.body = {
                Status: "Error",
                Message: "Some error occured."
            };
            break;
        case global.rule1SetOrderOperationId:
            res.body = {
                Status: "Success",
                Message: "Rule Order updated successfully."
            };
            break;
        case global.rule2SetOrderOperationId:
            res.body = {
                Status: "Error",
                Message: "Some error occured."
            };
            break;
        case global.scheduledReportsDelete:
            res.body = {
                Status: "Success",
                Message: "Scheduled reports deleted successfully."
            };
            break;
        case global.rule1UpdateOperationId:
            res.body = {
                Status: "Success",
                Message: "Rule Order updated successfully."
            };
            break;
        case global.rule2UpdateOperationId:
            res.body = {
                Status: "Error",
                Message: "Some error occured."
            };
            break;
        case global.ruleAddOperationId:
            res.body = {
                Status: "Success",
                Message: "Rule Order updated successfully."
            };
            break;
        case global.securitygroupUpdateOperationId:
            res.body = {
                Status: "Success",
                Message: "Updated successfully.",
                IsSuccess: true
            };
            break;
        case global.securitygroupPutObjectsOperationId:
            res.body = {
                Status: "Success",
                Message: "Updated successfully.",
                IsSuccess: true
            };
            break;
        case global.scheduleDailyBillingId:
            res.body = {
                Status: "Success",
                Message: "Daily Billing Report scheduled successfully.",
                IsSuccess: true
            };
            break;
        case global.securitygroupCopyObjectsOperationId:
            res.body = {
                Status: "Success",
                Message: "Updated successfully.",
                IsSuccess: true
            };
            break;
            case global.validateratepackagestep1OperationId:
            res.body = {
                Status: "Success",
                IsSuccess: true,
                Message: ""
            };
            break;
            case global.ratepackageaddOperationId:
            res.body = {
                Status: "Success",
                IsSuccess: true,
                Message: ""
            };
            break;
        case global.validateratepackagechargedetailOperationId:
        case global.validateratepackageindextypeOperationId:
        case global.editSecurityDepositTransactionForCustomerActivityOperationId:
        case global.editSecurityDepositForCustomerActivityOperationId:
        case global.global.securityDepositCollectOperationId:
            res.body = {
                Status: "Success",
                IsSuccess: true,
                Message: ""
            };
            break;
        case global.securitygroupPutUsersOperationId:
            res.body = {
                Status: "Success",
                Message: "Updated successfully.",
                IsSuccess: true
            };
            break;
        case global.tdsptemplateSaveOperationId:
            res.body = {
                Status: "Success",
                Message: "Updated successfully.",
                IsSuccess: true
            };
            break;
        case global.addRateTransitionOperationId:
            res.body = {
                Status: "Success",
                Message: "Rate transition added successfully.",
                IsSuccess: true
            };
            break;
        default:
            break;
    }
}

function useRequestQuery(req, res, operationId){
    var values = global.storeData.filter(i=>i.key == operationId)[0].value;
    if(req.query && (req.query.$offset || req.query.$limit)){
        const offset = req.query.$offset
            ? parseInt(req.query.$offset)
            : 0;
        const end = req.query.$limit 
            ? parseInt(req.query.$limit) + offset 
            : values.length;
        res.body = values.slice(offset, end);
    } else {
        res.body = values
    }
    res.set(totalCountHeader, values.length);
}
