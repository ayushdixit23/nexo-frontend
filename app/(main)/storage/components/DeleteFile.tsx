import React from "react";
import { Storage } from "../page";

const DeleteFile = ({
  selectedStorage,
  setOpenDeleteModal,
  handleDeleteStorage,
}: {
  selectedStorage: Storage | null;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteStorage: () => Promise<void>;
}) => {
  return (
    <div className="fixed inset-0 flex z-40 justify-center items-center h-screen bg-black/60 backdrop:blur-md">
      <div className="md:w-1/3 w-[90%] pp:w-[70%] rounded-lg shadow-lg bg-white my-3">
        <div className="flex justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <span className="font-semibold text-gray-700 text-lg">
              Delete File
            </span>
          </div>
          <div>
            <button>
              <i className="fa fa-times-circle text-red-500 hover:text-red-600 transition duration-150"></i>
            </button>
          </div>
        </div>

        <div className="px-5 pt-4 font-medium text-gray-600">
          Are you sure you want to delete {selectedStorage?.filename}?
        </div>

        <div className="px-5 py-4 gap-3 flex justify-end">
          <button
            onClick={() => setOpenDeleteModal(false)}
            className="text-sm py-2 px-5 border bg-white font-medium rounded-sm text-black transition duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteStorage}
            className="text-sm py-2 px-5 bg-red-600 font-medium rounded-sm text-white transition duration-150"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFile;
