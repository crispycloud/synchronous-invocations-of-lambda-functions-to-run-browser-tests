const AWS = require('aws-sdk');
const fs = require('fs');
const exec = require('child_process').exec;
const s3 = new AWS.S3();

exports.handler =  (event, context, cb) => {
    console.log(`RUNNING TEST ${event.test}`)
    s3.getObject({
        Bucket: 'crispycloud-synchronous-lambda-invocations-bucket',
        Key: event.test
    },(err,testFile) => {
        if(err)  { 
            cb(err);
        }
        fs.writeFile('/tmp/test.js',testFile.Body,(err,data) => {
            if(err)  { 
                cb(err);
            }
            exec('./node_modules/mocha/bin/mocha /tmp/test.js', (error, stdout, stderr) => {
                if(err)  { 
                    cb(err);
                }
                cb();
              });
        })
    })
}
