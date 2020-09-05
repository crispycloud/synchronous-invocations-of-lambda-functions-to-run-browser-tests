import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as SynchronousLambdaInvocationsToRunBrowserTests from '../lib/synchronous-lambda-invocations-to-run-browser-tests-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new SynchronousLambdaInvocationsToRunBrowserTests.SynchronousLambdaInvocationsToRunBrowserTestsStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
