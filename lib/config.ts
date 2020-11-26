export default {
  vpc: {
    name: "ecsVPC",
  },
  ecs: {
    clusterName: "prod",
    serviceName: "web",
  },
  ecr: {
    repositoryName: "node-server",
  },
  s3: {
    bucketName: "jason-ecs-testing"
  }
};
