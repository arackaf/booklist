import { useState } from "react";

type Fn = () => any;

export default (deleteLambda): [Fn, Fn, Fn, boolean, boolean] => {
  const [pendingDelete, setPendingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const doDelete = () => {
    setDeleting(true);
    return Promise.resolve(deleteLambda()).then(() => setDeleting(false));
  };

  const startDelete = () => setPendingDelete(true) as any;
  const cancelDelete = () => setPendingDelete(false) as any;

  return [startDelete, cancelDelete, doDelete, pendingDelete, deleting];
};
