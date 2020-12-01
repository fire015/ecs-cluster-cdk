import * as fs from "fs";
import { execSync } from "child_process";

const run = (outputsFile: string) => {
  if (!fs.existsSync(outputsFile)) {
    console.error("File does not exist:", outputsFile);
    return;
  }

  const data = JSON.parse(fs.readFileSync(outputsFile).toString());
  const repositoryUri = data.EcrRepositoryStack.RepositoryUri as string;
  const repositoryBase = repositoryUri.split("/")[0] as string;

  console.log(
    execSync(`aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${repositoryBase}`).toString()
  );

  console.log(execSync(`docker tag node-server:latest ${repositoryUri}:latest`).toString());
  console.log(execSync(`docker push ${repositoryUri}:latest`).toString());
};

run(__dirname + "/../outputs.json");
