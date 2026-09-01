import * as path from "node:path";
import * as cdk from "aws-cdk-lib";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as authorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class TravelLtkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const googleClientId = this.node.tryGetContext("googleClientId") as string;
    const googleClientSecret = this.node.tryGetContext("googleClientSecret") as string;
    const cognitoDomainPrefix =
      (this.node.tryGetContext("cognitoDomainPrefix") as string) ||
      `travelltk-${this.account}`;
    const callbackUrls = String(
      this.node.tryGetContext("callbackUrls") ||
        "http://localhost:3000/api/auth/callback/cognito",
    ).split(",");
    const logoutUrls = String(
      this.node.tryGetContext("logoutUrls") || "http://localhost:3000/",
    ).split(",");

    /**
     * Single-table DynamoDB keys:
     *   USER#{cognitoSub} / PROFILE
     *   TRIP#{id} / METADATA | LEG#{day}#{legId} | REVIEW#{id}
     *   BOOKING#{id} / METADATA
     *   PAYOUT#{id} / METADATA
     *   APPLICATION#{id} / METADATA
     * GSI1: STATUS#published, CREATOR#{id}, HANDLE#{handle}, EMAIL#{email},
     *       USER#{id}+BOOKING#, CREATOR#{id}+PAYOUT#, APPLICATIONS+DATE#
     */
      tableName: "TravelLtk",
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    table.addGlobalSecondaryIndex({
      indexName: "gsi1",
      partitionKey: { name: "gsi1pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "gsi1sk", type: dynamodb.AttributeType.STRING },
    });

    const userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: "travelltk-users",
      selfSignUpEnabled: false,
      signInAliases: { email: true },
      standardAttributes: {
        email: { required: true, mutable: true },
        fullname: { required: false, mutable: true },
        profilePicture: { required: false, mutable: true },
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    if (googleClientId && googleClientSecret) {
      const google = new cognito.UserPoolIdentityProviderGoogle(this, "GoogleIdp", {
        userPool,
        clientId: googleClientId,
        clientSecretValue: cdk.SecretValue.unsafePlainText(googleClientSecret),
        scopes: ["openid", "email", "profile"],
        attributeMapping: {
          email: cognito.ProviderAttribute.GOOGLE_EMAIL,
          fullname: cognito.ProviderAttribute.GOOGLE_NAME,
          profilePicture: cognito.ProviderAttribute.GOOGLE_PICTURE,
        },
      });
      userPool.registerIdentityProvider(google);
    } else {
      cdk.Annotations.of(this).addWarning(
        "googleClientId / googleClientSecret CDK context is empty. Deploy with -c googleClientId=... -c googleClientSecret=... to attach Google as a federated IdP.",
      );
    }

    const client = userPool.addClient("WebClient", {
      userPoolClientName: "travelltk-web",
      generateSecret: true,
      oAuth: {
        flows: { authorizationCodeGrant: true },
        scopes: [
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls,
        logoutUrls,
      },
      supportedIdentityProviders: googleClientId
        ? [
            cognito.UserPoolClientIdentityProvider.COGNITO,
            cognito.UserPoolClientIdentityProvider.GOOGLE,
          ]
        : [cognito.UserPoolClientIdentityProvider.COGNITO],
      preventUserExistenceErrors: true,
    });

    const domain = userPool.addDomain("HostedUi", {
      cognitoDomain: { domainPrefix: cognitoDomainPrefix },
    });

    const mediaBucket = new s3.Bucket(this, "MediaBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const distribution = new cloudfront.Distribution(this, "MediaCdn", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(mediaBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
    });

    const issuer = `https://cognito-idp.${this.region}.amazonaws.com/${userPool.userPoolId}`;
    const jwtAuthorizer = new authorizers.HttpJwtAuthorizer("JwtAuth", issuer, {
      jwtAudience: [client.userPoolClientId],
    });

    const httpApi = new apigwv2.HttpApi(this, "HttpApi", {
      apiName: "travelltk-api",
      corsPreflight: {
        allowHeaders: ["Authorization", "Content-Type"],
        allowMethods: [
          apigwv2.CorsHttpMethod.GET,
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.PUT,
          apigwv2.CorsHttpMethod.PATCH,
          apigwv2.CorsHttpMethod.DELETE,
          apigwv2.CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: ["http://localhost:3000", "https://travelltk.com"],
      },
    });

    const fn = (name: string, entry: string, leadingKeys: string[]) => {
      const lambdaFn = new NodejsFunction(this, name, {
        entry: path.join(__dirname, "..", "lambda", entry),
        handler: "handler",
        runtime: lambda.Runtime.NODEJS_20_X,
        timeout: cdk.Duration.seconds(15),
        memorySize: 256,
        environment: {
          TABLE_NAME: table.tableName,
        },
        bundling: { minify: true, sourceMap: true },
      });
      lambdaFn.addToRolePolicy(
        new iam.PolicyStatement({
          actions: [
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
            "dynamodb:Query",
            "dynamodb:BatchGetItem",
          ],
          resources: [table.tableArn, `${table.tableArn}/index/*`],
          conditions: {
            "ForAllValues:StringLike": { "dynamodb:LeadingKeys": leadingKeys },
          },
        }),
      );
      return lambdaFn;
    };

    const usersFn = fn("UsersFn", "users/handler.ts", ["USER#*", "EMAIL#*"]);
    const tripsFn = fn("TripsFn", "trips/handler.ts", [
      "TRIP#*",
      "CREATOR#*",
      "HANDLE#*",
      "STATUS#*",
      "CATEGORY#*",
      "DEST#*",
    ]);
    const bookingsFn = fn("BookingsFn", "bookings/handler.ts", ["BOOKING#*", "USER#*"]);
    const payoutsFn = fn("PayoutsFn", "payouts/handler.ts", ["PAYOUT#*", "CREATOR#*"]);
    const applicationsFn = fn("ApplicationsFn", "applications/handler.ts", [
      "APPLICATION#*",
      "APPLICATIONS",
    ]);
    const reviewsFn = fn("ReviewsFn", "reviews/handler.ts", ["TRIP#*"]);

    const add = (
      routePath: string,
      method: apigwv2.HttpMethod,
      target: lambda.IFunction,
      auth: boolean,
    ) => {
      httpApi.addRoutes({
        path: routePath,
        methods: [method],
        integration: new integrations.HttpLambdaIntegration(
          `${method}-${routePath.replaceAll(/\W+/g, "-")}`,
          target,
        ),
        authorizer: auth ? jwtAuthorizer : undefined,
      });
    };

    add("/users", apigwv2.HttpMethod.POST, usersFn, true);
    add("/users/{id}", apigwv2.HttpMethod.GET, usersFn, true);

    add("/trips", apigwv2.HttpMethod.GET, tripsFn, false);
    add("/trips", apigwv2.HttpMethod.POST, tripsFn, true);
    add("/trips/{id}", apigwv2.HttpMethod.GET, tripsFn, false);
    add("/trips/{id}", apigwv2.HttpMethod.PUT, tripsFn, true);
    add("/trips/{id}", apigwv2.HttpMethod.DELETE, tripsFn, true);
    add("/creators/{handle}", apigwv2.HttpMethod.GET, tripsFn, false);

    add("/bookings", apigwv2.HttpMethod.GET, bookingsFn, true);
    add("/bookings", apigwv2.HttpMethod.POST, bookingsFn, true);
    add("/bookings/{id}", apigwv2.HttpMethod.PATCH, bookingsFn, true);

    add("/payouts", apigwv2.HttpMethod.GET, payoutsFn, true);
    add("/payouts", apigwv2.HttpMethod.POST, payoutsFn, true);

    add("/applications", apigwv2.HttpMethod.POST, applicationsFn, false);
    add("/applications", apigwv2.HttpMethod.GET, applicationsFn, true);

    add("/reviews", apigwv2.HttpMethod.GET, reviewsFn, false);
    add("/reviews", apigwv2.HttpMethod.POST, reviewsFn, true);

    new cdk.CfnOutput(this, "ApiUrl", { value: httpApi.apiEndpoint });
    new cdk.CfnOutput(this, "UserPoolId", { value: userPool.userPoolId });
    new cdk.CfnOutput(this, "UserPoolClientId", { value: client.userPoolClientId });
    new cdk.CfnOutput(this, "CognitoDomain", {
      value: `${domain.domainName}.auth.${this.region}.amazoncognito.com`,
    });
    new cdk.CfnOutput(this, "CognitoIssuer", { value: issuer });
    new cdk.CfnOutput(this, "MediaBucketName", { value: mediaBucket.bucketName });
    new cdk.CfnOutput(this, "MediaBaseUrl", {
      value: `https://${distribution.distributionDomainName}`,
    });
    new cdk.CfnOutput(this, "TableName", { value: table.tableName });
  }
}
