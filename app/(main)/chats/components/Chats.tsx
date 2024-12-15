import Image from "next/image";
import React from "react";
import ShimmerChats from "./ShimmerChats";

const Chats = ({
  messages,
  data,
  loading,
}: {
  messages: any;
  data: any;
  loading: boolean;
}) => {
  return (
    <>
      {loading ? (
        <ShimmerChats />
      ) : (
        <main className="flex-grow bg-white p-2 pp:p-4 sm:p-6 overflow-y-auto">
          {Object.keys(messages).map((date, index) => {
            const dateFormatted = new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <div key={index}>
                <div className="text-center font-semibold mb-4 text-sm text-gray-500">
                  {dateFormatted}
                </div>

                {messages[date].map((msg: any, index: number) => {
                  const isSender = msg.senderid.id === data?.id;
                  const time = new Date(msg.date).toLocaleTimeString();
                  const userName = msg.senderid.fullname;
                  const profilePic = msg.senderid.profilepic;

                  return (
                    <div
                      key={index}
                      className={`mb-7 mt-7 ${isSender ? "flex justify-end" : ""}`}
                    >
                      <div
                        className={`flex max-w-[200px] sm:max-w-[60%] ${
                          isSender ? " space-x-3" : "space-x-3 items-start"
                        }`}
                      >
                        {!isSender && (
                          <div className="sm:min-w-10 sm:min-h-10 sm:max-w-10 sm:max-h-10 min-w-8 min-h-8 max-w-8 max-h-8 rounded-full overflow-hidden">
                            <Image
                              src={profilePic || ""}
                              alt={userName || ""}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex flex-col gap-1">
                          <p
                            className={`text-xs flex items-center font-medium ${
                              isSender && "justify-end"
                            }  text-gray-500`}
                          >
                            <span className="sm:text-sm text-xs font-semibold -ml-[1px]">
                              {userName} ·
                            </span>{" "}
                            {time}
                          </p>
                          <div
                            className={
                              isSender
                                ? "bg-[#FFC977] w-auto p-2 px-3 sm:px-4 rounded-lg"
                                : "bg-gray-100 p-2 px-3 sm:px-4 rounded-lg"
                            }
                          >
                            <p className="text-[15px] font-semibold">
                              {msg.message}
                            </p>
                          </div>
                        </div>

                        {isSender && (
                          <div className="sm:min-w-10 sm:min-h-10 sm:max-w-10 sm:max-h-10 min-w-8 min-h-8 max-w-8 max-h-8 rounded-full overflow-hidden">
                            <Image
                              src={profilePic || ""}
                              alt={userName || ""}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </main>
      )}
    </>
  );
};
export default Chats;
