import React from "react";
import { RxCrossCircled } from "react-icons/rx";

const MyTaskModal = ({
  sendIndividualTask,
  task,
  setTask,
  setIsMytasks,
}: {
  sendIndividualTask: () => void;
  task: string;
  setTask: React.Dispatch<React.SetStateAction<string>>;
  setIsMytasks: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="md:w-[30%] w-[90%] pp:w-[70%] flex shadow-md flex-col gap-5 bg-white p-4 rounded-xl h-auto">
      <div className="flex justify-between py-1 items-center w-full">
        <div className="text-[#121212] font-semibold">Add New Task</div>
        <div className="cursor-pointer" onClick={() => setIsMytasks(false)}>
          <RxCrossCircled className="text-xl text-black" />
        </div>
      </div>
      <div>
        <textarea
          name=""
          cols={30}
          rows={10}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full min-h-[150px] h-[150px] max-h-[200px] rounded-xl border p-2 text-sm border-[#FFC977] shadow-md outline-none"
          id=""
        ></textarea>
      </div>
      <div className="flex justify-center items-center font-medium gap-3 text-sm">
        <button
          onClick={() => setIsMytasks(false)}
          className="text-center p-3 px-5 rounded-full w-full border "
        >
          Cancel
        </button>
        <button
          onClick={sendIndividualTask}
          className="text-center p-3 px-5 rounded-full w-full bg-[#FFC248]"
        >
          Save Task
        </button>
      </div>
    </div>
  );
};

export default MyTaskModal;
