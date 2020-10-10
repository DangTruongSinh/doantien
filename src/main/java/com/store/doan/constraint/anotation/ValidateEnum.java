package com.store.doan.constraint.anotation;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

import com.store.doan.constraint.EnumValidator;

@Target(FIELD)
@Retention(RUNTIME)
@Constraint(validatedBy = EnumValidator.class)
public @interface ValidateEnum {
	String message() default "type not match";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    Class<? extends Enum<?>> targetClassType();
}
