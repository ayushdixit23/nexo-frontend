import React from "react";

const ChatsInput = ({
  message,
  setMessage,
  sendMessage,
}: {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (e: React.FormEvent) => void;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.trim()) {
      e.preventDefault(); // Prevents the default action (like form submission)
      sendMessage(e as React.FormEvent); // Call sendMessage
    }
  };

  return (
    <footer className="p-4 bg-white border-t">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onKeyDown={handleKeyDown}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message..."
          className="flex-grow p-2 px-4 rounded-lg outline-none text-sm border border-gray-300"
        />
        <button
          onClick={sendMessage}
          className="bg-[#FFC977] px-6 py-2 text-sm rounded-lg"
        >
          Send
        </button>
      </div>
    </footer>
  );
};

export default ChatsInput;
