import { Trigger } from '@temporalio/workflow';
import { Pendulum, GameInfo } from '../interfaces';

export const pendulum: Pendulum = (info: GameInfo) => {
  const exited = new Trigger<void>();
  let gameInfo: GameInfo = info;
  return {
    async execute(): Promise<void> {
      return await exited;
    },
    queries: {
      getGameInfo(): GameInfo {
        return gameInfo;
      }
    },
    signals: {
      updateGameInfo(info: GameInfo): void {
        gameInfo = info;
      },
      setupMove(): void {
        gameInfo.angleAccel = -9.81 / gameInfo.length * Math.sin(gameInfo.angle);
        gameInfo.angleVelocity += gameInfo.angleAccel * gameInfo.dt;
        gameInfo.angle += gameInfo.angleVelocity * gameInfo.dt;
      },
      move(): void {
        gameInfo.anchorX = gameInfo.width / 2;
        gameInfo.anchorY = gameInfo.height / 4;
        gameInfo.ballX = Math.floor(gameInfo.anchorX + Math.sin(gameInfo.angle) * gameInfo.length);
        gameInfo.ballY = Math.floor(gameInfo.anchorY + Math.cos(gameInfo.angle) * gameInfo.length);
      },
      exit(): void {
        exited.resolve();
      }
    }
  };
};
