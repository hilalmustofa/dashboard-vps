import React, { CSSProperties } from "react";
import { BarLoader } from "react-spinners";

interface LoadingProps {
  loading: boolean;
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ loading, color = "#7B6CF0" }) => {
  const override: CSSProperties = {
    display: "block",
    top: "30vh",
    margin: "0 auto",
  };

  return (
    <BarLoader
      color={color}
      loading={loading}
      cssOverride={override}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Loading;
