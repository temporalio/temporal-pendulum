import { WorkflowHandle } from '@temporalio/client';
import { WorkflowCoverage } from '@temporalio/nyc-test-coverage';
import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker, Runtime, DefaultLogger, LogEntry, WorkflowBundleWithSourceMap, bundleWorkflowCode } from '@temporalio/worker';
import { exitSignal, GameInfo, getGameInfoQuery, pendulum, updateGameInfoSignal } from './workflows';
import { v4 as uuid4 } from 'uuid';

let handle: WorkflowHandle;
let testEnv: TestWorkflowEnvironment;
let runPromise: Promise<void>;
let worker: Worker;
let workflowBundle: WorkflowBundleWithSourceMap;

// Use console.log instead of console.error to avoid red output
// Filter INFO log messages for clearer test output
const logger = new DefaultLogger('WARN', (entry: LogEntry) => console.log(`[${entry.level}]`, entry.message));
const taskQueue = 'test';

const workflowCoverage = new WorkflowCoverage();

const gameInfo: GameInfo = Object.freeze({
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
});

const initInfo = { ...gameInfo, anchorX: 1 };

beforeAll(async () => {
  Runtime.install({
    logger,
  });

  testEnv = await TestWorkflowEnvironment.createTimeSkipping();

  workflowBundle = await bundleWorkflowCode({
    workflowsPath: require.resolve('./workflows'),
    logger,
  });
});

beforeEach(async () => {
  const { client, nativeConnection } = testEnv;
  worker = await Worker.create(
    workflowCoverage.augmentWorkerOptionsWithBundle({
      connection: nativeConnection,
      taskQueue,
      workflowBundle,
    })
  );

  runPromise = worker.run();
  handle = await client.workflow.start(pendulum, {
    args: [initInfo],
    workflowId: uuid4(),
    taskQueue,
  });
});

afterEach(async() => {
  const { status } = await handle.describe();
  if (status.name === 'COMPLETED') {
    worker.shutdown();
    await runPromise;

    // Terminating a completed Workflow causes an error
    return;
  }

  // If test didn't clean up Workflow, terminate it here
  await handle.terminate();

  worker.shutdown();
  await runPromise;
});

afterAll(async () => {
  await testEnv?.teardown();
});

afterAll(() => {
  workflowCoverage.mergeIntoGlobalCoverage();
});

test('pendulum exitSignal', async () => {
  await handle.signal(exitSignal);
  await handle.result();
});

test('pendulum getGameInfoQuery', async () => {
  const queryResult = await handle.query(getGameInfoQuery);
  expect(queryResult).toEqual(initInfo);
});

test('pendulum updateGameInfoSignal', async () => {
  const update = { ...gameInfo, anchorY: 1 };
  await handle.signal(updateGameInfoSignal, update);
  const queryResult = await handle.query(getGameInfoQuery);
  expect(queryResult).toEqual(update);
});
