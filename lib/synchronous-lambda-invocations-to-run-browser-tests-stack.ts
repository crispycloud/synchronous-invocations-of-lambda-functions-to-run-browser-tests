import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import * as lambda from '@aws-cdk/aws-lambda';
import { LAMBDA_FUNCTION_NAME, S3_BUCKET_NAME } from '../consts';
import { Duration } from '@aws-cdk/core';

export class SynchronousLambdaInvocationsToRunBrowserTestsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const testBucket = new s3.Bucket(this,'TestBucket', {
        bucketName: S3_BUCKET_NAME
    });

    new s3Deployment.BucketDeployment(this,'TestBucketDeployment',{
        sources: [s3Deployment.Source.asset('./test')],
        destinationBucket: testBucket
    })

    const lambdaTestFunction = new lambda.Function(this,'LambdaTestFunc', {
        functionName: LAMBDA_FUNCTION_NAME,
        code: lambda.Code.fromAsset('./lambda'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_10_X,
        memorySize: 1536,
        timeout: Duration.minutes(2)
    })

    testBucket.grantRead(lambdaTestFunction);
  }
}
