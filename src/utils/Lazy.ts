import { ILazyInitializer } from "./ILazyInitializer";

export default class Lazy<T> {
  private instance: T | null = null;

  private readonly initializer: ILazyInitializer<T>;

  constructor(initializer: ILazyInitializer<T>) {
    this.initializer = initializer;
  }

  public get value(): T {
    if (this.instance == null) {
      this.instance = this.initializer();
    }

    return this.instance;
  }
}
