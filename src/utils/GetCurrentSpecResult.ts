/* eslint-disable @typescript-eslint/no-explicit-any */
let currentSpecResult: any;
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// eslint-disable-next-line no-undef
jasmine.getEnv().addReporter({
  specStarted: (result: any) => {
    currentSpecResult = result;
  },
});

export default function getCurrentSpecResult(): any {
  return currentSpecResult;
}
