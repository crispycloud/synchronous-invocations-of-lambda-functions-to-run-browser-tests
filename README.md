# Synchronous Invocations of Lambda functions to run tests

## Background

In large-scale testing, it could take several hours to run the whole test suites, especially in the case of limited IT resources. One possible solution to this to synchronously invocate multiple serverless lambda functions to run all the tests at once

## Architecture Diagram

![Architecture Diagram](/docs/images/architecture.png)