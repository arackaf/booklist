/// <reference path="modules/react-redux/index.d.ts" />
/// <reference path="modules/reselect/index.d.ts" />

declare module "*.graphql" {
  const value: any;
  export default value;
}

type Opt<T> = { [x in keyof T]?: T[x] };
