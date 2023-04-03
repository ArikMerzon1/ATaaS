declare module "omit-deep-lodash" {
  function omitDeepLodash<T = unknown>(object: T, props: string | string[]): T;
  export = omitDeepLodash;
}
