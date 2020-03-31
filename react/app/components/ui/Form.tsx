import React, { forwardRef, useRef, FC } from "react";

export const Form = ({ submit, children }) => {
  const doSubmit = evt => {
    evt.preventDefault();
    submit();
  };

  return <form onSubmit={doSubmit}>{children}</form>;
};

export const Input: FC<any> = forwardRef((props, ref) => {
  let _ref = useRef(null);
  let { ...rest } = props;

  let inputRef: any = ref || _ref;

  return <input ref={inputRef} {...rest} />;
});
