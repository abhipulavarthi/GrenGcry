package com.grengcry.exception;

public class BadRequestException extends ApplicationException {
	private static final long serialVersionUID = 1L;
    public BadRequestException(String message) {
        super(message, "BAD_REQUEST");
    }

    public BadRequestException(String message, Object details) {
        super(message, "BAD_REQUEST", details);
    }
}
