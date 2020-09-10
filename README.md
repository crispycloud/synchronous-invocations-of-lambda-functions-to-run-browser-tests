# Synchronous Invocations of Lambda functions to run browser tests

This project is inspired by [Wix testing architecture](https://www.youtube.com/watch?v=hbz63Ve-eIY)

## Prerequisite knowledge
- AWS S3
- AWS Lambda
- ZombieJS
- Mocha
- AWS CDK
- AWS SDK
- Node
- Typescript

## Background

In large-scale UI testing, it could take several hours to run the whole browser test suites, especially in the case of limited IT resources. One possible solution to this to synchronously invoke multiple serverless Lambda functions to run all the tests at once

## Workflow

1. An x number of Mocha tests are compressed and uploaded to S3
2. An x number of Lambda functions are synchronously invocated to run each Jest test
3. Should the tests fail, the error messages will be downloaded locally to the developer's local environment

## Challenges

According to the [Lambda Documentation](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html), the maximum deployment package size is `250MB`. We must find a testing framework and headless browser API such that their combined size is less than `250MB`. That being said, in the case where our dependencies get bigger than `250MB`, if it's less than `512MB`, we can load our dependencies on `S3` along with the tests and fetch dependencies at runtime and store them in `/tmp/` folder.

In our case, since we choose [ZombieJS](http://zombie.js.org/) as our browser API and [Mocha](https://mochajs.org/) as our test framework and their combined uncompressed size is `29.7MB`. We can easily include them in the deployment package

## What I will do

1. Create a set of tests and put it under `test` folder. For demo purposes, 5 tests wil run successfully and 1 will fail
2. Create a CDK Deployment of the stack under `lib`.
3. Create a Node script and synchronously invoked Lambda functions to run all of the tests on S3 `synchronous-invocations.js`

## Results

Our tests when run locally

```
> synchronous-lambda-invocations-to-run-browser-tests@0.1.0 test /home/chrisphan/aws-playbooks/synchronous-lambda-invocations-to-run-tests
> mocha



  ✓ Title Test (5569ms)
  ✓ Title Test (5251ms)
  ✓ Title Test (5220ms)
  ✓ Title Test (5263ms)
  ✓ Title Test (5248ms)

  5 passing (27s)
```

Our tests when run on Lambda functions synchronously
```
chrisphan@chrisphan-HP-ENVY-x360-Convertible:~/aws-playbooks/synchronous-lambda-invocations-to-run-tests$ node synchronous-invocations.js 
Invoked Lambda function running test:  test-1.test.js
Invoked Lambda function running test:  test-2.test.js
Invoked Lambda function running test:  test-3.test.js
Invoked Lambda function running test:  test-4.test.js
Invoked Lambda function running test:  test-5.test.js
Invoked Lambda function running test:  test-6.test.js
6 tests were run
1 errors, 5 successes
The logs of unsuccessful tests could be found under ./log folder
All tests took 7074 seconds

```

Despite the fact that tests we made for this example is really simplistic, our test-running time decreases by 400%. You can imagine the substantial effects it would have on a more scalable system

## How to replicate this

1. Clone this repository
2. `npm install`
3. Install [CDK](https://docs.aws.amazon.com/cdk/latest/guide/cli.html)
4. Set up your [AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
5. `cdk bootstrap && cdk deploy`
6. `node synchronous-invocations.js`

## Future Improvements

Add SNS and SES to send emails to developer when a test fails.

![Architecture Diagram](/docs/images/architecture.png)