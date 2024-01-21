export class CustomError {
  code: number;
  msg: string | object;
  data?: Record<string, any>;

  constructor(code: number, msg: string | object, data?: Record<string, any>) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
}
