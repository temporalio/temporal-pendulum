package io.temporal.demo.pendulum.position;

import io.temporal.workflow.QueryMethod;
import io.temporal.workflow.SignalMethod;
import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;

@WorkflowInterface
public interface PositionWorkflow {
    @WorkflowMethod
    void exec(GameInfo gameInfo);

    @SignalMethod
    void exit();

    @SignalMethod
    void move();

    @SignalMethod
    void setupMove();

    @SignalMethod
    void updateGameInfo(GameInfo gameInfo);

    @QueryMethod
    GameInfo getGameInfo();
}
