import { LoggerSinks } from './workflows/sinks';
import { WorkflowHandle } from '@temporalio/client';
import { TestWorkflowEnvironment } from '@temporalio/testing';
import {
  Worker,
  Runtime,
  DefaultLogger,
  LogEntry,
  InjectedSinks,
} from '@temporalio/worker';
import { exitSignal, GameInfo, getGameInfoQuery, pendulum, updateGameInfoSignal } from './workflows';
import { v4 as uuid4 } from 'uuid';
import { after, afterEach, before, beforeEach, it } from 'mocha';
import assert from 'assert';
import fs from 'fs';

import libCoverage from 'istanbul-lib-coverage';

let handle: WorkflowHandle;
let testEnv: TestWorkflowEnvironment;
let runPromise: Promise<void>;
let worker: Worker;

const logger = new DefaultLogger('WARN', (entry: LogEntry) => console.log(`[${entry.level}]`, entry.message));
const taskQueue = 'test';

const sinks: InjectedSinks<LoggerSinks> = {
  coverage: {
    merge: {
      fn(_workflowInfo, testCoverage) {
        coverageMap.merge(testCoverage as libCoverage.CoverageMap);
      },
      callDuringReplay: false, // The default
    },
  },
};

// @ts-ignore
const shouldWriteCoverage = global.__coverage__ != null;
const coverageMap = libCoverage.createCoverageMap();

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

before(async () => {
  // Use console.log instead of console.error to avoid red output
  // Filter INFO log messages for clearer test output
  Runtime.install({
    logger,
  });

  testEnv = await TestWorkflowEnvironment.create({
    testServer: {
      stdio: 'inherit',
    },
  });

  if (shouldWriteCoverage) {
    fs.mkdirSync(`${__dirname}/../coverage`);
  }
});

beforeEach(async () => {
  const { nativeConnection } = testEnv;
  worker = await Worker.create({
    connection: nativeConnection,
    taskQueue,
    workflowsPath: require.resolve("./workflows"),
    activities: undefined,
    interceptors: {
      workflowModules: [require.resolve('./workflows/interceptors')]
    },
    sinks,
  });

  runPromise = worker.run();

  handle = await testEnv.workflowClient.start(pendulum, {
    args: [initInfo],
    workflowId: uuid4(),
    taskQueue,
  });
});

after(() => {
  fs.writeFileSync(
    `${__dirname}/../coverage/coverage.json`,
    JSON.stringify(coverageMap),
  );
});

afterEach(async () => {
  worker.shutdown();
  await runPromise;
});

after(async () => {
  await testEnv?.teardown();
});

it('pendulum exitSignal', async () => {
  await handle.signal(exitSignal);
  await handle.result();
});

it('pendulum getGameInfoQuery', async () => {
  const queryResult = await handle.query(getGameInfoQuery);
  assert.deepStrictEqual(queryResult, initInfo);
});

it('pendulum updateGameInfoSignal', async () => {
  const update = { ...gameInfo, anchorY: 1 };
  await handle.signal(updateGameInfoSignal, update);
  const queryResult = await handle.query(getGameInfoQuery);
  assert.deepStrictEqual(queryResult, update);
});
