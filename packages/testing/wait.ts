export const wait = (durationInMs: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, durationInMs);
  });
