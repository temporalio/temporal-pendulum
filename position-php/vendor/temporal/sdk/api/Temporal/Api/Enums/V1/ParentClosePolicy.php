<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: temporal/api/enums/v1/workflow.proto

namespace Temporal\Api\Enums\V1;

use UnexpectedValueException;

/**
 * Protobuf type <code>temporal.api.enums.v1.ParentClosePolicy</code>
 */
class ParentClosePolicy
{
    /**
     * Generated from protobuf enum <code>PARENT_CLOSE_POLICY_UNSPECIFIED = 0;</code>
     */
    const PARENT_CLOSE_POLICY_UNSPECIFIED = 0;
    /**
     * Terminate means terminating the child workflow.
     *
     * Generated from protobuf enum <code>PARENT_CLOSE_POLICY_TERMINATE = 1;</code>
     */
    const PARENT_CLOSE_POLICY_TERMINATE = 1;
    /**
     * Abandon means not doing anything on the child workflow.
     *
     * Generated from protobuf enum <code>PARENT_CLOSE_POLICY_ABANDON = 2;</code>
     */
    const PARENT_CLOSE_POLICY_ABANDON = 2;
    /**
     * Cancel means requesting cancellation on the child workflow.
     *
     * Generated from protobuf enum <code>PARENT_CLOSE_POLICY_REQUEST_CANCEL = 3;</code>
     */
    const PARENT_CLOSE_POLICY_REQUEST_CANCEL = 3;

    private static $valueToName = [
        self::PARENT_CLOSE_POLICY_UNSPECIFIED => 'PARENT_CLOSE_POLICY_UNSPECIFIED',
        self::PARENT_CLOSE_POLICY_TERMINATE => 'PARENT_CLOSE_POLICY_TERMINATE',
        self::PARENT_CLOSE_POLICY_ABANDON => 'PARENT_CLOSE_POLICY_ABANDON',
        self::PARENT_CLOSE_POLICY_REQUEST_CANCEL => 'PARENT_CLOSE_POLICY_REQUEST_CANCEL',
    ];

    public static function name($value)
    {
        if (!isset(self::$valueToName[$value])) {
            throw new UnexpectedValueException(sprintf(
                    'Enum %s has no name defined for value %s', __CLASS__, $value));
        }
        return self::$valueToName[$value];
    }


    public static function value($name)
    {
        $const = __CLASS__ . '::' . strtoupper($name);
        if (!defined($const)) {
            throw new UnexpectedValueException(sprintf(
                    'Enum %s has no value defined for name %s', __CLASS__, $name));
        }
        return constant($const);
    }
}
