export {};
declare global {
  var testStatuses: { [testPath: string]: { status: "failed" | "passed" | "running" | "error"; error?: Error } };
}
