package com.auth.jwt.util;

import org.springframework.stereotype.Component;

@Component
public class ValidationUtil {

    /**
     * Validates password complexity.
     * Checks if the password has a minimum length, at least one uppercase letter,
     * and at least one special character.
     * @param password The password to validate.
     * @return true if the password is valid, false otherwise.
     */
    public boolean isPasswordValid(String password) {
        if (password == null || password.length() < 6) {
            return false;
        }

        boolean hasUpperCase = false;
        boolean hasSpecialChar = false;
        String specialChars = "!@#$%^&*()_+-=[]{}|;':\\\",./<>?"; // Escaped backslash

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) {
                hasUpperCase = true;
            } else if (specialChars.indexOf(c) >= 0) {
                hasSpecialChar = true;
            }

            if (hasUpperCase && hasSpecialChar) {
                return true;
            }
        }

        return false;
    }

    /**
     * Validates email format using a regular expression.
     * @param email The email address to validate.
     * @return true if the email format is valid, false otherwise.
     */
    public boolean isEmailValid(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }

        // Basic email validation regex
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";

        return email.matches(emailRegex);
    }
}

