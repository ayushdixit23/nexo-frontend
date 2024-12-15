// components/ShimmerLoader.tsx
const ShimmerChats = () => {
  return (
    <main className="flex-grow bg-white p-6 overflow-y-auto">
      {Array(2)
        .fill({})
        .map((_, index) => {
          return (
            <div key={index}>
              <div className="flex justify-center items-center">
                <div className="text-center animate-pulse w-[250px] rounded-md h-4 bg-gray-100 font-semibold mb-4 text-sm text-gray-500"></div>
              </div>

              {Array(5)
                .fill({})
                .map((_, shimmerIndex) => {
                  return (
                    <div key={shimmerIndex} className="flex flex-col w-full">
                      <div className={`mb-6`}>
                        <div
                          className={`flex max-w-[60%] space-x-3 items-start`}
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <div className="w-full h-full animate-pulse bg-gray-100"></div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <p
                              className={`text-xs flex text-gray-500 animate-pulse bg-gray-100 w-[90px] h-3.5 rounded-lg items-center font-medium  `}
                            >
                              <span className="text-sm font-semibold -ml-[1px]"></span>
                            </p>
                            <div className={`bg-gray-100 p-2 px-4 rounded-lg`}>
                              <p className=" animate-pulse bg-gray-100 w-[200px] h-5"></p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`mb-6 flex justify-end`}>
                        <div className={`flex space-x-3 max-w-[60%] `}>
                          <div className="flex flex-col justify-end items-end gap-1">
                            <p
                              className={`text-xs flex justify-end bg-gray-100 w-[90px] h-3.5 rounded-lg items-center font-medium  text-gray-500`}
                            >
                              <span className="text-sm font-semibold -ml-[1px]"></span>
                            </p>
                            <div className={"bg-gray-100 p-2 px-4 rounded-lg"}>
                              <p className=" animate-pulse bg-gray-100 w-[200px] h-5"></p>
                            </div>
                          </div>

                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <div className="w-full h-full animate-pulse bg-gray-100"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })}
    </main>
  );
};

export default ShimmerChats;
