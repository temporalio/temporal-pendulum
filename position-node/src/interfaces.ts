export type GameInfo = {
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

export type Pendulum = (info: GameInfo) => {
  execute(): Promise<void>;
  queries: {
    getGameInfo(): GameInfo;
  }
  signals: {
    updateGameInfo(info: GameInfo): void;
    setupMove(): void;
    move(): void;
    exit(): void;
  };
};
