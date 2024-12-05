// START OF FUNCTION OBJECTS (has to be at the head so that the engine can use them)
engine = {
    testEapi: function(responseObj) {
        if(pm.collectionVariables.get('expected') !== undefined ){
            while (Object.keys(pm.collectionVariables.get('expected')).length !== 0) {

                const variables = pm.collectionVariables.get('expected').shift();
                const testVars = responseObj;
                const clients = pm.environment.get('clients');
                var attribute = variables.attribute;
                var value = variables.value;
                var type = variables.type;
                var format = "YYYY-MM-DD";
                var objVal = null;

                // Going to map the attributes to determine the useCurrent value to use
                // More can be added as needed
                if (value === "useCurrent") {
                    // This one is for borrowing requirements and checking current KYC property
                    if (attribute === "existingPropertyId") {
                        value = pm.collectionVariables.get('LatestPropertyId');
                    };
                    // This one is for mortgage porting and checking propertyId, mortgageId are from KYC
                    // and checking comparisonQuoteId is from the LatestMortgageQuoteId
                    if (attribute === "propertyId") {
                        value = pm.collectionVariables.get('LatestPropertyId');
                    };
                    if (attribute === "mortgageId") {
                        value = pm.collectionVariables.get('LatestMortgageId');
                    };
                    if (attribute === "comparisonQuoteId") {
                        value = pm.collectionVariables.get('LatestMortgageQuoteId');
                    };
                    if (attribute === "client2") {
                        var id = engine.getClient(2,clients);
                        if(!(id === "clientNotFound")) {
                            value = clients[id].lastClientId;
                        } else {
                            value = null;
                        }
                    };
                };

                if( type.toLowerCase() === "string"){
                    pm.test("Test expected: "+attribute+" to be: "+value, function() {
                        utils.testString(value, eval("testVars." +attribute));
                    });
                } else if(type.toLowerCase() === "date"){
                    if(variables.format){
                        format = variables.format;
                    }
                    if(variables.objVal) {
                        objVal = variables.objVal;
                    }
                    pm.test("Test expected: "+attribute+" to be: "+value, function() {
                        utils.testDate(value, objVal, eval("testVars." +attribute), format);
                    });
                } else if(type.toLowerCase() === "boolean") {
                    pm.test("Test expected: "+attribute+" to be: "+value, function() {
                        utils.testBool(value, eval("testVars." +attribute));
                    });
                } else if((type.toLowerCase() === "int") || (type.toLowerCase() === "integer")) {
                    pm.test("Test expected: "+attribute+" to be: "+value, function() {
                        utils.testInt(value, eval("testVars." +attribute));
                    });
                } else if((type.toLowerCase() === "float") || (type.toLowerCase() === "number")) {
                    pm.test("Test expected: "+attribute+" to be: "+value, function() {
                        utils.testFloat(value, eval("testVars." +attribute));
                    });
                }
            }
        }
    },

    testArrOfObjs: function(arrOfObjs) {
        arrOfObjs.forEach(function (responseObj) {
            while (Object.keys(pm.collectionVariables.get('expected')).length !== 0) {
                const variables = pm.collectionVariables.get('expected').shift();
                const testVars = responseObj;
                const clients = pm.environment.get('clients');
                var attribute = variables.attribute;
                var value = variables.value;
                var type = variables.type;
                var format = "YYYY-MM-DD";
                var objVal = null;
                // Going to map the attributes to determine the useCurrent value to use
                // More can be added as needed
                if (value === "useCurrent") {
                    // This one is for borrowing requirements and checking current KYC property
                    if (attribute === "existingPropertyId") {
                        value = pm.collectionVariables.get('LatestPropertyId');
                    };
                    // This one is for mortgage porting and checking propertyId, mortgageId are from KYC
                    // and checking comparisonQuoteId is from the LatestMortgageQuoteId
                    if (attribute === "propertyId") {
                        value = pm.collectionVariables.get('LatestPropertyId');
                    };
                    if (attribute === "mortgageId") {
                        value = pm.collectionVariables.get('LatestMortgageId');
                    };
                    if (attribute === "comparisonQuoteId") {
                        value = pm.collectionVariables.get('LatestMortgageQuoteId');
                    };
                    if (attribute === "client2") {
                        var id = engine.getClient(2,clients);
                        if(!(id === "clientNotFound")) {
                            value = clients[id].lastClientId;
                        } else {
                            value = null;
                        }
                    };
                };

                if( type.toLowerCase() === "string"){
                    pm.test("Test expected: "+attribute+" to be: "+value, function() {
                        utils.testString(value, testVars[attribute]);
                    });
                } else if(type.toLowerCase() === "date"){
                    if(variables.format){
                        format = variables.format;
                    }
                    if(variables.objVal) {
                        objVal = variables.objVal;
                    }
                    pm.test("Test expected: "+attribute+" to be: "+value, function() {
                        utils.testDate(value, objVal, testVars[attribute], format);
                    });
                } else if(type.toLowerCase() === "boolean") {
                    pm.test("Test expected: "+attribute+" to be: "+value, function() {
                        utils.testBool(value, testVars[attribute]);
                    });
                } else if((type.toLowerCase() === "int") || (type.toLowerCase() === "integer")) {
                    pm.test("Test expected: "+attribute+" to be: "+value, function() {
                        utils.testInt(value, testVars[attribute]);
                    });
                } else if((type.toLowerCase() === "float") || (type.toLowerCase() === "number")) {
                    pm.test("Test expected: "+attribute+" to be: "+value, function() {
                        utils.testFloat(value, testVars[attribute]);
                    });
                }
            }
        })
    },

    getVars: function(which) {
        //console.log(pm.collectionVariables.values);

        // Code to loop through collection variables so that we can output or record the state of collection variables 
        // at any time within the run
        var len = pm.collectionVariables.values.members.length;
        var i = 0;
        var outObj = {};
        //console.log("length: "+len);

        while( i < len) {
            const variables = pm.collectionVariables.values.members[i];
            var cvar = '';
            var cval = '';

            Object.entries(variables).forEach(([key, value]) => {
                if( key === 'key') {
                    cvar = value;
                };

                if( key === 'value') {
                    cval = value;
                };
            });

            outObj[cvar]=cval;
            //console.log(cvar+":"+cval);
            i++;
        }
        console.info(JSON.stringify(outObj));
    },

    // Error Handler.  NOTE: It is not possible to set collection variables within the scope of 
    // a function so the variable used to flag exit is set directly before the function call. 
    sendError: function(message) {
        console.log("..Exiting the test.."); 
        /*pm.test(pm.info.requestName+" : "+message, function() {
            pm.expect(false).to.be.true;
        });*/
        throw new Error(message);
    },

    // General method for creating random strings. Used typically in the create client to append
    // random alphanumeric to givenName and to create random nationalInsuranceNumber. 
    randomAlphaString: function(length) {
        let randomAlphaString = "";
        for (let i=0; i< length; i++) {
            randomAlphaString += pm.variables.replaceIn("{{$randomAlphaNumeric}}");
        }
        return randomAlphaString.toUpperCase();
    },

    addClient: function(clientNum, newClient, existingClients, random, error, deleted, correlationId, clientId, concerthubContactId) {
        console.info("Adding Client: "+clientNum);
        var moment = require('moment');
        var currentdate = moment().format("DD-MM-YYYY HH:mm:ss");
        var clients = [];
        const newClientObj = { 
            client: clientNum,
            givenName: newClient.givenName, 
            familyName: newClient.familyName, 
            nationalInsuranceNumber: newClient.nationalInsuranceNumber, 
            deleted: deleted, 
            error: error, 
            random: random,
            correlationId: correlationId,
            concerthubContactId: concerthubContactId,
            lastClientId: clientId,
            createdOn: currentdate,
            deletedOn: null,
            originalOwner: null
            };

        //console.info("newClientObj after update:"+JSON.stringify(newClientObj));
        // append the new client into the existing
        clients = [ ...existingClients, newClientObj];
        console.info("clients is: "+JSON.stringify(clients));
        return clients;
    },

    getClient: function(clientNum, existingClients) {
        //console.info("Getting Client Object:"+clientNum);
        const clients = existingClients;
        for ( let i=0; i < clients.length; i ++ ) {
            if ( clients[i].client === clientNum ) {
                return i;
            }
        }
        console.log("There is an issue. Unable to find client: "+clientNum);
        return "clientNotFound";
    },

    updateClient: function(clientNum, existingClients, property, newValue) {
        console.info("Updating Client: "+clientNum+" with new property: "+property);
        
        var clients = existingClients;
        //console.info("clients: "+JSON.stringify(clients));

        for ( let i=0; i < clients.length; i ++ ) {
            if ( clients[i].client === clientNum ) {
                clients[i][property] = newValue;
                console.info("clients is: "+JSON.stringify(clients));
                return clients;      
            }
        }   
    },

    deleteClient: function(clientNum, existingClients) {
        console.info("Deleting Client: "+clientNum);

        var moment = require('moment');
        var currentdate = moment().format("DD-MM-YYYY HH:mm:ss");

        var clients = existingClients;

        for ( let i=0; i < clients.length; i ++ ) {
            if ( clients[i].client === clientNum ) {
                clients[i].deleted = true;
                clients[i].deletedOn = currentdate;
                console.info("clients is: "+JSON.stringify(clients));
                return clients;
            }
        }      
    },

    testConcert: function(ppm) {
        /* returns true or false whether concert requests will be run
        The environment setting when true or false will override proceedings.
        If the environment is not set then collection variable will override proceedings
        If both are not set then default to run the request will override
        */
        var collTestConcert = pm.collectionVariables.get('testConcert');
        var envTestConcert = pm.environment.get('testConcert');

        //Debug Checks if logic rules are not doing what you expect:
        if( pm.environment.get('debug') !== undefined ) {
            console.info("testConcert CollectionVariable: "+collTestConcert+" type: "+typeof collTestConcert);
            console.info("testConcert EnvironmentVariable: "+envTestConcert+" type: "+typeof envTestConcert);
        };
        
        /* logic rules
        VariableName        collection          environment    output
        testConcert         not set             not set        run request
                            not set             true           run request
                            true (default)      true (default) run request
                            false               true           run request
                            true (default)      not set        run request
                            not set             false          not run
                            true (default)      false          not run
                            false               false          not run
                            false               not set        not run
        */
        if (((collTestConcert === undefined) && (envTestConcert === undefined)) ||
             ((collTestConcert === undefined) && ((envTestConcert === true) || (envTestConcert === "true"))) ||
             ((collTestConcert) && (envTestConcert === undefined)) ||
             ((collTestConcert) && ((envTestConcert === true) || (envTestConcert === "true"))) ||
             ((!collTestConcert) && ((envTestConcert === true) || (envTestConcert === "true")))) {

            if( pm.environment.get('debug') !== undefined ) {
                console.info("testConcert(): Running this concert request: "+pm.info.requestName);
            };
            // Before we return to the API request we will check if there is a concertDelay configured. Otherwise we will 
            // delay for a fixed default time of 3 seconds before sending the API request.
            // The precendence of the concertDelay will be local, collection, environment, default 
            // to give the most flexible control.  
            var concertFinalDelay = 5000;

            if(pm.variables.get('concertDelay')) {
                console.log("Concert Delay from local Variable: "+pm.variables.get('concertDelay'));
                concertFinalDelay = pm.variables.get('concertDelay');
                ppm.variables.unset('concertDelay');
            } else if (pm.collectionVariables.get('concertDelay')) {
                console.log("Concert Delay from local Collection Variable: "+pm.collectionVariables.get('concertDelay'));
                concertFinalDelay = pm.collectionVariables.get('concertDelay');
            } else if (pm.environment.get('concertDelay')) {
                console.log("Concert Delay from environment: "+pm.environment.get('concertDelay'));
                concertFinalDelay = pm.environment.get('concertDelay');
            } else {
                // This is the default delay for all concert API requests
                if( pm.environment.get('debug') !== undefined ) {
                    console.info("Concert Delay from default which is "+concertFinalDelay);
                };
            };
            // Cannot run a setTimeout from within a function. At least I couldn't get it to not run async.
            // Tried promises but also couldn't get to work, so instead sending the delay back to the calling script
            return concertFinalDelay;
        } else {
            if( pm.environment.get('debug') !== undefined ) {
                console.log("testConcert(): Not running this concert request: "+pm.info.requestName);
            };
            return -1;
        };
    }

};

