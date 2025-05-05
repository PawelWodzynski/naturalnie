package com.auth.jwt.util;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component // Mark as a Spring component to be injectable
public class ResponseUtil {

    /**
     * Create error response map.
     * @param message Error message
     * @return Map representing the error response.
     */
    public Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }

    /**
     * Create success response map.
     * @param message Success message
     * @param data Optional data to include in the response
     * @return Map representing the success response.
     */
    public Map<String, Object> createSuccessResponse(String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        if (data != null) {
            response.put("data", data);
        }
        return response;
    }
}

