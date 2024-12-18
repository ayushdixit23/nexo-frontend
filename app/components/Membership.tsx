import React from "react";
import Hover from "./Hover";
import { RxCross2 } from "react-icons/rx";

const Membership = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <div className="fixed inset-0 w-screen z-40 flex justify-center h-screen bg-black/50 items-center backdrop:blur-md">
        <div className="md:w-[67%] w-[80%] flex-col h-[80%] md:h-auto p-5 flex rounded-lg bg-white justify-center items-center">
          <div className="flex justify-end items-end w-full">
            <div className="flex justify-end cursor-pointer items-end">
              <RxCross2 onClick={() => setIsOpen(false)} className="text-2xl" />
            </div>
          </div>
          <div className="flex justify-center w-full h-full max-h-[100%] overflow-y-scroll no-scrollbar items-center ">
            <div
              id="plans"
              className="grid h-full pn:max-sm:gap-10 sm:max-md:gap-4 md:gap-0 md:grid-cols-4 w-full lg:w-[98%]"
            >
              <div className="hidden md:block">
                <div>
                  <div className="h-[290px] px-2 font-semibold z-40 text-sm border-b border-[#E6E9F5]/10 flex justify-start items-center">
                    <div className="flex flex-col gap-2 p-8 px-4 sm:mt-0">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl ">Compare plans</div>
                      </div>
                      <div>
                        14 days unlimited free trial. No contract or credit card
                        required.
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex border-b bg-[#FFFBF3] border-[#E6E9F5]/10 px-4 font-semibold text-sm items-center h-[71px]">
                      <Hover
                        color={"bg-[#1b2431] text-white"}
                        text={"Storage"}
                        para={
                          "Gain instant recognition and establish trust within your communities and with potential customers."
                        }
                        w2={"sm:w-[350px]"}
                      />
                    </div>
                    <div className="flex border-b border-[#E6E9F5]/10 px-4 font-semibold text-sm items-center h-[71px]">
                      <Hover
                        color={"bg-[#1b2431] text-white"}
                        text={"Members/ Team"}
                        para={
                          "Send direct messages to any user  in chat conversations without needing a request."
                        }
                        w2={"sm:w-[350px]"}
                      />
                    </div>
                    <div className="bg-[#FFFBF3] flex border-b border-[#E6E9F5]/10 px-4 font-semibold text-sm items-center h-[71px]">
                      <Hover
                        color={"bg-[#1b2431] text-white"}
                        text={"Data Control"}
                        para={
                          " Get a personalized domain name like username.grovyo.com /Free Option: Create a custom profile URL with grovyo.com/username"
                        }
                        w2={"sm:w-[350px]"}
                      />
                    </div>
                    <div className="flex border-b border-[#E6E9F5]/10 px-4 font-semibold text-sm items-center h-[71px]">
                      <Hover
                        color={"bg-[#1b2431] text-white"}
                        text={"Customer Support (24 hrs) "}
                        para={
                          " Get a personalized domain name like username.grovyo.com /Free Option: Create a custom profile URL with grovyo.com/username"
                        }
                        w2={"sm:w-[350px]"}
                      />
                    </div>
                    <div className="bg-[#FFFBF3] flex border-b border-[#E6E9F5]/10 px-4 font-semibold text-sm items-center h-[71px]">
                      <Hover
                        color={"bg-[#1b2431] text-white"}
                        text={"Team"}
                        para={
                          " Get a personalized domain name like username.grovyo.com /Free Option: Create a custom profile URL with grovyo.com/username"
                        }
                        w2={"sm:w-[350px]"}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* free */}
              <div className=" ">
                <div>
                  <div className="h-[290px] px-2 border-b border-[#E6E9F5]/10 flex justify-start w-full z-20 items-center">
                    <div className="flex flex-col w-full sm:mt-0 p-8 px-4 h-full-end gap-2">
                      <div className="flex justify-center px-4 mt-2 items-center gap-3">
                        <div className="flex flex-col w-[90%] gap-6 justify-normal">
                          <div>
                            <div className="font-bold text-lg">Free</div>

                            <div className="font-semibold text-4xl mt-2">
                              ₹0
                            </div>
                            <span className="text-sm">forever</span>
                          </div>

                          <div className="w-full flex mt-3 ">
                            <div className="p-2 px-6 text-xs font-medium rounded-3xl border">
                              Choose Plan
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <>
                    <div>
                      <div className="border-b border-[#E6E9F5]/10 bg-[#FFFBF3] flex justify-between md:justify-center text-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Storage"}
                            para={
                              "Gain instant recognition and establish trust within your communities and with potential customers."
                            }
                          />
                        </div>
                        <div className="text-center">15GB </div>
                      </div>
                      <div className=" border-b border-[#E6E9F5]/10 flex justify-between md:justify-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Members/ Team"}
                            para={
                              "Send direct messages to any user  in chat conversations without needing a request."
                            }
                          />
                        </div>
                        <div>10</div>
                      </div>
                      <div className="bg-[#FFFBF3] border-b border-[#E6E9F5]/10 flex justify-between md:justify-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Data Control"}
                            para={
                              " Get a personalized domain name like username.grovyo.com /Free Option: Create a custom profile URL with grovyo.com/username"
                            }
                          />
                        </div>
                        <div>Not available </div>
                      </div>
                      <div className=" border-b border-[#E6E9F5]/10 flex justify-between md:justify-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Customer Support (24 hrs) "}
                            para={
                              " Get a personalized domain name like username.grovyo.com /Free Option: Create a custom profile URL with grovyo.com/username"
                            }
                          />
                        </div>
                        <div>Not available </div>
                      </div>
                      <div className="bg-[#FFFBF3] border-b border-[#E6E9F5]/10 flex justify-between md:justify-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Team"}
                            para={
                              " Get a personalized domain name like username.grovyo.com /Free Option: Create a custom profile URL with grovyo.com/username"
                            }
                          />
                        </div>
                        <div>2 </div>
                      </div>
                    </div>
                  </>
                </div>
              </div>

              {/* plus */}
              <div className="">
                <div>
                  <div className="h-[290px] px-2 border-b border-[#E6E9F5]/10 flex justify-start z-20 items-center">
                    <div className="flex flex-col w-full sm:mt-0 px-4 py-8 bg-[#FFC248] rounded-xl h-full-end gap-2">
                      <div className="flex justify-center mt-2 px-4 items-center gap-3">
                        <div className="flex flex-col w-[90%] gap-6 justify-normal">
                          <div>
                            <div className="font-bold text-lg">Plus</div>

                            <div className="font-semibold text-4xl mt-2">
                              ₹500
                            </div>
                            <span className="text-sm">per month</span>
                          </div>

                          <div className="w-full flex mt-3 ">
                            <div className="p-2 px-6 bg-white text-black text-xs font-medium rounded-3xl border">
                              Choose Plan
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <>
                    <div>
                      <div className="bg-[#FFFBF3] border-b border-[#E6E9F5]/10 flex justify-between md:justify-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Storage"}
                            para={
                              "Gain instant recognition and establish trust within your communities and with potential customers."
                            }
                          />
                        </div>
                        <div>70GB</div>
                      </div>
                      <div className=" border-b border-[#E6E9F5]/10 flex justify-between md:justify-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Members/ Team"}
                            para={
                              "Send direct messages to any user  in chat conversations without needing a request."
                            }
                          />
                        </div>
                        <div>15</div>
                      </div>
                      <div className="bg-[#FFFBF3] border-b border-[#E6E9F5]/10 flex justify-between md:justify-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Data Control"}
                            para={
                              " Get a personalized domain name like username.grovyo.com /Free Option: Create a custom profile URL with grovyo.com/username"
                            }
                          />
                        </div>
                        <div>Available </div>
                      </div>
                      <div className=" border-b border-[#E6E9F5]/10 flex justify-between md:justify-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Customer Support (24 hrs) "}
                            para={
                              " Get a personalized domain name like username.grovyo.com /Free Option: Create a custom profile URL with grovyo.com/username"
                            }
                          />
                        </div>
                        <div>Available </div>
                      </div>
                      <div className="bg-[#FFFBF3] border-b border-[#E6E9F5]/10 flex justify-between md:justify-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Team"}
                            para={
                              " Get a personalized domain name like username.grovyo.com /Free Option: Create a custom profile URL with grovyo.com/username"
                            }
                          />
                        </div>
                        <div>10</div>
                      </div>
                    </div>
                  </>
                </div>
              </div>

              {/* pro */}
              <div className="">
                <div>
                  <div className="h-[290px] px-2 border-b border-[#E6E9F5]/10 flex justify-start z-20  items-center">
                    <div className="flex flex-col w-full sm:mt-0 p-8 px-4 h-full-end gap-2">
                      <div className="flex justify-center mt-2 px-4 items-center gap-3">
                        <div className="flex flex-col w-[90%] gap-6 justify-normal">
                          <div>
                            <div className="font-bold text-lg">Pro</div>

                            <div className="font-semibold text-4xl mt-2">
                              ₹1000
                            </div>
                            <span className="text-sm">per month</span>
                          </div>

                          <div className="w-full flex mt-3 ">
                            <div className="p-2 px-6 text-xs font-medium rounded-3xl border">
                              Choose Plan
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <>
                    <div>
                      <div className="bg-[#FFFBF3] border-b border-[#E6E9F5]/10 flex justify-between md:justify-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Storage"}
                            para={
                              "Gain instant recognition and establish trust within your communities and with potential customers."
                            }
                          />
                        </div>
                        <div>200GB</div>
                      </div>
                      <div className="border-b border-[#E6E9F5]/10 flex justify-between md:justify-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Members/ Team"}
                            para={
                              "Send direct messages to any user  in chat conversations without needing a request."
                            }
                          />
                        </div>
                        <div>25</div>
                      </div>
                      <div className="bg-[#FFFBF3] border-b border-[#E6E9F5]/10 flex justify-between md:justify-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Data Control"}
                            para={
                              " Get a personalized domain name like username.grovyo.com /Free Option: Create a custom profile URL with grovyo.com/username"
                            }
                          />
                        </div>
                        <div>Available </div>
                      </div>
                      <div className="border-b border-[#E6E9F5]/10 flex justify-between md:justify-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Customer Support (24 hrs) "}
                            para={
                              " Get a personalized domain name like username.grovyo.com /Free Option: Create a custom profile URL with grovyo.com/username"
                            }
                          />
                        </div>
                        <div>Available</div>
                      </div>
                      <div className="bg-[#FFFBF3] border-b border-[#E6E9F5]/10 flex justify-between md:justify-center px-4 font-semibold text-sm items-center h-[71px]">
                        <div className="md:hidden block">
                          <Hover
                            color={"bg-[#1b2431] text-white"}
                            text={"Team"}
                            para={
                              " Get a personalized domain name like username.grovyo.com /Free Option: Create a custom profile URL with grovyo.com/username"
                            }
                          />
                        </div>
                        <div>50</div>
                      </div>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Membership;
