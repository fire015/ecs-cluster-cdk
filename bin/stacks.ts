#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { EcrRepositoryStack } from "../lib/ecr-repository";
import { EcsStack } from "../lib/ecs-stack";

const app = new cdk.App();

const repository = new EcrRepositoryStack(app, "EcrRepositoryStack");

new EcsStack(app, "EcsStack", {
  ecrRepositoryStack: repository,
});
