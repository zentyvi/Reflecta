export {};

// Inputs validation errors

export type FieldErrors = {
  msg: string;
  [key: string]: any;
};

export type ErrorsObject = {
  [key: string]: FieldErrors | null;
};
