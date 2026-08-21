<?php

namespace App\Exceptions;

/** A deliberate, user-facing rejection from AuditLogController::restore() — never a DB/infra failure. */
class RestoreFailedException extends \Exception
{
}