// Don't touch this utils object which is from DEV.  It contains the common OW collection asserts.  
// There are some issues with them, IMO, but I've not broached that subject with anyone yet.  

utils = {
  testObj: function (expectedValue, actualObjectValue, actualStringValue) {
    if (expectedValue === "null" || expectedValue === null || typeof expectedValue === "undefined") {
      pm.expect(actualObjectValue).to.be.null;
    } else {
      pm.expect(actualStringValue).to.be.eq(expectedValue);
    }
  },

  testString: function (expectedValue, actualValue) {
    if (expectedValue === "null") {
      pm.expect(actualValue).to.be.null;
    } else {
      pm.expect(actualValue).to.be.eq(expectedValue);
    }
  },

  testFloat: function (expectedValue, actualValue) {
    if (expectedValue === "null" || expectedValue === null || typeof expectedValue === "undefined" ) {
      pm.expect(actualValue).to.be.null;
    } else {
      pm.expect(actualValue).to.be.eq(parseFloat(expectedValue));
    }
  },
 
  testInt: function (expectedValue, actualValue) {
    if (expectedValue === "null" || expectedValue === null || typeof expectedValue === "undefined") {
      pm.expect(actualValue).to.be.null;
    } else {
      pm.expect(actualValue).to.be.eq(parseInt(expectedValue));
    }
  },
 
  testBool: function (expectedValue, actualValue) {
    if (expectedValue === "null" || expectedValue === null || typeof expectedValue === "undefined") {
      pm.expect(actualValue).to.be.null;
    } else {
        //console.log("type of expectedValue "+ expectedValue + "is: " + typeof(expectedValue));
        //console.log("type of actualValue "+ actualValue + "is: " + typeof(actualValue));
        if( typeof expectedValue == 'boolean')
        {
            if (expectedValue === true) {
                pm.expect(actualValue).to.eq(true);
            } else {
                pm.expect(actualValue).to.eq(false);
            }
        } else
        {
            console.log("USER ERROR. Test Data should be boolean and not string. Fix it.");
            if (expectedValue.toLowerCase() === "true") {
                pm.expect(actualValue).to.be("true");
            } else {
                pm.expect(actualValue).to.be("false");
            }
        }
    }
  },

  testYesNo: function (expectedValue, actualObjectValue, actualValue) {
    if (expectedValue === "null" || expectedValue === null || typeof expectedValue === "undefined") {
      pm.expect(actualObjectValue).to.be.null;
    } else {
      if ((expectedValue === "true") || (expectedValue === true) || (expectedValue === "Yes") || (expectedValue === "yes") )  {
        pm.expect(actualValue).to.be.eq("Yes");
      } else {
        pm.expect(actualValue).to.be.eq("No");
      }
    }
  },

  testDate: function (expectedValue, actualObjectValue, actualValue, format) {
    const moment = require("moment");
 
    if (expectedValue === "null" || typeof expectedValue === "undefined" || expectedValue === null ) {
      pm.expect(actualObjectValue).to.be.null;
    } else {
        pm.expect(moment(actualValue, format).isSame(moment(expectedValue))).to.be.true;
    }
  },

    testDateIso: function (expectedValue, actualObjectValue, actualValue) {
        const moment = require("moment");
        if (expectedValue === "null") {
            pm.expect(actualObjectValue).to.be.null;
        } else {
            pm.expect(moment(expectedValue, 'YYYY-MM-DD').isSame(moment(actualValue, 'DD/MM/YYYY'))).to.be.true;  
    }
  }
};

