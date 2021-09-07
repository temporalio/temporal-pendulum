import { Worker } from '@temporalio/worker';

async function run() {
  const worker = await Worker.create({
    // FIXME: workDir with undefined activities is not working
    workflowsPath: `${__dirname}/workflows`,
    nodeModulesPath: `${__dirname}/../node_modules`,
    taskQueue: 'PendulumNode'
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
