import React from "react";

const CreateTeam = ({
  setTeamPopUp,
  isCreating,
  handleCreateTeam,
}:{
  setTeamPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  isCreating: boolean;
  handleCreateTeam: (e: React.FormEvent) => Promise<void>;
}) => {
  const [teamName, setTeamName] = React.useState("");
  return (
    <div className="fixed inset-0 flex z-40 justify-center items-center h-screen bg-black/60 backdrop:blur-md">
      <div className="md:w-[30%] w-[90%] sm:w-[70%] flex shadow-md flex-col gap-6 bg-white p-4 rounded-xl h-auto">
        <div className="font-bold">Create Team</div>
        <div className="flex flex-col">
          <div className="font-semibold text-[#3A3D46] text-xs uppercase">
            Team name
          </div>
          <div>
            <input
              type="text"
              name="fullname"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full text-sm py-2 border-b border-gray-300 outline-none "
            />
          </div>
        </div>
        <div className="flex justify-center items-center font-medium gap-3 text-sm">
          <button
            onClick={() => setTeamPopUp(false)}
            className="text-center p-2 px-4 rounded-lg w-full border "
          >
            Cancel
          </button>
          <button
            disabled={isCreating}
            onClick={handleCreateTeam}
            className="text-center p-2 px-4 rounded-lg text-white w-full bg-[#E48700]"
          >
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
