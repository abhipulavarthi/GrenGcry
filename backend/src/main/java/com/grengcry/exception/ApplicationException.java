package com.grengcry.exception;

import lombok.Getter;

@Getter
public class ApplicationException extends RuntimeException {
	private static final long serialVersionUID = 1L;
    private final String code;
    private final Object details;
    
    public ApplicationException(String message, String code) {
        super(message);
        this.code = code;
        this.details = null;
    }
    
    public ApplicationException(String message, String code, Object details) {
        super(message);
        this.code = code;
        this.details = details;
    }
}
