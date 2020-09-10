const AWS = require('aws-sdk');
const fs = require('fs-extra');
const lambda = new AWS.Lambda({
    region: 'us-east-1'
});
const logPath = './log';
const tests = fs.readdirSync('test');
const testCount = tests.length;
var testRan = 0;
var errors = 0;
var successes = 0;
const timeBefore = new Date();

const createLog = (testFile, error) => {
    fs.writeFileSync(`${logPath}/${testFile}`,error);
} 

fs.emptyDirSync(logPath); //Clear log folder
tests.forEach(test => {
    console.log("Invoked Lambda function running test: ",test)
    lambda.invoke({
        FunctionName: 'crispycloud-synchrous-lambda-invocations',   
        Payload: `{ "test": "${test}" }`
    }, (err,data) => {
        if(err)  { 
            console.error(err);
            return;
        }
        const res = JSON.parse(data.Payload);

        if(res.err) {
            createLog(test,data.Payload);
            errors += 1;
        } else { 
            successes += 1;
        }

        testRan += 1;
        if(testRan == testCount) {
            const timeNow = new Date();
            const timeDelta = timeNow - timeBefore;
            console.info(`${testRan} tests were run`);
            console.info(`${errors} errors, ${successes} successes`);
            console.info(`The logs of unsuccessful tests could be found under ${logPath} folder`);
            console.info(`All tests took ${timeDelta} seconds`);
        }
    })
})




