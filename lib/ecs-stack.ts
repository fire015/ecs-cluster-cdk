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

    const bucket = new s3.Bucket(this, "StaticBucket", {
      bucketName: config.s3.bucketName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const cluster = new ecs.Cluster(this, "ECSCluster", {
      vpc: vpc,
      clusterName: config.ecs.clusterName,
    });

    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "ECSService", {
      cluster: cluster,
      serviceName: config.ecs.serviceName,
      cpu: 256,
      memoryLimitMiB: 512,
      desiredCount: 2,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(props.ecrRepository, "latest"),
        environment: {
          BUCKET_NAME: bucket.bucketName,
        },
      },
      publicLoadBalancer: true,
      assignPublicIp: false,
    });

    fargateService.taskDefinition.addToTaskRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:PutObject"],
        resources: [bucket.bucketArn + "/*"],
      })
    );

    const scalableTarget = fargateService.service.autoScaleTaskCount({
      minCapacity: 2,
      maxCapacity: 20,
    });

    scalableTarget.scaleOnCpuUtilization("CpuScaling", {
      targetUtilizationPercent: 50,
    });

    scalableTarget.scaleOnMemoryUtilization("MemoryScaling", {
      targetUtilizationPercent: 50,
    });
  }
}
