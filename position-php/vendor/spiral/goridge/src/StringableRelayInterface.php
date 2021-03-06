<?php

/**
 * Dead simple, high performance, drop-in bridge to Golang RPC with zero dependencies
 *
 * @author Wolfy-J
 */

declare(strict_types=1);

namespace Spiral\Goridge;

interface StringableRelayInterface
{
    /**
     * @return string
     */
    public function __toString(): string;
}
