export function createState<T>(value: T) {
  let stateValue = $state(value);

  return {
    get value() {
      return stateValue;
    },
    set value(newValue: T) {
      stateValue = newValue;
    }
  };
}

class ForceNonReactive {
  constructor(value: any) {
    Object.assign(this, value);
  }
}

export function createShallowReactiveArray<T>(values: T[]): T[] {
  let stateValue = $state(values.map(item => new ForceNonReactive(item))) as T[];
  return stateValue;
}
