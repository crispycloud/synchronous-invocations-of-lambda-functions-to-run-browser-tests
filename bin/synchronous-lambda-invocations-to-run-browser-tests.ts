#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SynchronousLambdaInvocationsToRunBrowserTestsStack } from '../lib/synchronous-lambda-invocations-to-run-browser-tests-stack';

const app = new cdk.App();
new SynchronousLambdaInvocationsToRunBrowserTestsStack(app, 'SynchronousLambdaInvocationsToRunBrowserTestsStack');
