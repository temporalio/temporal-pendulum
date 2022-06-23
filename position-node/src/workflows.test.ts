import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker, Runtime, DefaultLogger, LogEntry } from '@temporalio/worker';
import { exitSignal, pendulum } from './workflows';
import { v4 as uuid4 } from 'uuid';

async function withWorker<R>(worker: Worker, fn: () => Promise<R>): Promise<R> {
  const runAndShutdown = async () => {
    try {
      return await fn();
    } finally {
      worker.shutdown();
    }
  };
  const [_, ret] = await Promise.all([worker.run(), runAndShutdown()]);
  return ret;
}

let testEnv: TestWorkflowEnvironment;

beforeAll(async () => {
  // Use console.log instead of console.error to avoid red output
  // Filter INFO log messages for clearer test output
  Runtime.install({
    logger: new DefaultLogger('WARN', (entry: LogEntry) => console.log(`[${entry.level}]`, entry.message)),
  });

  testEnv = await TestWorkflowEnvironment.create({
    testServer: {
      stdio: 'inherit',
    },
  });
});

afterAll(async () => {
  await testEnv?.teardown();
});

test('pendulum exits', async () => {
  const { workflowClient, nativeConnection } = testEnv;
  const worker = await Worker.create({
    connection: nativeConnection,
    taskQueue: 'test',
    workflowsPath: require.resolve('./workflows'),
    activities: undefined,
  });
  await withWorker(worker, async () => {
    const handle = await workflowClient.start(pendulum, {
      args: [{
        anchorX: 0,
        anchorY: 0,
        ballX: 0,
        ballY: 0,
        length: 0,
        width: 0,
        height: 0,
        angle: 0,
        angleAccel: 0,
        angleVelocity: 0,
        dt: 0,
        speed: 0,          
      }],
      workflowId: uuid4(),
      taskQueue: 'test',
    });
    await handle.signal(exitSignal)
    const result = await handle.result()
    expect(result).toBeUndefined;
  });
});
