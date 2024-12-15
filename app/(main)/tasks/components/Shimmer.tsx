import ShimmerUser from "@/app/components/ShimmerUser";

// ShimmerLoader.jsx
const ShimmerLoader = ({
  className = "bg-white flex flex-col gap-4 p-6 rounded-xl",
  hide,
}: {
  className?: string;
  hide?: boolean;
}) => {
  const shimmerStyle = "bg-gray-200 animate-pulse";

  return (
    <div className={`${className} animate-pulse`}>
      <div className="flex justify-between items-center w-full">
        <ShimmerUser shimmerStyle={shimmerStyle} />
        {!hide && <div className={`w-[60px] h-4 ${shimmerStyle}`} />}
      </div>
      {!hide && <div className={`w-full h-12 ${shimmerStyle} rounded-lg`} />}
    </div>
  );
};

export default ShimmerLoader;
