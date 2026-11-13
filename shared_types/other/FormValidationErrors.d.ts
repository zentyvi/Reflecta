export {};

export type FormErrorsObject = {
  [key: string]: {
    msg: string;
    [key: string]: unknown;
  }
}