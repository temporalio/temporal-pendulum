<?php

declare(strict_types=1);

namespace Temporal\Pendulum\Pendulum;

use Temporal\Workflow;

class PositionWorkflow implements PositionWorkflowInterface {

    private GameInfo $gameInfo;

    private bool $exit = false;

    public function exec(GameInfo $gameInfo)
    {
        $this->gameInfo = $gameInfo;

        Workflow::await(fn() => $this->exit == true);
    }

    public function exit(): void
    {
        $this->exit = true;
    }

    public function move(): void
    {
        $this->gameInfo->anchorX = $this->gameInfo->width / 2;
        $this->gameInfo->anchorY = $this->gameInfo->height / 4;
        $this->gameInfo->ballX = $this->gameInfo->anchorX + intval(sin($this->gameInfo->angle) * $this->gameInfo->length);
        $this->gameInfo->ballY = $this->gameInfo->anchorY + intval(cos($this->gameInfo->angle) * $this->gameInfo->length);
    }

    public function setupMove(): void
    {
        $this->gameInfo->angleAccel = -9.81 / $this->gameInfo->length * sin($this->gameInfo->angle);
        $this->gameInfo->angleVelocity = $this->gameInfo->angleVelocity + $this->gameInfo->angleAccel * $this->gameInfo->dt;
        $this->gameInfo->angle = $this->gameInfo->angle + ($this->gameInfo->angleVelocity * $this->gameInfo->dt);
    }

    public function updateGameInfo(GameInfo $gameInfo): void
    {
        $this->gameInfo = $gameInfo;
    }

    public function getGameInfo(): GameInfo
    {
        return $this->gameInfo;
    }

}