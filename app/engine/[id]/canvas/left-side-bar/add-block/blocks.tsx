import { TbSection } from "react-icons/tb";
import {
  BsTextParagraph,
  BsFillCursorFill,
  BsFiletypeSvg,
} from "react-icons/bs";
import { GoHeading, GoListUnordered, GoRows, GoColumns } from "react-icons/go";
import {} from "react-icons/go";
import { MdGridOn, MdOutlineAudiotrack } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import { LuTextCursorInput } from "react-icons/lu";
import { CiImageOn, CiVideoOn } from "react-icons/ci";

export const blocks = {
  Structure: [
    {
      icon: <TbSection />,
      title: "Section",
      blockData: ["div", { style: { padding: "10px" } }, []],
    },
    {
      icon: <GoColumns />,
      title: "Columns",
      blockData: [
        "div",
        {
          style: {
            padding: "10px",
            display: "flex",
            flexDirection: "column",
          },
        },
        [],
      ],
    },
    {
      icon: <GoRows />,
      title: "Rows",
      blockData: [
        "div",
        {
          style: {
            padding: "10px",
            display: "flex",
          },
        },
        [],
      ],
    },
    {
      icon: <MdGridOn />,
      title: "Grid",
      blockData: ["div", { style: { padding: "5px", display: "grid" } }, []],
    },
  ],
  Content: [
    {
      icon: <GoHeading />,
      title: "Heading",
      blockData: ["h1", { contentEditable: true }, ["Heading"]],
    },
    {
      icon: <BsTextParagraph />,
      title: "Paragraph",
      blockData: ["p", { contentEditable: true }, ["Paragraph"]],
    },
    {
      icon: <BsTextParagraph />,
      title: "Text",
      blockData: ["span", { contentEditable: true }, ["Rich text"]],
    },
    {
      icon: <GoListUnordered />,
      title: "List",
      blockData: ["ul", { contentEditable: true }, ["List"]],
    },
  ],
  Actions: [
    {
      icon: <BsFillCursorFill />,
      title: "Button",
      blockData: ["button", { contentEditable: true }, ["Button"]],
    },
    {
      icon: <IoIosLink />,
      title: "Link",
      blockData: ["a", { contentEditable: true }, ["Link"]],
    },
    {
      icon: <LuTextCursorInput />,
      title: "Input",
      blockData: ["input", { placeholder: "Input" }, [""]],
    },
  ],
  Media: [
    {
      icon: <CiImageOn />,
      title: "Image",
      blockData: ["img", { src: "", alt: "Image" }, []],
    },
    {
      icon: <BsFiletypeSvg />,
      title: "Icon",
      blockData: ["i", { className: "" }, []],
    },
    {
      icon: <CiVideoOn />,
      title: "Video",
      blockData: ["video", {}, [["source", {}, []]]],
    },
    {
      icon: <MdOutlineAudiotrack />,
      title: "Audio",
      blockData: ["audio", {}, [["source", {}, []]]],
    },
  ],
};
