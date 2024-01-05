import React from "react";

const Loader = ({ done }: { done: boolean }) => {
  return (
    <div
      id="loader"
      style={{ display: done === true ? "none" : "block" }}
    ></div>
  );
};
export default Loader;
