import Image from "next/image";
import React, { useState } from "react";
import ImageViewer from "./ImageViewer";

const UserProfile = ({
  userName,
  userPic,
  paraText,
}: {
  userName: string;
  userPic: string;
  paraText?: string;
}) => {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <>
      {isClicked && (
        <ImageViewer setIsClicked={setIsClicked} src={userPic} alt={userName} />
      )}

      <div className="flex items-center gap-3">
        <div className="w-[40px] h-[40px] overflow-hidden">
          <Image
            onClick={() => setIsClicked(true)}
            className="w-full h-full cursor-pointer object-cover shadow-sm rounded-full"
            src={userPic}
            alt={userName}
            width={40}
            height={40}
          />
        </div>

        <div className="space-y-0.5">
          <div className="text-sm font-semibold">{userName}</div>

          {paraText && (
            <p className="text-xs font-medium text-muted-foreground">
              {paraText}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
