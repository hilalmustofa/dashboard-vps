import React, { CSSProperties } from "react";
import { SyncLoader } from "react-spinners";

interface SyncLoadingProps {
  loading: boolean;
  color?: string;
}

const SyncLoading: React.FC<SyncLoadingProps> = ({ loading, color = "#7B6CF0" }) => {
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
  };

  return (
    <SyncLoader
      color={color}
      loading={loading}
      cssOverride={override}
      size={10}
      margin={5}
      aria-label="Loading Spinner"
      data-testid="sync-loader"
    />
  );
};

export default SyncLoading;
