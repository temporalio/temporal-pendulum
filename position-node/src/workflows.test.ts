import { WorkflowHandle } from '@temporalio/client';
import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker, Runtime, DefaultLogger, LogEntry } from '@temporalio/worker';
import { exitSignal, GameInfo, getGameInfoQuery, pendulum, updateGameInfoSignal } from './workflows';
import { v4 as uuid4 } from 'uuid';

let handle: WorkflowHandle;
let testEnv: TestWorkflowEnvironment;
let runPromise: Promise<void>;
let worker: Worker;

const taskQueue = 'test';

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

  const { nativeConnection } = testEnv;
  worker = await Worker.create({
    connection: nativeConnection,
    taskQueue,
    workflowsPath: require.resolve('./workflows'),
    activities: undefined,
  });

  runPromise = worker.run();
});

beforeEach(async () => {
  handle = await testEnv.workflowClient.start(pendulum, {
    args: [gameInfo({ anchorX: 1 })],
    workflowId: uuid4(),
    taskQueue,
  });
});

afterAll(async () => {
  worker.shutdown();
  await runPromise;

  await testEnv?.teardown();
});

function gameInfo(overrides: Partial<GameInfo> = {}): GameInfo {
  const defaults = {
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
  };
  return { ...defaults, ...overrides };
}

test('gameInfo without overrides', () => {
  expect(gameInfo().anchorX).toBe(0);
});

test('gameInfo with overrides', () => {
  expect(gameInfo({ anchorX: 1 }).anchorX).toBe(1);
});

test('pendulum exitSignal', async () => {
  await handle.signal(exitSignal);
  await handle.result();
});

test('pendulum getGameInfoQuery', async () => {
  const info = gameInfo({ anchorX: 1 });
  const queryResult = await handle.query(getGameInfoQuery);
  expect(queryResult).toEqual(info);
});

test('pendulum updateGameInfoSignal', async () => {
  const update = gameInfo({ anchorY: 1 });
  await handle.signal(updateGameInfoSignal, update);
  const queryResult = await handle.query(getGameInfoQuery);
  expect(queryResult).toEqual(update);
});
