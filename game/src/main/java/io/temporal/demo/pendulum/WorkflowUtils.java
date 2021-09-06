package io.temporal.demo.pendulum;

import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowOptions;
import io.temporal.serviceclient.WorkflowServiceStubs;

public class WorkflowUtils {
    private static final WorkflowServiceStubs SERVICE = WorkflowServiceStubs.newInstance();
    private static final WorkflowClient CLIENT = WorkflowClient.newInstance(SERVICE);

    private static final String POSITIONING_JAVA_TASK_QUEUE = "PendulumJava";
    private static final String POSITIONING_PHP_TASK_QUEUE = "PendulumPHP";
    private static final String POSITIONING_GO_TASK_QUEUE = "PendulumGo";
    private static final String POSITIONING_NODE_TASK_QUEUE = "PendulumNode";

    private static final WorkflowOptions POSITION_JAVA_WORKFLOW_OPTIONS = WorkflowOptions.newBuilder()
            .setWorkflowId("pendulumpositionjava")
            .setTaskQueue(POSITIONING_JAVA_TASK_QUEUE)
            .build();

    private static final WorkflowOptions POSITION_PHP_WORKFLOW_OPTIONS = WorkflowOptions.newBuilder()
            .setWorkflowId("pendulumpositionphp")
            .setTaskQueue(POSITIONING_PHP_TASK_QUEUE)
            .build();

    private static final WorkflowOptions POSITION_GO_WORKFLOW_OPTIONS = WorkflowOptions.newBuilder()
            .setWorkflowId("pendulumpositiongo")
            .setTaskQueue(POSITIONING_GO_TASK_QUEUE)
            .build();

    private static final WorkflowOptions POSITION_NODE_WORKFLOW_OPTIONS = WorkflowOptions.newBuilder()
            .setWorkflowId("pendulumpositionnode")
            .setTaskQueue(POSITIONING_NODE_TASK_QUEUE)
            .build();

    public static PositionWorkflow javaPositionWorkflow = CLIENT.newWorkflowStub(PositionWorkflow.class, POSITION_JAVA_WORKFLOW_OPTIONS);

    public static PositionWorkflow phpPositionWorkflow = CLIENT.newWorkflowStub(PositionWorkflow.class, POSITION_PHP_WORKFLOW_OPTIONS);

    public static PositionWorkflow goPositionWorkflow = CLIENT.newWorkflowStub(PositionWorkflow.class, POSITION_GO_WORKFLOW_OPTIONS);

    public static PositionWorkflow nodePositionWorkflow = CLIENT.newWorkflowStub(PositionWorkflow.class, POSITION_NODE_WORKFLOW_OPTIONS);

    public static GameInfo getDefaultGameInfo() {
        GameInfo gameInfo = new GameInfo();
        gameInfo.setLength(200);
        gameInfo.setAngle(Math.PI / 2);
        gameInfo.setWidth(2 * gameInfo.getLength() + 50);
        gameInfo.setHeight(gameInfo.getLength() / 2 * 3);
        gameInfo.setSpeed(15);
        gameInfo.setAngleAccel(0);
        gameInfo.setAngleVelocity(0);
        gameInfo.setDt(0.1);

        return gameInfo;
    }
}
