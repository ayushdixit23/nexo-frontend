import axios from "axios";
import toast from "react-hot-toast";

export const errorHandler = (error: Error | any) => {
  console.log(error);
  if (axios.isAxiosError(error)) {
    if (error.response) {
      toast.error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      toast.error("Network error. Please try again later.");
    } else {
      toast.error("An error occurred. Please try again.");
    }
  } else {
    toast.error("Unexpected error occurred.");
  }
};

export const truncatetext = (text: string, limit: number) => {
  return text.length <= limit ? text : text.slice(0, limit) + "...";
};

export const formatDate = (isoDate: any) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
