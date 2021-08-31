import React from "react";

export default function ShowBooks(props) {
  return (
    <div>
      {props.books.map(b => (
        <h1>{b.title}</h1>
      ))}
    </div>
  );
}
