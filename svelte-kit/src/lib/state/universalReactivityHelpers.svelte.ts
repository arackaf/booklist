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
