// src/utils/maybe.ts

export class Maybe<T> 
{
    private constructor(private value: T | null) {}
  
    static some<T>(value: T): Maybe<T>
    {
      return new Maybe(value);
    }
  
    static none<T>(): Maybe<T> {
      return new Maybe<T>(null);
    }
  
    isSome(): boolean {
      return this.value !== null;
    }
  
    isNone(): boolean {
      return this.value === null;
    }
  
    unwrap(): T {
      if (this.value === null) {
        throw new Error('Tried to unwrap a None value');
      }
      return this.value;
    }
  
    unwrapOr(defaultValue: T): T {
      return this.value !== null ? this.value : defaultValue;
    }
  
    map<U>(fn: (value: T) => U): Maybe<U> {
      if (this.value === null) {
        return Maybe.none<U>();
      }
      return Maybe.some(fn(this.value));
    }
  
    flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
      if (this.value === null) {
        return Maybe.none<U>();
      }
      return fn(this.value);
    }
  }