import { useCallback, useEffect, useState } from "react";
import { DropdownEditor } from "../editors/DropdownEditor";
import { InputEditor } from "../editors/InputEditor";
import { MediaInputEditor } from "../editors/MediaInputEditor";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useEditor } from "@/app/providers/editor-provider";

export type Attributes = { [key: string]: string };
export type AttributeControllersKeys = keyof typeof nativeAttributeControllers;
export const nativeAttributeControllers = {
  ID: {
    Root: ({ attributes, setAttributes }: any) => {
      const editorContext = useEditor();
      if (!editorContext) return;

      const { canvas } = editorContext;

      const { id = "" } = attributes ?? {};
      const [tempID, setTempID] = useState(id);

      const handleSaveID = useCallback(() => {
        if (!canvas.current) return;
        const cavasRoot = canvas.current.shadowRoot;
        if (!cavasRoot) return;
        const exists = cavasRoot.querySelectorAll(
          `[id^="${tempID.replace(/-we-(?!.*-we-).*$/, "")}"]`
        );
        if (exists.length === 0) {
          const anchor = document.getElementById("we-floating-anchor");
          if (!anchor) return;
          const anchorHTML = anchor.children[0].innerHTML.split("-");

          anchor.children[0].innerHTML = `${anchorHTML[0]} - ${tempID.replace(
            /-we-(?!.*-we-).*$/,
            ""
          )}`;

          setAttributes((prev: any) => ({ ...prev, id: tempID }));
        }
      }, [tempID]);

      useEffect(() => {
        if (
          id.match(/-we-(?!.*-we-).*$/)[0] !==
          tempID.match(/-we-(?!.*-we-).*$/)[0]
        ) {
          setTempID(id);
        }
      }, [id, tempID]);

      return (
        <div className="flex justify-between items-stretch gap-4">
          <InputEditor
            title={"ID"}
            value={tempID.replace(/-we-(?!.*-we-).*$/, "")}
            onInput={(val: string) =>
              setTempID(val + tempID.match(/-we-(?!.*-we-).*$/))
            }
          />
          <Button size={"icon"} variant={"outline"} onClick={handleSaveID}>
            <Check />
          </Button>
        </div>
      );
    },
    Tags: ["*"],
    Attributes: ["id"],
  },
  Title: {
    Root: ({ attributes, setAttributes }: any) => {
      const { title = "" } = attributes ?? {};
      return (
        <div className="flex flex-col items-stretch gap-4">
          <InputEditor
            title={"Title"}
            value={title}
            onInput={(val: string) =>
              setAttributes((prev: any) => ({
                ...prev,
                title: val,
              }))
            }
          />
        </div>
      );
    },
    Tags: ["a", "img", "button", "abbr", "iframe"],
    Attributes: ["title"],
  },
  Start: {
    Root: ({ attributes, setAttributes }: any) => {
      const { start = "" } = attributes ?? {};
      return (
        <div className="flex flex-col items-stretch gap-4">
          <InputEditor
            title={"Starting Number"}
            value={start}
            onInput={(val: string) =>
              setAttributes((prev: any) => ({
                ...prev,
                start: val,
              }))
            }
          />
        </div>
      );
    },
    Tags: ["ol"],
    Attributes: ["start"],
  },
  ListStyle: {
    Root: ({ attributes, setAttributes }: any) => {
      const { type = "" } = attributes ?? {};
      return (
        <div className="flex flex-col items-stretch gap-4">
          <DropdownEditor
            title={"List Style"}
            values={["1", "a", "A", "i", "I"]}
            value={type}
            onSelect={(val: string) =>
              setAttributes((prev: any) => ({
                ...prev,
                type: val,
              }))
            }
          />
        </div>
      );
    },
    Tags: ["ol"],
    Attributes: ["type"],
  },
  Width: {
    Root: ({ attributes, setAttributes }: any) => {
      const { width = "" } = attributes ?? {};
      return (
        <div className="flex flex-col items-stretch gap-4">
          <InputEditor
            title={"Width"}
            value={width}
            onInput={(val: string) => {
              setAttributes((prev: any) => ({
                ...prev,
                width: val,
              }));
            }}
          />
        </div>
      );
    },
    Tags: ["img", "video", "canvas", "iframe", "embed", "object"],
    Attributes: ["width"],
  },
  Height: {
    Root: ({ attributes, setAttributes }: any) => {
      const { height = "" } = attributes ?? {};
      return (
        <div className="flex flex-col items-stretch gap-4">
          <InputEditor
            title={"Height"}
            value={height}
            onInput={(val: string) => {
              setAttributes((prev: any) => ({
                ...prev,
                height: val,
              }));
            }}
          />
        </div>
      );
    },
    Tags: ["img", "video", "canvas", "iframe", "embed", "object"],
    Attributes: ["height"],
  },
  Value: {
    Root: ({ attributes, setAttributes }: any) => {
      const { value = "" } = attributes ?? {};
      return (
        <div className="flex flex-col items-stretch gap-4">
          <InputEditor
            title={"Value"}
            value={value}
            onInput={(val: string) =>
              setAttributes((prev: any) => ({
                ...prev,
                value: val,
              }))
            }
          />
        </div>
      );
    },
    Tags: ["input", "textarea", "option", "button", "select", "progress"],
    Attributes: ["value"],
  },
  InputType: {
    Root: ({ attributes, setAttributes }: any) => {
      const { type = "" } = attributes ?? {};
      return (
        <div className="flex flex-col items-stretch gap-4">
          <DropdownEditor
            title={"Input Type"}
            values={{
              text: "Text",
              password: "Password",
              email: "Email",
              tel: "Phone Number",
              url: "URL",
              search: "Search",
              number: "Number",
              range: "Range",
              color: "Color",
              date: "Date",
              time: "Time",
              "datetime-local": "Date Time",
              month: "Month",
              week: "Week",
              checkbox: "Checkbox",
              radio: "Radio",
              file: "Files",
              hidden: "Hidden",
              submit: "Submit",
              reset: "Reset",
              button: "Button",
            }}
            value={type}
            onSelect={(val: string) =>
              setAttributes((prev: any) => ({
                ...prev,
                type: val,
              }))
            }
          />
        </div>
      );
    },
    Tags: ["input"],
    Attributes: ["type"],
  },
  ButtonType: {
    Root: ({ attributes, setAttributes }: any) => {
      const { type = "" } = attributes ?? {};
      return (
        <div className="flex flex-col items-stretch gap-4">
          <DropdownEditor
            title={"Button Type"}
            values={{
              button: "Button",
              submit: "Submit",
              reset: "Reset",
            }}
            value={type}
            onSelect={(val: string) =>
              setAttributes((prev: any) => ({
                ...prev,
                type: val,
              }))
            }
          />
        </div>
      );
    },
    Tags: ["button"],
    Attributes: ["type"],
  },
  Placeholder: {
    Root: ({ attributes, setAttributes }: any) => {
      const { placeholder = "" } = attributes ?? {};
      return (
        <div className="flex flex-col items-stretch gap-4">
          <InputEditor
            title={"Placeholder"}
            value={placeholder}
            onInput={(val: string) =>
              setAttributes((prev: any) => ({
                ...prev,
                placeholder: val,
              }))
            }
          />
        </div>
      );
    },
    Tags: ["input", "textarea"],
    Attributes: ["placeholder"],
  },
  Href: {
    Root: ({ attributes, setAttributes }: any) => {
      const { href = "" } = attributes ?? {};
      return (
        <div className="flex flex-col items-stretch gap-4">
          <InputEditor
            title={"Link"}
            value={href}
            onInput={(val: string) =>
              setAttributes((prev: any) => ({
                ...prev,
                href: val,
              }))
            }
          />
        </div>
      );
    },
    Tags: ["a"],
    Attributes: ["href"],
  },
  Src: {
    Root: ({ setAttributes }: any) => {
      return (
        <div className="flex flex-col items-stretch gap-4">
          <MediaInputEditor
            title={"Media"}
            onUpload={(file: any) =>
              setAttributes((prev: any) => ({
                ...prev,
                src: URL.createObjectURL(file),
              }))
            }
          />
        </div>
      );
    },
    Tags: ["img", "video", "iframe", "audio"],
    Attributes: ["src"],
  },
  Alt: {
    Root: ({ attributes, setAttributes }: any) => {
      const { alt = "" } = attributes ?? {};
      return (
        <div className="flex flex-col items-stretch gap-4">
          <InputEditor
            title={"Alternate Text"}
            value={alt}
            onInput={(val: string) =>
              setAttributes((prev: any) => ({
                ...prev,
                alt: val,
              }))
            }
          />
        </div>
      );
    },
    Tags: ["img"],
    Attributes: ["alt"],
  },
};
