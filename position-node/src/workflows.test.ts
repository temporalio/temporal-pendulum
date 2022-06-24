import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker, Runtime, DefaultLogger, LogEntry } from '@temporalio/worker';
import { exitSignal, GameInfo, getGameInfoQuery, pendulum, updateGameInfoSignal } from './workflows';
import { v4 as uuid4 } from 'uuid';

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
  const { workflowClient, nativeConnection } = testEnv;
  const worker = await Worker.create({
    connection: nativeConnection,
    taskQueue: 'test',
    workflowsPath: require.resolve('./workflows'),
    activities: undefined,
  });
  await worker.runUntil(async () => {
    const handle = await workflowClient.start(pendulum, {
      args: [gameInfo()],
      workflowId: uuid4(),
      taskQueue: 'test',
    });
    await handle.signal(exitSignal);
    const result = await handle.result();
    expect(result).toBeUndefined;
  });
});

test('pendulum getGameInfoQuery', async () => {
  const { workflowClient, nativeConnection } = testEnv;
  const worker = await Worker.create({
    connection: nativeConnection,
    taskQueue: 'test',
    workflowsPath: require.resolve('./workflows'),
    activities: undefined,
  });
  const info = gameInfo({ anchorX: 1 });
  await worker.runUntil(async () => {
    const handle = await workflowClient.start(pendulum, {
      args: [info],
      workflowId: uuid4(),
      taskQueue: 'test',
    });
    const queryResult = await handle.query(getGameInfoQuery);
    expect(queryResult).toEqual(info);
    await handle.signal(exitSignal);
    await handle.result();
  });
});

test('pendulum updateGameInfoSignal', async () => {
  const { workflowClient, nativeConnection } = testEnv;
  const worker = await Worker.create({
    connection: nativeConnection,
    taskQueue: 'test',
    workflowsPath: require.resolve('./workflows'),
    activities: undefined,
  });
  await worker.runUntil(async () => {
    const handle = await workflowClient.start(pendulum, {
      args: [gameInfo({ anchorX: 1 })],
      workflowId: uuid4(),
      taskQueue: 'test',
    });
    const update = gameInfo({ anchorY: 1 });
    await handle.signal(updateGameInfoSignal, update);
    const queryResult = await handle.query(getGameInfoQuery);
    expect(queryResult).toEqual(update);
    await handle.signal(exitSignal);
    await handle.result();
  });
});
