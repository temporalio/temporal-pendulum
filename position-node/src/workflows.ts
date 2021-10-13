import {
  defineQuery,
  defineSignal,
  setListener,
  Trigger,
} from "@temporalio/workflow";

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
};

export async function pendulum(info: GameInfo): Promise<void> {
  const exited = new Trigger<void>();
  let gameInfo: GameInfo = info;

  setListener(defineQuery("getGameInfo"), () => gameInfo);

  setListener(defineSignal<[GameInfo]>("updateGameInfo"), (info: GameInfo) => {
    gameInfo = info;
  });

  setListener(defineSignal("setupMove"), () => {
    gameInfo.angleAccel = (-9.81 / gameInfo.length) * Math.sin(gameInfo.angle);
    gameInfo.angleVelocity += gameInfo.angleAccel * gameInfo.dt;
    gameInfo.angle += gameInfo.angleVelocity * gameInfo.dt;
  });

  setListener(defineSignal("move"), () => {
    gameInfo.anchorX = gameInfo.width / 2;
    gameInfo.anchorY = gameInfo.height / 4;
    gameInfo.ballX = Math.floor(
      gameInfo.anchorX + Math.sin(gameInfo.angle) * gameInfo.length
    );
    gameInfo.ballY = Math.floor(
      gameInfo.anchorY + Math.cos(gameInfo.angle) * gameInfo.length
    );
  });

  setListener(defineSignal("exit"), () => {
    exited.resolve();
  });

  return await exited;
}

export { pendulum as PositionWorkflow };
