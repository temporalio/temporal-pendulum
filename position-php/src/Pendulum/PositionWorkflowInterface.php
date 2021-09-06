<?php

declare(strict_types=1);

namespace Temporal\Pendulum\Pendulum;

use Temporal\Workflow\QueryMethod;
use Temporal\Workflow\WorkflowInterface;
use Temporal\Workflow\WorkflowMethod;
use Temporal\Workflow\SignalMethod;

#[WorkflowInterface]
interface PositionWorkflowInterface
{
    #[WorkflowMethod(name: "PositionWorkflow")]
    public function exec(GameInfo $gameInfo);

    #[SignalMethod]
    public function exit(): void;

    #[SignalMethod]
    public function move(): void;

    #[SignalMethod]
    public function setupMove(): void;

    #[SignalMethod]
    public function updateGameInfo(GameInfo $gameInfo): void;

    #[QueryMethod]
    public function getGameInfo():GameInfo;
}