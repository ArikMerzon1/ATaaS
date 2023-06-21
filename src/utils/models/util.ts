export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type RetrierOptions<T> = {
  maxTries?: number;
  delay?: number;
  checkFn?: (result: T) => boolean;
};
