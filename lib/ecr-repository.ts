import * as cdk from "@aws-cdk/core";
import * as ecr from "@aws-cdk/aws-ecr";
import config from "./config";

export class EcrRepositoryStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ecr.Repository(this, config.ecr.repositoryName, {
      repositoryName: config.ecr.repositoryName,
    });
  }
}
