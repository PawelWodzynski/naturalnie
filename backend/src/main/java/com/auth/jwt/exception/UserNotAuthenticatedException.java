package com.auth.jwt.exception;

/**
 * Custom exception thrown when an operation requires an authenticated user,
 * but the user could not be retrieved from the security context.
 */
public class UserNotAuthenticatedException extends RuntimeException {

    public UserNotAuthenticatedException(String message) {
        super(message);
    }

    public UserNotAuthenticatedException(String message, Throwable cause) {
        super(message, cause);
    }
}

