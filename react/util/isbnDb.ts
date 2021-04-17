export const getBookInfo = isbn => {
  return fetch(`${process.env.ISBN_DB_PROXY}/book/`, {
    method: "post",
    mode: "cors",
    body: JSON.stringify({ isbn })
  }).then(resp => resp.json());
};
