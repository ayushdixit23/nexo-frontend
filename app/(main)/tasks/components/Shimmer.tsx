// ShimmerLoader.jsx
const ShimmerLoader = ({
  className = "bg-white flex flex-col gap-4 p-6 rounded-xl",
}: {
  className?: string;
}) => {
  const shimmerStyle = "bg-gray-200 animate-pulse";

  return (
    <div className={`${className} animate-pulse`}>
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className={`w-[45px] h-[45px] ${shimmerStyle} rounded-full`} />
          <div className="space-y-0.5">
            <div className={`w-[120px] h-4 ${shimmerStyle}`} />
            <div className={`w-[100px] h-3 ${shimmerStyle}`} />
          </div>
        </div>
        <div className={`w-[60px] h-4 ${shimmerStyle}`} />
      </div>
      <div className={`w-full h-12 ${shimmerStyle} rounded-lg`} />
    </div>
  );
};

export default ShimmerLoader;
