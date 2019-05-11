import EventEmitter from "eventemitter3";

const result = new EventEmitter();
const originalOn = result.on;

result.on = (name, fn) => {
  originalOn.call(result, name, fn);
  return () => {
    result.off(name, fn);
  };
};

export default result;