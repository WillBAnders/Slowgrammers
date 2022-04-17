import React from "react";
import { ThreeDots } from "react-loader-spinner";

export default function LoadingContainer() {
  return (
    <div className="loadingContainer">
      <ThreeDots type="ThreeDots" color="#00b22d" height={100} width={100} />
    </div>
  );
}
