import React, { forwardRef, useRef, FC, createContext, useState, useCallback, useMemo, useContext, useLayoutEffect } from "react";
import { ActionButton } from "./Button";

import cn from "classnames";

const FormContext = createContext<any>({});

export const Form = ({ submit, children }) => {
  const validators = useRef([]);

  const [errors, setErrors] = useState({});
  const isError = useCallback(name => errors[name], [errors]);
  const addError = useCallback(
    (name, errorKey) =>
      setErrors(errors => {
        const newErrors = errors[name] || {};
        newErrors[errorKey] = true;
        return { ...errors, [name]: newErrors };
      }),
    []
  );
  const clearErrors = useCallback(() => setErrors({}), []);
  const removeError = useCallback(
    (name, errorKey) =>
      setErrors(errors => {
        let current = errors[name];
        if (!current) return errors;

        current = { ...current };
        delete current[errorKey];
        return { ...errors, [name]: Object.keys(current).length ? current : null };
      }),
    []
  );
  const registerValidator = useCallback((name, val, valueLambda, testFn) => {
    validators.current = validators.current.filter(([existingName]) => name != existingName);
    validators.current.push([name, val, valueLambda, testFn]);
  }, []);

  const formSubmit = evt => {
    evt.preventDefault();
  };
  const doSubmit = useCallback(() => {
    clearErrors();
    let invalid = false;
    for (let [name, val, valueLambda, testFns] of validators.current) {
      testFns.forEach(testFn => {
        const result = testFn(valueLambda());
        if (!result.valid) {
          addError(name, result.errorKey);
          invalid = true;
        }
      });
    }

    if (!invalid) {
      return submit();
    }
  }, [addError, clearErrors]);

  const formPacket = useMemo(() => ({ errors, isError, removeError, registerValidator, doSubmit }), [errors, isError, removeError, doSubmit]);

  return (
    <form onSubmit={formSubmit}>
      <FormContext.Provider value={formPacket}> {children}</FormContext.Provider>
    </form>
  );
};

export const Input: FC<any> = forwardRef((props, ref) => {
  const _ref = useRef(null);
  const { name, className = "", onChange, validate: validateOriginal, ...rest } = props;
  const { isError, removeError, registerValidator } = useContext(FormContext);

  const validationFunctions: any[] = useMemo(() => validateOriginal, [validateOriginal]);

  const inputRef: any = ref || _ref;
  const onChangeFn = evt => {
    if (onChange) {
      onChange(evt);
    }

    if (isError(name)) {
      for (let fn of validationFunctions) {
        let result = fn(evt.target.value);
        if (result.valid) {
          removeError(name, result.errorKey);
        }
      }
    }
  };

  useLayoutEffect(() => {
    registerValidator(name, true, () => inputRef.current.value, validationFunctions);
  }, [validationFunctions]);

  return <input className={cn(className, "form-control", { error: isError(name) })} onChange={onChangeFn} ref={inputRef} {...rest} />;
});

export const validateAll = (...rules) => rules.reduce(([rule], rules) => (rules.push(rule), rules), []);

export const required = [val => ({ errorKey: "required", valid: !!val.trim() })];
export const minLength = len => [val => ({ errorKey: "minLength", valid: !val.trim() || val.trim().length >= len })];

export const Error: FC<any> = ({ name, errorKey, children }) => {
  const { errors } = useContext(FormContext);

  if (errors[name]) {
    if (errorKey == null || errors[name][errorKey]) {
      return children;
    }
  }

  return null;
};

export const Errors = ({ children }) => {
  const { errors } = useContext(FormContext);

  return children(errors);
};

export const SubmitButton: FC<any> = props => {
  const { doSubmit } = useContext(FormContext);

  return <ActionButton {...props} onClick={doSubmit} />;
};
