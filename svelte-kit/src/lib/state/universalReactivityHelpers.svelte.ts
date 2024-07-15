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

export function createReactiveArray<T>(values: T[]) {
  let stateValue = $state([...values]);

  return {
    get value() {
      return stateValue;
    },
    set value(newValues: T[]) {
      stateValue = newValues;
    }
  };
}

class ForceNonReactive {
  constructor(value: any) {
    Object.assign(this, value);
  }
}

export function createShallowReactiveArray<T>(values: T[]) {
  let stateValue = $state(values.map(item => $state.snapshot(item)));
  // let stateValue = $state(values.map(item => new ForceNonReactive(item)));

  return {
    get value() {
      return stateValue;
    },
    set value(newValues: any[]) {
      stateValue = newValues.map(item => $state.snapshot(item));
      // stateValue = newValues.map(item => new ForceNonReactive(item));
    }
  };
}
