This project uses the AWS CDK to spin up a load balanced ECS cluster and assign them IAM roles to push to S3.

# Deployment

Run `aws configure` to setup access and secret keys for the account.

Run `npm run deploy:ecr` to create the Docker repository.

Visit the [ECR](https://us-east-1.console.aws.amazon.com/ecr/repositories?region=us-east-1) dashboard and click "View push commands" inside the repository to push the Docker image (build inside `./src`).

Run `npm run deploy:ecs` to create the ECS cluster and run the Docker image.

Visit the EC2 load balancer URL in your browser.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `cdk deploy [STACK_NAME]`      deploy this stack to your default AWS account/region
 * `cdk diff [STACK_NAME]`        compare deployed stack with current state
 * `cdk synth [STACK_NAME]`       emits the synthesized CloudFormation template
 * `cdk destroy [STACK_NAME]`       destroy the stack