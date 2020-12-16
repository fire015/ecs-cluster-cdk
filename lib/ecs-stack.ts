import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import * as ecr from "@aws-cdk/aws-ecr";
import * as s3 from "@aws-cdk/aws-s3";
import * as iam from "@aws-cdk/aws-iam";
import config from "./config";

interface MultistackProps extends cdk.StackProps {
  ecrRepository: ecr.Repository;
}

export class EcsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: MultistackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, config.vpc.name, { maxAzs: 2 });

    const repository = ecr.Repository.fromRepositoryName(props.ecrRepository, props.ecrRepository.node.id, config.ecr.repositoryName);

    const bucket = new s3.Bucket(this, config.s3.bucketName, {
      bucketName: config.s3.bucketName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const cluster = new ecs.Cluster(this, config.ecs.clusterName, {
      vpc: vpc,
      clusterName: config.ecs.clusterName,
    });

    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, config.ecs.serviceName, {
      cluster: cluster,
      serviceName: config.ecs.serviceName,
      cpu: 256,
      memoryLimitMiB: 512,
      desiredCount: 2,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(repository, "latest"),
        environment: {
          BUCKET_NAME: bucket.bucketName,
        },
      },
      publicLoadBalancer: true,
      assignPublicIp: false,
    });

    const scaling = fargateService.service.autoScaleTaskCount({ maxCapacity: 4 });
    scaling.scaleOnCpuUtilization("CpuScaling", {
      targetUtilizationPercent: 50,
    });

    fargateService.taskDefinition.addToTaskRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:PutObject"],
        resources: [bucket.bucketArn + "/*"],
      })
    );
  }
}
