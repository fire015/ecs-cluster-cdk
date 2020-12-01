import * as cdk from "@aws-cdk/core";
import * as ecr from "@aws-cdk/aws-ecr";
import config from "./config";

export class EcrRepositoryStack extends cdk.Stack {
  public readonly ecrRepository: ecr.Repository;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.ecrRepository = new ecr.Repository(this, config.ecr.repositoryName, {
      repositoryName: config.ecr.repositoryName,
    });

    new cdk.CfnOutput(this, "RepositoryUri", { value: this.ecrRepository.repositoryUri });
  }
}
