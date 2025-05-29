import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import { AppException } from "../exception/app-exception";
import { ExceptionCode } from "../exception/exception-code";

export interface ValidationPipeOptions {
    whitelist?: boolean;
    forbidNonWhitelisted?: boolean;
    transform?: boolean;
    disableErrorMessages?: boolean;
}

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
    constructor(private options?: ValidationPipeOptions) {
        this.options = {
            whitelist: true,
            forbidNonWhitelisted: false,
            transform: true,
            disableErrorMessages: false,
            ...options,
        };
    }

    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToInstance(metatype, value, {
            enableImplicitConversion: this.options?.transform,
        });

        const errors = await validate(object, {
            whitelist: this.options?.whitelist,
            forbidNonWhitelisted: this.options?.forbidNonWhitelisted,
        });

        if (errors.length > 0) {
            const formattedErrors = this.formatErrors(errors);

            throw new AppException(ExceptionCode.VALIDATION_ERROR, {
                errors: formattedErrors,
                fields: errors.map((error) => error.property),
            });
        }

        return this.options?.transform ? object : value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    private formatErrors(errors: ValidationError[]): string[] {
        const result: string[] = [];

        errors.forEach((error) => {
            if (error.constraints) {
                result.push(...Object.values(error.constraints));
            }

            if (error.children && error.children.length > 0) {
                result.push(...this.formatErrors(error.children));
            }
        });

        return result;
    }
}
