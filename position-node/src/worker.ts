import { Worker } from '@temporalio/worker';

async function run() {
  const worker = await Worker.create({
    workDir: __dirname,
    activities: undefined,
    taskQueue: 'PendulumNode'
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
