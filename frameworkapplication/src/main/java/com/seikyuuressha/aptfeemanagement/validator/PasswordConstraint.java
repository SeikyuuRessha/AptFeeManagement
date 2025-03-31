package com.seikyuuressha.aptfeemanagement.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.Size;
import java.lang.annotation.*;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({ FIELD })
@Retention(RUNTIME)
@Constraint(validatedBy = { PasswordValidator.class })
public @interface PasswordConstraint {
    String message() default "Password must be at least 8 characters long and include uppercase, lowercase, and digits";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}