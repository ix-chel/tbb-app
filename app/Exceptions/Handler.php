<?php

namespace App\Exceptions;

use App\Traits\ApiResponseTrait;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    use ApiResponseTrait;

    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception for API requests as a consistent JSON envelope.
     * Web requests fall through to the default Inertia/HTML handler.
     */
    public function render($request, Throwable $e): mixed
    {
        if ($this->isApiRequest($request)) {
            return $this->renderApiException($request, $e);
        }

        return parent::render($request, $e);
    }

    // ─── Private Helpers ─────────────────────────────────────────────────────

    private function isApiRequest(Request $request): bool
    {
        return $request->is('api/*') || $request->expectsJson();
    }

    private function renderApiException(Request $request, Throwable $e): JsonResponse
    {
        // Validation (422)
        if ($e instanceof ValidationException) {
            return $this->validationError($e->errors(), $e->getMessage());
        }

        // Model not found (404)
        if ($e instanceof ModelNotFoundException) {
            $model = class_basename($e->getModel());
            return $this->notFound("{$model} not found");
        }

        // Unauthenticated (401)
        if ($e instanceof AuthenticationException) {
            return $this->error('Unauthenticated.', 401);
        }

        // HTTP exceptions (403, 404, 429, etc.)
        if ($e instanceof HttpException) {
            return $this->error($e->getMessage() ?: 'HTTP Error', $e->getStatusCode());
        }

        // Generic server error (500) — never expose message in production
        $message = config('app.debug')
            ? $e->getMessage()
            : 'An unexpected error occurred.';

        return $this->error($message, 500);
    }
}
