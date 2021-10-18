import {useEffect, useRef} from 'react';

interface CancelablePromise<T> {
  promise: Promise<T>;
  cancel: () => void;
}

function makeCancelable<T>(
  promise: Promise<T>,
  rejectOnCanceled: boolean = false,
): CancelablePromise<T> {
  let isCanceled = false;
  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise
      .then((result: T) => {
        if (isCanceled) {
          if (rejectOnCanceled) {
            reject({isCanceled});
          }
        } else {
          resolve(result);
        }
      })
      .catch(err => {
        if (isCanceled) {
          if (rejectOnCanceled) {
            reject({isCanceled});
          }
        } else {
          reject(err);
        }
      });
  });
  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
}

export default function useCancelable() {
  const promises = useRef<CancelablePromise<any>[]>([]);

  useEffect(() => {
    return function cancel() {
      promises.current.forEach(p => p.cancel());
      promises.current = [];
    };
  }, []);

  return function cancelablePromise<T>(
    promise: Promise<T>,
    rejectOnCanceled: boolean = false,
  ) {
    const cancelable = makeCancelable(promise, rejectOnCanceled);
    promises.current.push(cancelable);
    return cancelable.promise;
  };
}
