import React, { forwardRef, useRef, FC, createContext, useState, useCallback, useMemo, useContext, useLayoutEffect } from "react";

const FormContext = createContext<any>({});

export const Form = ({ submit, children }) => {
  const validators = useRef([]);

  const [errors, setErrors] = useState({});
  const isError = useCallback(name => errors[name], [errors]);
  const addError = useCallback((name, val) => setErrors({ ...errors, [name]: val }), [errors]);
  const removeError = useCallback((name, val) => setErrors({ ...errors, [name]: false }), [errors]);
  const registerValidator = useCallback((name, val, valueLambda, testFn) => {
    validators.current.push([name, val, valueLambda, testFn]);
  }, []);

  const doSubmit = evt => {
    evt.preventDefault();

    let invalid = false;
    for (let [name, val, valueLambda, testFn] of validators.current) {
      if (!testFn(valueLambda())) {
        addError(name, val);
        invalid = true;
      }
    }

    if (!invalid) {
      submit();
    }
  };

  const formPacket = useMemo(() => ({ isError, addError, removeError, registerValidator }), [isError, addError, removeError]);

  return (
    <form onSubmit={doSubmit}>
      <FormContext.Provider value={formPacket}> {children}</FormContext.Provider>
    </form>
  );
};

export const Input: FC<any> = forwardRef((props, ref) => {
  const _ref = useRef(null);
  const { name, className = "", onChange, validate, ...rest } = props;
  const { isError, addError, removeError, registerValidator } = useContext(FormContext);

  const inputRef: any = ref || _ref;
  const onChangeFn = evt => {
    if (onChange) {
      onChange(evt);
    }

    if (isError(name)) {
      if (validate(evt.target.value)) {
        removeError(name);
      }
    }
  };

  useLayoutEffect(() => {
    registerValidator(name, true, () => inputRef.current.value, validate)
  }, []);

  const classes = className + " " + (isError(name) ? "error" : "");

  return <input className={classes} onChange={onChangeFn} ref={inputRef} {...rest} />;
});
