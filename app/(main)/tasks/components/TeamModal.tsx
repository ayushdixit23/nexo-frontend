import React from "react";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { RiSearch2Line } from "react-icons/ri";
import { RxCrossCircled } from "react-icons/rx";

const TeamModal = ({
  setTeamTasks,
  task,
  setTask,
  sendTeamTask,
  selectedTeams,
  setSelectedTeams,
  handleTeamIdAddition,
  teams,
}: {
  setTeamTasks: any;
  task: any;
  setTask: any;
  sendTeamTask: any;
  selectedTeams: any;
  setSelectedTeams: any;
  handleTeamIdAddition: any;
  teams: any;
}) => {
  return (
    <div className="flex md:w-[30%] w-[90%] pp:w-[70%] sm:flex-row flex-col shadow-md gap-3 bg-[#FAF9F6] p-3 rounded-xl h-auto">
      <div className="flex min-w-[300px] pn:max-sm:order-2 bg-white p-4 flex-col gap-5 rounded-xl">
        <div className="flex justify-between py-1 items-center w-full">
          <div className="text-[#121212] font-semibold">Add New Task</div>
          <div className="cursor-pointer" onClick={() => setTeamTasks(false)}>
            <RxCrossCircled className="text-xl text-black" />
          </div>
        </div>
        <div>
          <textarea
            name=""
            cols={30}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            rows={10}
            className="w-full min-h-[150px] h-[150px] max-h-[200px] rounded-xl border p-2 text-sm border-[#FFC977] shadow-md outline-none"
            id=""
          ></textarea>
        </div>
        <div className="flex justify-center items-center font-medium gap-3 text-sm">
          <button
            onClick={() => {
              setTask("");
              setTeamTasks(false);
              setSelectedTeams([]);
            }}
            className="text-center p-3 px-5 rounded-full w-full border "
          >
            Cancel
          </button>
          <button
            onClick={sendTeamTask}
            className="text-center p-3 px-5 rounded-full w-full bg-[#FFC248]"
          >
            Save Task
          </button>
        </div>
      </div>

      <div className=" flex min-w-[300px] pn:max-sm:order-1 flex-col gap-3 h-auto">
        <div className="flex p-4 rounded-xl bg-white items-center gap-2">
          <MdOutlinePersonAddAlt1 />
          <div>Assign task to</div>
        </div>
        <div className="flex flex-col gap-4 justify-center p-4 px-3 rounded-xl bg-white items-center">
          <div className="flex rounded-xl text-[12px] w-full bg-[#FFF8EB] items-center p-2">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent outline-none px-1  text-black text-sm"
            />
            <RiSearch2Line className="text-black text-[20px] mr-2" />
          </div>
          <div className="w-full flex mt-2 flex-col gap-5 overflow-y-scroll no-scrollbar max-h-[150px]">
            <>
              {teams.length > 0 ? (
                <>
                  {teams?.map((team: any, index: number) => {
                    return (
                      <div
                        onClick={() => handleTeamIdAddition(team.id)}
                        className={`rounded-xl ${
                          selectedTeams.includes(team.id)
                            ? "bg-[#FFC977]"
                            : "bg-white"
                        } flex justify-between items-center`}
                        key={index}
                      >
                        <div className="flex py-2 px-3 items-center gap-1">
                          <div className="flex items-center gap-3">
                            <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full bg-yellow-500 overflow-hidden">
                              <div className="text-white font-semibold">
                                {team?.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-0.5">
                            <div className="text-sm font-semibold">
                              {team.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  <div className="flex justify-center items-center w-full h-full">
                    <div className="w-[90%] flex flex-col justify-center items-center">
                      <div className="flex justify-center items-center gap-3">
                        <div className=" font-semibold">No Teams Found </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
