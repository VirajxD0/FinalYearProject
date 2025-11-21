import React from "react";

export default function Section({ id, title, children }) {
  return (
    <section id={id} className="panel flex row" style={{ width: "100%" }}>
      {children}
    </section>
  );
}
