package com.grengcry.exception;

public class UnauthorizedException extends ApplicationException {
	private static final long serialVersionUID = 1L;
    public UnauthorizedException(String message) {
        super(message, "UNAUTHORIZED");
    }
}
