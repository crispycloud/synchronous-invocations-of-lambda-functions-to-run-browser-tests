const AWS = require('aws-sdk');
const fs = require('fs').promises;
const exec = require('child_process').exec;
const { promisify } = require('util');
const promisifiedExec = promisify(exec);
const s3 = new AWS.S3();

const testFilePath = '/tmp/test.js';

const downloadAndWriteFileFromS3 = async fileName => {
    const s3Params = {
        Bucket: 'crispycloud-synchronous-lambda-invocations-bucket',
        Key: fileName
    }
    const testFile = await s3.getObject(s3Params).promise()
    await fs.writeFile(testFilePath, testFile.Body);
}

exports.handler = async (event,context) => {
    console.info(`Running test: ${event.test}`)
    try {
        await downloadAndWriteFileFromS3(event.test)
        const res = await promisifiedExec(`./node_modules/mocha/bin/mocha ${testFilePath}`); // run mocha tests
        console.info(res);
        if(res.stderr === "") {
            return { data: res }
        } else {
            return { err: res.stderr }
        }
    } catch(err) {
        return { err }
    }
}
