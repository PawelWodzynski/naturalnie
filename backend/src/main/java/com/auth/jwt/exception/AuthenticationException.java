package com.auth.jwt.exception;

/**
 * Custom exception thrown during the authentication process (e.g., login).
 */
public class AuthenticationException extends RuntimeException {

    public AuthenticationException(String message) {
        super(message);
    }

    public AuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}

