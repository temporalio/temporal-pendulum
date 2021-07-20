package io.temporal.demo.pendulum.position;

import io.temporal.workflow.Workflow;

public class PositionWorkflowImpl implements  PositionWorkflow {

    private GameInfo gameInfo;
    private boolean exit = false;

    @Override
    public void exec(GameInfo gameInfo) {
        this.gameInfo = gameInfo;
        Workflow.await(() -> exit == true);
    }

    @Override
    public void exit() {
        this.exit = true;
    }

    @Override
    public void move() {

        gameInfo.setAnchorX(gameInfo.getWidth() / 2);
        gameInfo.setAnchorY(gameInfo.getHeight() / 4);
        gameInfo.setBallX(gameInfo.getAnchorX() + (int) (Math.sin(gameInfo.getAngle()) * gameInfo.getLength()));
        gameInfo.setBallY(gameInfo.getAnchorY() + (int) (Math.cos(gameInfo.getAngle()) * gameInfo.getLength()));
    }

    @Override
    public void setupMove() {
        gameInfo.setAngleAccel(-9.81 / gameInfo.getLength() * Math.sin(gameInfo.getAngle()));
        gameInfo.setAngleVelocity( gameInfo.getAngleVelocity() + gameInfo.getAngleAccel() * gameInfo.getDt());
        gameInfo.setAngle(gameInfo.getAngle() + (gameInfo.getAngleVelocity() * gameInfo.getDt()));
    }

    @Override
    public GameInfo getGameInfo() {
        return gameInfo;
    }

    @Override
    public void updateGameInfo(GameInfo gameInfo) {
        this.gameInfo = gameInfo;
    }
}
