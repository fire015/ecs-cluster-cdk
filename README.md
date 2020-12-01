This project uses the AWS CDK to spin up a load balanced ECS/Fargate cluster and assign IAM roles.

# Deployment

Run `aws configure` to setup access and secret keys for the account.

Run `npm run deploy:ecr` to create the ECR Docker repository.

Build the Docker image inside `./src` and then run `npm run push:ecr` to push to ECR.

Run `npm run deploy:ecs` to create the ECS cluster and run the Docker image.

Visit the EC2 load balancer URL in your browser (webServiceURL in the output).

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `cdk deploy [STACK_NAME]`      deploy this stack to your default AWS account/region
 * `cdk diff [STACK_NAME]`        compare deployed stack with current state
 * `cdk synth [STACK_NAME]`       emits the synthesized CloudFormation template
 * `cdk destroy [STACK_NAME]`       destroy the stack