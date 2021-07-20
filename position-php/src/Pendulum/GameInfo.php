<?php

namespace Temporal\Pendulum\Pendulum;

use Temporal\Internal\Marshaller\Meta\Marshal;

class GameInfo {

    //#[Marshal(name: 'anchorX')]
    public int $anchorX;

    //#[Marshal(name: 'anchorY')]
    public int $anchorY;

    //#[Marshal(name: 'ballX')]
    public int $ballX;

    //#[Marshal(name: 'ballY')]
    public int $ballY;

    //#[Marshal(name: 'length')]
    public int $length;

    //#[Marshal(name: 'width')]
    public int $width;

    //#[Marshal(name: 'height')]
    public int $height;

    //#[Marshal(name: 'angle')]
    public float $angle;

    //#[Marshal(name: 'angleAccel')]
    public float $angleAccel;

    //#[Marshal(name: 'angleVelocity')]
    public float $angleVelocity;

    //#[Marshal(name: 'dt')]
    public float $dt;

    //#[Marshal(name: 'speed')]
    public int $speed;

}
