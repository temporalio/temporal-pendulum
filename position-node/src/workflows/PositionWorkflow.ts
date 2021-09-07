import { Trigger } from '@temporalio/workflow';
import { Pendulum, GameInfo } from '../interfaces/workflows';

let gameInfo: GameInfo;
let exited: Trigger<void>;

async function main(info: GameInfo): Promise<void> {
  gameInfo = info;
  await (exited = new Trigger<void>())
}

function getGameInfo(): GameInfo {
  return gameInfo;
}

function updateGameInfo(info: GameInfo): void {
  gameInfo = info;
}

function setupMove(): void {
  gameInfo.angleAccel = -9.81 / gameInfo.length * Math.sin(gameInfo.angle);
  gameInfo.angleVelocity += gameInfo.angleAccel * gameInfo.dt;
  gameInfo.angle += gameInfo.angleVelocity * gameInfo.dt;
}

function move(): void {
  gameInfo.anchorX = gameInfo.width / 2;
  gameInfo.anchorY = gameInfo.height / 4;
  gameInfo.ballX = Math.floor(gameInfo.anchorX + Math.sin(gameInfo.angle) * gameInfo.length);
  gameInfo.ballY = Math.floor(gameInfo.anchorY + Math.cos(gameInfo.angle) * gameInfo.length);
}

function exit(): void {
  exited.resolve();
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
