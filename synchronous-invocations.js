const AWS = require('aws-sdk');
const fs = require('fs');
const lambda = new AWS.Lambda({
    region: 'us-east-1'
});
const tests = fs.readdirSync('test');
const testCount = tests.length;
var testRan = 0;
const timeBefore = new Date();

tests.forEach(test => {
    console.log("INVOKING LAMBDA TEST FOR ",test)
    lambda.invoke({
        FunctionName: 'crispycloud-synchrous-lambda-invocations',   
        Payload: `{ "test": "${test}" }`
    }, function(err,data) {
        if(err)  { 
            console.log(err, err.stack);
            return;
        }
        console.log("SUCCESSFULLY RUN TEST FOR", test)
        testRan += 1;
        if(testRan == testCount) {
            const timeNow = new Date();
            const timeDelta = timeNow - timeBefore;
            console.log(`The tests took ${timeDelta} seconds`);
        }
    })
})




