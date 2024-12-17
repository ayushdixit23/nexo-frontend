import Image from "next/image";
import React from "react";
import { RxCross2 } from "react-icons/rx";
import { Members } from "../page";
import { IoRemoveSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { UserData } from "@/app/(utilities)/utils/auth";

const AddMemberModal = ({
  selectedTeam,
  setAddMembersPopup,
  data,
  handleMemberClick,
  operation,
  isCreating,
  handleAddMembers,
}: {
  selectedTeam: any
  setAddMembersPopup: React.Dispatch<React.SetStateAction<boolean>>;
  data: UserData | null;
  handleMemberClick: (id: string, isJoined: boolean) => void;
  operation: {
    addMembers: string[];
    removeMembers: string[];
  };
  isCreating: boolean;
  handleAddMembers: () => Promise<void>;
}) => {
  return (
    <div className="fixed inset-0 flex z-40 justify-center items-center h-screen bg-black/60 backdrop:blur-md">
      <div className="md:w-[33%] flex shadow-md flex-col gap-3 bg-white rounded-xl h-auto">
        <div className="flex justify-between border-b items-center p-3 px-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full bg-yellow-500 overflow-hidden">
              <div className="text-white font-semibold">
                {selectedTeam?.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-sm font-semibold">{selectedTeam?.name}</div>
            </div>
          </div>
          <div
            onClick={() => setAddMembersPopup(false)}
            className="cursor-pointer text-xl font-semibold"
          >
            <RxCross2 />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-sm p-1 px-4  font-semibold ">
            Add/Remove Members
          </div>
          <div className="flex flex-col max-h-[200px] overflow-y-scroll no-scrollbar">
            {selectedTeam?.members?.map((member: Members) => (
              <div
                className={`flex justify-between w-full border-b p-3 px-4 items-center gap-1`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-[40px] h-[40px] overflow-hidden">
                    <Image
                      className="w-full h-full cursor-pointer object-cover shadow-sm rounded-full"
                      // @ts-ignore
                      src={member?.profilepic ? member?.profilepic : ""}
                      //@ts-ignore
                      alt={member?.fullname}
                      width={40}
                      height={40}
                    />
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold">
                      {/* @ts-ignore */}
                      {member?.fullname}
                    </div>
                    <div className="text-xs text-gray-500">
                      {/* @ts-ignore */}
                      {member?.email}
                    </div>
                  </div>
                </div>
                {/* @ts-ignore */}

                {selectedTeam.creator.id !== member.id && (
                  <div>
                    {selectedTeam.creator.id == data?.id && (
                      <div
                        onClick={() => {
                          const updatedMember = {
                            ...member,
                            isJoined: !member.isJoined, // Flip the `isJoined` value
                          };

                          handleMemberClick(member.id, updatedMember.isJoined);
                        }}
                        className="text-lg font-semibold cursor-pointer"
                      >
                        {/* {member?.isJoined ? <IoRemoveSharp
                    /> : <IoMdAdd />} */}

                        {operation.addMembers.includes(member.id) ||
                        member.isJoined ? (
                          <IoRemoveSharp className="text-red-500" /> // Show minus (remove) if added or isJoined
                        ) : (
                          <IoMdAdd className="text-blue-500" /> // Show plus (add) if removed
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center w-full items-center gap-3 p-2 text-sm">
            <button
              onClick={() => setAddMembersPopup(false)}
              className="text-center p-2 px-4 w-full rounded-lg border "
            >
              Cancel
            </button>
            <button
              disabled={isCreating}
              onClick={handleAddMembers}
              className="p-2 px-4 rounded-lg w-full text-white bg-[#E48700]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
