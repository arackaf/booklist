export type Ref<T> = {
  get value(): T;
  set value(value: T);
};
export const ref = <T>(value: T): Ref<T> => {
  let state = $state<T>(value);
  return {
    get value() {
      return state;
    },
    set value(value: T) {
      state = value;
    }
  };
};

class ForceNonReactive {
  constructor(value: any) {
    Object.assign(this, value);
  }
}

export function createShallowReactiveArray<T>(values: T[]): T[] {
  let stateValue = $state(values.map(item => new ForceNonReactive(item))) as T[];
  return stateValue;
}
