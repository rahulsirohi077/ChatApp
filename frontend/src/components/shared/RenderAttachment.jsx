import React from "react";
import { transFormImage } from "../../lib/feature";
import { FileOpen as FileOpenIcon  } from "@mui/icons-material";

const RenderAttachment = (file, url) => {
  switch (file) {
    case "video":
      return <video src={url} controls preload="none" width={"200px"} />;
    case "image":
      return <img
        src={transFormImage(url, 200)}
        alt="Attachment"
        width={"200px"}
        height={"150px"}
        style={{
          objectFit: "contain",
        }}
      />;
      case "audio":
        return <audio src={url} controls preload="none" />;
    
    default:
      return <FileOpenIcon />;
  }
};

export default RenderAttachment;
