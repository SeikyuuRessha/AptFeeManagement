package com.seikyuuressha.aptfeemanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "Resident existed", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1003, "Invalid email format", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least 8 characters long and include uppercase, lowercase, and digits", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "Resident not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    TOKEN_EXPIRED(1008, "Token expired", HttpStatus.UNAUTHORIZED),
    BUILDING_NOT_FOUND(1009, "Building not found", HttpStatus.NOT_FOUND),
    BUILDING_NAME_EXISTED(10010, "Building name already existed", HttpStatus.CONFLICT),
    BUILDING_NAME_MISMATCH(10011, "Building name mismatch", HttpStatus.CONFLICT),
    APARTMENT_ROOM_NUMBER_EXISTS(10012, "Apartment room number already exists", HttpStatus.CONFLICT),
    APARTMENT_NOT_FOUND(10013, "Apartment not found", HttpStatus.NOT_FOUND),
    SERVICE_EXISTED(10014, "Service already existed", HttpStatus.CONFLICT),
    SERVICE_NOT_EXISTED(10015, "Service not existed", HttpStatus.CONFLICT),
    NOTIFICATION_NOT_FOUND(10016, "Notification not found", HttpStatus.NOT_FOUND),
    CONTRACT_NOT_FOUND(10017, "Contract not found", HttpStatus.NOT_FOUND),
    INVOICE_NOT_FOUND(10018, "Invoice not found", HttpStatus.NOT_FOUND),
    SUBSCRIPTION_EXISTED(10019, "Subscription already existed", HttpStatus.CONFLICT),
    SUBSCRIPTION_NOT_FOUND(10020, "Subscription not found", HttpStatus.NOT_FOUND),
    PAYMENT_NOT_FOUND(10021, "Payment not found", HttpStatus.NOT_FOUND),
    INVOICE_DETAIL_NOT_FOUND(10022, "Invoice detail not found", HttpStatus.NOT_FOUND),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
