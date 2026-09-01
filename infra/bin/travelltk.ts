#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { TravelLtkStack } from "../lib/travelltk-stack";

const app = new cdk.App();
new TravelLtkStack(app, "TravelLtkStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? "us-east-1",
  },
  description: "TravelLTK backend: Cognito, DynamoDB, HTTP API, media.",
});
