import React from "react";

const ShimmerUser = ({ shimmerStyle }: { shimmerStyle: string }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-[45px] h-[45px] ${shimmerStyle} rounded-full`} />
      <div className="space-y-0.5">
        <div className={`w-[120px] h-4 ${shimmerStyle}`} />
        <div className={`w-[100px] h-3 ${shimmerStyle}`} />
      </div>
    </div>
  );
};

export default ShimmerUser;
