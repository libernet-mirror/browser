export class Mutex {
  private _locked = false;
  private _callbacks: (() => void)[] = [];

  private async _lockedImpl<Result>(
    fn: () => Result | Promise<Result>,
    resolve: (result: Result) => void,
    reject: (error: Error) => void,
  ): Promise<void> {
    this._locked = true;
    try {
      resolve(await fn());
    } catch (error) {
      reject(error as Error);
    } finally {
      this._locked = false;
      this._callbacks.shift()?.();
    }
  }

  public locked<Result>(fn: () => Result | Promise<Result>): Promise<Result> {
    return new Promise<Result>((resolve, reject) => {
      if (this._locked) {
        this._callbacks.push(() => {
          this._lockedImpl(fn, resolve, reject);
        });
      } else {
        this._lockedImpl(fn, resolve, reject);
      }
    });
  }
}
