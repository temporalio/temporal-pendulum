import { Workflow } from '@temporalio/workflow';

export class GameInfo {
	anchorX = 0;
	anchorY= 0;
	ballX = 0;
	ballY = 0;
	length = 0;
	width = 0;
	height = 0;
	angle = 0.0;
	angleAccel = 0.0;
	angleVelocity = 0.0;
	dt = 0.0;
	speed = 0;
}

export interface Pendulum extends Workflow {
  main(info: GameInfo): Promise<void>;
  queries: {
    getGameInfo(): GameInfo;
  }
  signals: {
    updateGameInfo(info: GameInfo): void;
    setupMove(): void;
    move(): void;
    exit(): void;
  }
}