// END OF FUNCTION OBJECTS


// START OF ENGINE
// If we are running a request manually outside of the runner then 
// we need to bypass entering the engine code below. !!there be dragons!!
if(Object.keys(pm.iterationData.toObject()).some(key => key === 'requests'))
{
    console.log(" ======= ENTERING COLLECTION PRE REQUEST SCRIPT ======")
    console.log("current iteration: "+(parseInt(pm.info.iteration) + 1));
    console.log("total iterations to be run:" +pm.info.iterationCount);

    //var my_data = pm.iterationData.toObject();
    //console.log(JSON.stringify(my_data));

    // Load data from json test file to collection variable 'requestData'
    // Going to read the whole lot in one go.
    // Should only do this once when the runner is started
    // (NOTE: You can ignore iteration Data in the UI Runner because this script is the runner)
    if(typeof pm.variables.get('requestData') !== 'object')
    {
        console.log("=== THIS IS THE FIRST TIME ENTRY ===");
        pm.variables.set('requestData', pm.iterationData.toObject());


        // Going to clear some dynamic variables if this is the first iteration.
        // We don't want to start a new test with some leftovers in place
        // Likely will need to end up doing this better to allow parallel running
        // The issue is around having local variables persist between iterations
        if( pm.info.iteration === 0) {

            // Initialise the variables for a new test run. 
            console.log("Initialising Collection Variables for this test run"); 
            pm.collectionVariables.clear();
            //pm.collectionVariables.unset('Client1Id');
            //pm.collectionVariables.unset('Client2Id');
            //pm.collectionVariables.unset('ConcerthubContactId');

            // NOTE: To persist variables between sessions needs coding to PUT changes to the environment initial values
            // This would require use of postman GET/PUT environment requests + API key. 
            // https://www.postman.com/postman/workspace/postman-answers/collection/1559645-374325e1-34cd-447c-8fda-66f1a8cc7cb5
            // As client persistence is not a confirmed requirement at this time clients will be cleaned
            // between sessions and only persist for the test run. 
            if (pm.environment.get('clients')) {
                console.info("Entering this test with persisted clients: "+JSON.stringify(pm.environment.get('clients')));
                console.info("This only currently happens when running collection from Postman UI. Going to clear this as we don't support at this time");
                console.info("Creating a new persisted clients object");
                pm.environment.set('clients',[]);
            } else {
                console.info("Creating a new persisted clients object for this test run");
                pm.environment.set('clients', []);
            };
        }
        
        // initialise variables for this iteration.
        // setting to collection if we want to expose or local variables for the internal execution
        // ** TO DO ** More consideration when parallel running
        console.log("Initialising Variables for this iteration"); 
        pm.collectionVariables.set('hasCurrentRun', false);
        pm.collectionVariables.set('dataIsPresent', false);
        pm.collectionVariables.set('IterationCount', 1);
        pm.collectionVariables.set('skip', false);
        pm.collectionVariables.set('ExitRun', false);
        pm.collectionVariables.set('step', 0);
        if(pm.collectionVariables.get('expected') !== undefined) pm.collectionVariables.unset('expected');

        // We are going to skip this first request because postman will always try to run the first request it finds in the collection. 
        // We don't want that. We want the first request to be the first request from the test file
        const requestData = pm.variables.get('requestData');

        // First do a quick check to make sure the test file is valid....well more checks can be added
        // ** TO DO ** Add more test file validation checks, although this is NOT a compiler we could walk through the requestData object to do sanity checks
        // If 'requestData' is empty then we will exit the run
        if(typeof requestData != 'object' || Object.keys(requestData.requests).length === 0)
        {
            console.log('No external data provided/data set is empty');
            pm.execution.setNextRequest(null);
        }
        else
        {
            console.log("1. requestData at start of the pre-request script for current request: " + pm.info.requestName + " data: " + JSON.stringify(requestData));
            console.log("=== TEST SCRIPT STARTING STEP WILL BE: " + requestData.requests[0].name);
            pm.execution.setNextRequest(requestData.requests[0].name);
        }

        pm.execution.skipRequest();
    }

    // If an exit Error has been tripped, then we are going to skip all further iterations
    // It is not particularly graceful, bit like a sledge hammer, but postman struggles to exit
    // on error when you are using iterations.  
    console.log("ExitRun state is: "+pm.collectionVariables.get('ExitRun'));
    if (pm.collectionVariables.get('ExitRun') === true) {
        console.log("Test Run Exit Error. Not entering further iterations:"+pm.info.iteration);
        pm.execution.setNextRequest(null);
        pm.execution.skipRequest();
    }

    // If the collection request needs to use a mock delay then we will let it do that and work iteself out before coming back to the runner.
    // Also need to detect if we are suddenly out of sync by a stray "exception" setNextRequest being set in a request Arghh! those DEVs.  
    // For example the delete requests are currently hard coding NextRequestState to be null which kills the run. Will need new delete requests without that, please.
    if( pm.info.requestName === 'Mock Delay') {
        // we will reset the hasCurrentRun so that once a delay happens and the current request replays then it will be treated like 
        // it is the first time run
        console.log("5. mock delay detected. Allowing through...");
        pm.collectionVariables.set('hasCurrentRun', false);
    }
    else{

        console.log("1a. Postman is going to run this request: " + pm.info.requestName);
        
        // ** TODO ** Would be good to check that the request name from the data does exist in the collection
        // ** TODO ** The pm.info.requestName should always be under the control of this runner. 
        // We are NOT going to sequentially run through setNextRequests as they are presented in collection, requests and folders. !That is NOT up for negotiation!
        const requestData = pm.variables.get('requestData');

        // If no data found for current request (no iterations) and the request has already run
        // then we want to skip the request and move on to the next step in the test
        // NOTE: This will always be called when a request has no data left because we need to skip this and prepare for the next request.
        if((pm.collectionVariables.get('dataIsPresent') === false) && (pm.collectionVariables.get('hasCurrentRun') === true) ){

            console.log("2. Request " + requestData.requests[pm.collectionVariables.get('step')].name + " has no data, and the request has run already.");

            // This is some cleanup to prepare for the next step in the test.
            pm.collectionVariables.set('hasCurrentRun', false);
            var newStepValue = pm.collectionVariables.get('step') + 1;
            pm.collectionVariables.set('step', newStepValue);

            // check there is a next step to process
            if(requestData.requests[pm.collectionVariables.get('step')])
            {
                console.log("2a. Preparing for next step: " + pm.collectionVariables.get('step') + " which is: " + requestData.requests[pm.collectionVariables.get('step')].name );
                pm.execution.setNextRequest(requestData.requests[pm.collectionVariables.get('step')].name);
                pm.execution.skipRequest();
            }
            else
            {
                console.log("2b. We have run out of steps for this iteration."); 
                //console.log("2b. Gather your results. You are done");
                pm.variables.clear('requestData');
                pm.execution.setNextRequest(null);
                pm.execution.skipRequest();
            }
        }

        // Process the current step
        const currentRequest = requestData.requests[pm.collectionVariables.get('step')];
        console.log("3. PROCESSING currentRequest: "+ JSON.stringify(currentRequest));

        //Checking if we need to skip this Iteration
        if(Object.keys(currentRequest).some(key => key === 'skipIteration')) {
            if( currentRequest.skipIteration === true) {
                console.info("skipping this Iteration: "+JSON.stringify(currentRequest.data[0].message));
                //console.info("skipping this Iteration "+pm.info.iteration);
                pm.variables.clear('requestData');
                pm.collectionVariables.set('skip', true);
                pm.execution.setNextRequest(null);
                pm.execution.skipRequest();
            } else if ( currentRequest.skipIteration === false) {
                console.log("skipIteration is set to false");
            } else {
                console.warn("There is a skipIteration keyword but it is set to "+currentRequest.skipIteration+". Odd.  Did you mean this? Should be 'true or false'. Steps and Iteration will be run");
            }
        }



        //Checking if we need to skip this step
        if(Object.keys(currentRequest).some(key => key === 'skip')) {
            if( currentRequest.skip === true) {
                console.info("skipping this request "+currentRequest.name);
                pm.collectionVariables.set('hasCurrentRun', true);
                pm.collectionVariables.set('skip', true);
                pm.collectionVariables.set('NextRequest', currentRequest.name);
                pm.execution.setNextRequest(currentRequest.name);
                pm.execution.skipRequest();
            } else if ( currentRequest.skip === false) {
                console.log("skip is set to false");
            } else {
                console.warn("There is a skip keyword but it is set to "+currentRequest.skip+". Odd.  Did you mean this? Should be 'true or false'. Step will be run");
            }
        }


        //Checking if we need to store the client being created
        if(Object.keys(currentRequest).some(key => key === 'createClient')) {
            if( currentRequest.createClient === 1) {
                pm.variables.set('createClient', 1);
                console.info(pm.info.requestName+": Processing client: " +pm.variables.get('createClient'));
            } else if (currentRequest.createClient === 2 ) {
                pm.variables.set('createClient', 2);
                console.info(pm.info.requestName+": Processing client: " +pm.variables.get('createClient'));
            } else {
                console.warn("There is a 'createClient' keyword but it is set to "+currentRequest.createClient+". Odd.  Did you mean this?");
            }
        }

        //Checking if the concertDelay keyword is being used in the step
        if(Object.keys(currentRequest).some(key => key === 'concertDelay')) {
            pm.variables.set('concertDelay',currentRequest.concertDelay);
        }

        //Checking if changeName keyword or useRandomName keywords are set
        //If they are, then store as variables for pre/post script access in this iteration
        if(Object.keys(currentRequest).some(key => key === 'changeName')) {
            currentRequest.changeName === true ? pm.variables.set('changeName', true) : pm.variables.set('changeName', false);
        }

        if(Object.keys(currentRequest).some(key => key === 'useRandomName')) {
            currentRequest.useRandomName === true ? pm.variables.set('useRandomName', true) : pm.variables.set('useRandomName', false);
        }

        if(Object.keys(currentRequest).some(key => key === 'entityType')) {
            pm.variables.set('entityType', currentRequest.entityType); 
        }


        // Adding a delay between each request. This is real control ;o)
        // Can override the delay by adding as an optional step parameter, otherwise will go with 500mSec.  Could lift the default into Global or Collection Var
        // NOTE: Be aware. The delay will happen BEFORE the current request is run and not after. 
        // E.g. If you run a POST request and want a delay before running next checking request, then the delay should be in the checking step and not the POST. 
        // To prevent waiting on a delay if there has been a request to skip the step or the iteration
        if( pm.collectionVariables.get('skip') === false ) {
            if(Object.keys(currentRequest).some(key => key === 'delay'))
            {
                setTimeout(function(){}, currentRequest.delay);
            }
            else {
                setTimeout(function(){}, 200);
            }
        }

        // if this is a definition step then we will check for a summary object to add to collection,
        // although it could be that a summary object appears in more than just the definition step, so
        // best to just check for the object and set it if it is present. 
        if(Object.keys(currentRequest).some(key => key === 'summary')) {
            if(Object.keys(currentRequest.summary).length !== 0) {

                pm.collectionVariables.set('testSummary', currentRequest.summary);
            }
        }

        // Check for the expected object.
        // Allows attribute names to stay as they are when performing expected value tests. 
        // No need to add prefixes to expected variables in a test because the expected variables are held
        // within an object and it will be used to dynamically test a requests response
        // Using an object allows to put more information about what is being tested. 
        // For example, can add a type property for the attribute so that we verify the type as well as the value. 
        // Using an object also provides the ability to test CHUB properties where the test may verify an ow value and a formatted value as well as a type. 
        // Using the expected object keeps the attribute data variables clean. Expected object will be removed after the test and results will be added 
        // into a testReport object (under development/review).  
        // For now, we are coding expected only to support EAPI tests (one step at a time)
        // expected: [{ attribute: attributeName, value: attributeValue, type: attributeType}]
        if(Object.keys(currentRequest).some(key => key === 'expected')) {
            if(Object.keys(currentRequest.expected).length !== 0) {

                pm.collectionVariables.set('expected', currentRequest.expected);
                console.log("expected: "+JSON.stringify(pm.collectionVariables.get('expected')));
            } else {
                //could add a bit more syntax checking here to stop duff data. For now, if the expected object is 
                //empty then log an error
                console.error("The 'expected' object is being used but it has no properties");
            }
        }

        // Check for the changes object.
        // Allows any variable: local, collection, environment to be changed to the value of another local, collection, environment variable
        // If the variable to be changed does not exist, then it will be created
        // If the variable containing the change does not exist then no change is made
        // Supports single or multiple changes by the changes object
        // "changes" : { "ToVariable": "FromVariable", "ToVariable2":"FromVariable2"}
        // "scope": "local","collection","environment"
        // NOTE: This is a JSON object and not an array of objects so Keys must be unique. 
        //       You cannot use the same Variable key more than once in the object 
        if(Object.keys(currentRequest).some(key => key === 'changes')) {
            if(Object.keys(currentRequest.changes).length !== 0) {
                pm.collectionVariables.set('changes', currentRequest.changes);
                console.log("changes: "+JSON.stringify(pm.collectionVariables.get('changes')));

                if(Object.keys(currentRequest).some(key => key === 'scope')) {
                    if(Object.keys(currentRequest.scope).length !== 0) {
                        pm.collectionVariables.set('scope', currentRequest.scope);
                    } else {
                        pm.collectionVariables.set('scope', 'collection');
                    }
                } else {
                    pm.collectionVariables.set('scope', 'collection');
                };

            } else {
                //could add a bit more syntax checking here to stop duff data. For now, if the expected object is 
                //empty then log an error
                console.error("The 'changes' object is being used but it has no properties");
            }
        }

        // The keyword 'expRespCode' will allow for exception testing. The requests will default to checking for
        // 200 OK, but you can override to any exception response code you are testing for.
        // ## TO DO ## would be good to also have a 'expRespString' that you can send in the test to confirm expected
        // error Response String. 
        // NOTE: These are being set to local variables because they will be specific to an iteration. The request will be 
        // expected to clear the variables after the test logic to make sure these values will not persist to other requests.
        if(Object.keys(currentRequest).some(key => key === 'expRespCode')) {
            if(typeof currentRequest.expRespCode === 'number') {
                pm.variables.set('expRespCode', currentRequest.expRespCode);
                console.log(currentRequest.expRespCode);
            } else {
                console.error("KEYWORD ERROR: expRespCode MUST be a number HTTP response code e.g. 200 or 400.\nYou've put a "+typeof(currentRequest.expRespCode)+" with value "+currentRequest.expRespCode);
            }
        }

        // The keyword 'expRespString' will allow for exception testing. 
        // You can specify a string to be contained in the json response body. The request will use the string specified in the test.
        if(Object.keys(currentRequest).some(key => key === 'expRespString')) {
            if(typeof currentRequest.expRespString === 'string') {
                pm.variables.set('expRespString', currentRequest.expRespString);
                console.log(currentRequest.expRespString);
            } else {
                console.error("KEYWORD ERROR: expRespString MUST be a string\nYou've put a "+typeof(currentRequest.expRespString)+" with value "+currentRequest.expRespString);
            }
        }

        // If data found for current request
        if(Object.keys(currentRequest).some(key => key === 'data'))
        {
            //console.log("This request has a data property");
            pm.collectionVariables.set('dataIsPresent', true);
        }
        else {
            //console.log("This request does not have a data property");
            pm.collectionVariables.set('dataIsPresent', false);
        }

        if(Object.keys(currentRequest).some(key => key === 'data')){

            // Expose variables to collection as well as local
            // ** TODO ** 
            // I think it is good to expose variables to collection as it supports stopping and manually continuing. However, this comes with many 
            // considerations. The code here is where you can make decisions on how to store variables etc. 
            //
            // ** TODO ** WARNING Typcially the data object will be a single iteration. If it is not, then things will need to be refactored
            // The Shift here is to remove the zeroth index and shift down.
            if(Object.keys(currentRequest.data).length !== 0)
            {
                //console.log("currentRequest.data is available to process");
                const variables = currentRequest.data.shift();

                // Check if we are going to create a payload object from the data object
                // The idea is to construct a from ground up JSON payload object so that it is possible 
                // to send any number of attributes in the request.body. This will allow for API test techniques
                // which are not currently available in the DEV collections.
                if(Object.keys(currentRequest).some(key => key === 'usePayload')){    
                    // Loop through each data key and if value is 'useCurrent' then will set that to the existing 
                    // collection key value, otherwise take the key, values as they are from the test file.  
                    // The 'useCurrent' will allow the tests to pick up existing IDs or just to use existing
                    // variables which have been previously set to the collection vars. The substitutions for useCurrent is being performed
                    // in the pre-request script and not here becuase individual requests may have special cases.     
                    var payloadObj = {};
                    Object.entries(variables).forEach(([key, value]) => {
                        payloadObj[key] = value;
                    });
                
                    pm.collectionVariables.set('payload', payloadObj);
                    console.log("payload created in the runner is "+JSON.stringify(pm.collectionVariables.get('payload')));
                    console.log("payload type is: "+ typeof(pm.collectionVariables.get('payload')));
                }

                
                // This is currently just pulling out the data into variables for use within the request which will be called.
                // By default key values will be pulled from the test file and updated into both local and collection variables
                // keyword  "scope": "local"  will mean a variable will only be set for the local scope and persists only for 
                // this iteration. This is useful for setting expected values which would be set in Check/Verify steps
                // It is recommended that Create/Put requests set collection variables if the user is running from UI and they 
                // want to be able to stop and continue a test from a stopped run.  
                // If the test is to be run from automation, then the scope should always be local unless you want variables to persist 
                // between iterations.  

                Object.entries(variables).forEach(([key, value]) => {
                    if(Object.keys(currentRequest).some(key => key === 'scope')){
                        // set local Only variables 
                        console.log("scope "+currentRequest.scope+" key: "+key+" value: "+value);
                        if(currentRequest.scope === 'local') {
                                pm.variables.set(key, value);           
                        } else if(currentRequest.scope === 'collection') {
                                pm.collectionVariables.set(key, value);
                        } else {
                            console.log("ERROR:#### The keyword 'scope' value is not valid. Expected to be 'local' or 'collection' ####");
                            // TODO: We should be exiting at this point as there is a syntax error in the test file
                        }    
                    } else {
                        // Default behavior is to set variables to both local and collection scope. 
                        //console.log("setting variable "+ key + " value "+ value +" as both");
                        //console.log("No 'scope' has been set. Variables set to local and collection: key: "+key+" value: "+value);
                        pm.variables.set(key, value);
                        pm.collectionVariables.set(key, value);
                    }
                });

                // This is going to update the collection requestData object with the shifted out current request data ready for the next iteration/step
                pm.variables.set('requestData', requestData);
            }
            else {
                console.log("currentRequest.data is empty");
            }

            // Declare next iteration of this same request
            // Remember.....this is where we are setting the request AFTER this request. We haven't run the current request yet (this is a pre request script).
            if(currentRequest.data.length > 0){
                console.log("4a. step data still present for another iteration of this request")
            } else {
                console.log("4b. step data exhausted after this request iteration")
                pm.collectionVariables.set('dataIsPresent', false);
            }

            pm.collectionVariables.set('hasCurrentRun', true);
            pm.collectionVariables.set('NextRequest', currentRequest.name);
            pm.execution.setNextRequest(currentRequest.name);
        }
        else
        {
            // Get here means the step does not have a data property. Same as 4b from this point
            console.log("4c. step data is not present. Run this request once only")
            pm.collectionVariables.set('hasCurrentRun', true);
            pm.collectionVariables.set('dataIsPresent', false);
            pm.collectionVariables.set('NextRequest', currentRequest.name);
            pm.execution.setNextRequest(currentRequest.name);

            //Checking if we need to getVars
            if(Object.keys(currentRequest).some(key => key === 'getVars')) {
                if( currentRequest.getVars === true ) {
                    console.info("Output of Collection Variables");
                    engine.getVars("collection");
                    console.info("Output of Environment Variables");
                    console.info("clients: "+JSON.stringify(pm.environment.get('clients')));
                    console.info("Tester: "+pm.environment.get('Tester'));
                } else if( currentRequest.getVars === "environment") {
                    console.info("Output of Environment Variables");
                    console.info("clients: "+JSON.stringify(pm.environment.get('clients')));
                    console.info("Tester: "+pm.environment.get('Tester'));
                } else if( currentRequest.getVars === "collection") {
                    console.info("Output of Collection Variables");
                    engine.getVars("collection");
                } else {
                    console.info("KEYWORD ERROR. getVars can be : true (for both collection and environment), \"collection\", or \"environment\"");
                }
            }
            
        }	
    }
}
else
{
    console.log("This request [" + pm.info.requestName +"] is being run manually outside of the collection runner");
}
