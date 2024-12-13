import axios from "axios";
import toast from "react-hot-toast";

export const errorHandler = (error: Error | any) => {
  // console.log(error);
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

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return new Date(date).toLocaleDateString("en-GB", options); // 'en-GB' gives us day month year format
};

export function groupMessagesByDate(messages: any) {
  return messages.reduce((acc: any, msg: any) => {
    const dateStr = new Date(msg.date).toISOString().split("T")[0]; // Extract date in YYYY-MM-DD format
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(msg);
    return acc;
  }, {});
}
