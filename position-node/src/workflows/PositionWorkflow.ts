import { Trigger } from '@temporalio/workflow';
import { Pendulum, GameInfo } from '../interfaces/workflows';

let gameInfo: GameInfo;
let trigger: Trigger<void>;
let exited: boolean;

async function main(info: GameInfo): Promise<void> {
  gameInfo = info;
  // FIXME: It should suffice to await only the exit trigger,
  // but the other signals were not being processed.
  while (!exited) {
    await (trigger = new Trigger<void>())
  }
}

function getGameInfo(): GameInfo {
  return gameInfo;
}

function updateGameInfo(info: GameInfo): void {
  gameInfo = info;
  trigger.resolve();
}

function setupMove(): void {
  gameInfo.angleAccel = -9.81 / gameInfo.length * Math.sin(gameInfo.angle);
  gameInfo.angleVelocity += gameInfo.angleAccel * gameInfo.dt;
  gameInfo.angle += gameInfo.angleVelocity * gameInfo.dt;
  trigger.resolve();
}

function move(): void {
  gameInfo.anchorX = gameInfo.width / 2;
  gameInfo.anchorY = gameInfo.height / 4;
  gameInfo.ballX = Math.floor(gameInfo.anchorX + Math.sin(gameInfo.angle) * gameInfo.length);
  gameInfo.ballY = Math.floor(gameInfo.anchorY + Math.cos(gameInfo.angle) * gameInfo.length);
  trigger.resolve();
}

function exit(): void {
  exited = true;
  trigger.resolve();
}

export const workflow: Pendulum = {
  main,
  queries: {
    getGameInfo
  },
  signals: {
    updateGameInfo,
    setupMove,
    move,
    exit
  }
};
