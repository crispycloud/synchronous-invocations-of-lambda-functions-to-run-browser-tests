# Synchronous Invocations of Lambda functions to run browser tests

## Background

In large-scale UI testing, it could take several hours to run the whole browser test suites, especially in the case of limited IT resources. One possible solution to this to synchronously invoke multiple serverless Lambda functions to run all the tests at once

## Architecture Diagram

![Architecture Diagram](/docs/images/architecture.png)

## Workflow

1. An x number of Mocha tests are compressed and uploaded to S3
2. An x number of Lambda functions are synchronously invocated to run each Jest test
3. Should the tests fail, the developer will receive an email regarding the logs. If else, the logs could be viewed on CloudWatch

## Challenges

According to the [Lambda Documentation](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html), the maximum deployment package size is `250MB`. We must find a testing framework and headless browser API such that their combined size is less than `250MB`. That being said, in the case where our dependencies get bigger than `250MB`, if it's less than `512MB`, we can load our dependencies on `S3` along with the tests and fetch dependencies at runtime and store them in `/tmp/` folder.

In our case, since we choose [ZombieJS](http://zombie.js.org/) as our browser API and [Mocha](https://mochajs.org/) as our test framework and their combined uncompressed size is `29.7MB`. We can easily include them in the deployment package

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
INVOKING LAMBDA TEST FOR  test-1.test.js
INVOKING LAMBDA TEST FOR  test-2.test.js
INVOKING LAMBDA TEST FOR  test-3.test.js
INVOKING LAMBDA TEST FOR  test-4.test.js
INVOKING LAMBDA TEST FOR  test-5.test.js
SUCCESSFULLY RUN TEST FOR test-4.test.js
SUCCESSFULLY RUN TEST FOR test-5.test.js
SUCCESSFULLY RUN TEST FOR test-3.test.js
SUCCESSFULLY RUN TEST FOR test-2.test.js
SUCCESSFULLY RUN TEST FOR test-1.test.js
The tests took 7047 seconds
```

Despite the fact that tests we made for this example is really simplistic, our test-running time decreases by 300%. You can imagine the substantial effects it would have a more scalable system

## Future Improvements

Add SNS and SES to send emails to developer when a test fails