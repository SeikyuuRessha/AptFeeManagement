import { HttpException, HttpStatus } from "@nestjs/common";

export class AppException extends HttpException {
    readonly code: number;
    readonly msg: string;
    readonly data: any;

    constructor(
        codeObj: { code: number; msg: string },
        data: any = null,
        httpStatus: HttpStatus = HttpStatus.BAD_REQUEST
    ) {
        super(
            {
                code: codeObj.code,
                msg: codeObj.msg,
                data,
            },
            httpStatus
        );

        this.code = codeObj.code;
        this.msg = codeObj.msg;
        this.data = data;
    }
}
