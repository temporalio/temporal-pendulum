import { Workflow } from '@temporalio/workflow';

export interface GameInfo {
  anchorX: number;
  anchorY: number;
  ballX: number;
  ballY: number;
  length: number;
  width: number;
  height: number;
  angle: number;
  angleAccel: number;
  angleVelocity: number;
  dt: number;
  speed: number;
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
