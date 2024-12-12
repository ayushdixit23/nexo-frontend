import axios from "axios";
import toast from "react-hot-toast";

interface UploadFileProps {
  presignedUrl: string;
  file: File;
  setProgress: (progress: number) => void;
}

const uploadFile = async ({
  presignedUrl,
  file,
  setProgress,
}: UploadFileProps) => {
  try {

    const uploadResponse = await axios.put(presignedUrl, file, {
      // Consider removing the Content-Type if it's not required by the server
      headers: {
        // "Content-Type": file.type, // You may need to remove this or adjust it
      },
      onUploadProgress: (event) => {
        if (event.lengthComputable) {
          //@ts-ignore
          const percent = (event.loaded / event.total) * 100;
          setProgress(percent); // Update progress
        }
      },
      timeout: 120000,
    });

    if (uploadResponse.status === 200) {
     
      return true
    } else {
      toast.error(`File upload failed with status: ${uploadResponse.status}`);
      return false
    }
  } catch (error: any) {
    if (error.response) {
      // Check and log the error details from the server response
      console.log("Response error:", error.response.data);
      toast.error(
        `Upload failed: ${error.response.data.message || "Unknown error"}`
      );
    } else if (error.request) {
      // The request was made but no response received
      toast.error("No response from server, upload failed.");
    } else {
      // Something else went wrong
      toast.error(`Error: ${error.message}`);
    }
    return false
  }
};

export default uploadFile;
