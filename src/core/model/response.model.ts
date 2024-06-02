export class Response<T> {
  message: string;
  data?: T;
  errors?: T;
}
