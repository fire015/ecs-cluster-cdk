import * as fs from "fs";
import { spawn } from "child_process";

const run = async (outputsFile: string) => {
  if (!fs.existsSync(outputsFile)) {
    console.error("File does not exist:", outputsFile);
    return;
  }

  const data = JSON.parse(fs.readFileSync(outputsFile).toString());
  const repositoryUri = data.EcrRepositoryStack.RepositoryUri as string;
  const repositoryBase = repositoryUri.split("/")[0] as string;

  try {
    await spawnCmd(`aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${repositoryBase}`);
    await spawnCmd(`docker tag node-server:latest ${repositoryUri}:latest`);
    await spawnCmd(`docker push ${repositoryUri}:latest`);
  } catch (err) {
    console.error(`Failed with code ${err}`);
  }
};

const spawnCmd = async (cmd: string) => {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, [], { stdio: "inherit", shell: true });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(code);
      }
    });
  });
};

run(__dirname + "/../outputs.json");
