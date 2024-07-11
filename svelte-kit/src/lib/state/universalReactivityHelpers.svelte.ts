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
