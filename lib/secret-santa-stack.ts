import * as cdk from '@aws-cdk/core';
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { Secret } from '@aws-cdk/aws-secretsmanager';


export class SecretSantaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const secret = new Secret(this, 'Auth', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ accountID: 'id', secretID: 'secret', secretPassword: 'secretPassword' }),
        generateStringKey: 'auth',
      },
    });

    const secretSanta = new Function(this, 'SecretSantaHandler', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset('lambda'),
      handler: 'secret-santa.handler',
      timeout: cdk.Duration.seconds(15),
      environment: {
        auth: secret.secretValue.toString(),
      },
    });

    const api = new RestApi( this, 'SecretSantaApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowHeaders: [
          'Access-Control-Allow-Origin',
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'X-Amz-Security-Token',
          'X-Amz-User-Agent',
        ]
      },
    });
    api.root.addMethod('POST', new LambdaIntegration(secretSanta))
    secret.grantRead(secretSanta);
  }
}
