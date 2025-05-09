import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaLink, FaLinkSlash } from "react-icons/fa6";
import { Combobox } from "@/components/ui/combobox";
import {
  AlignCenter,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  AlignHorizontalDistributeCenter,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignStartHorizontal,
  ArrowLeftRight,
  Ban,
  CaseLower,
  CaseSensitive,
  CaseUpper,
  ChevronsLeftRightEllipsis,
  Ellipsis,
  Equal,
  Eye,
  EyeOff,
  LayoutGrid,
  LayoutTemplate,
  MoveVertical,
  Scan,
  Square,
  SquareDashed,
  Strikethrough,
  Underline,
} from "lucide-react";
import ColorPicker, { themes } from "react-pick-color";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import { ColorInputEditor } from "../editors/ColorInputEditor";
import { DropdownEditor } from "../editors/DropdownEditor";
import { GroupToggleEditor } from "../editors/GroupToggleEditor";
import { UnitInputEditor } from "../editors/UnitInputEditor";
import { useEffect, useState } from "react";
import { capitalized, extractShadow, filterKeys, semiKebabCase } from "./utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GColorInputEditor } from "../editors/GColorInputEditor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaXmark } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { MediaInputEditor } from "../editors/MediaInputEditor";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputEditor } from "../editors/InputEditor";
import { useTypeFace } from "@/app/providers/typography-provider";
import { useAnimations } from "@/app/providers/animation-provider";

export type Styles = { [key: string]: string };
export type StyleControllerKeys = keyof typeof styleControllers;

type Shadow = {
  color: string;
  xOffset: string;
  yOffset: string;
  blur: string;
  inset: string;
};
export const styleControllers = {
  Spacing: {
    Root: ({ styles, setStyles }: any) => {
      const inputClasses = {
        top: "top-2 right-0 left-0",
        right: "top-0 bottom-0 right-2 flex-col",
        bottom: "left-0 bottom-2 right-0",
        left: "top-0 bottom-0 left-2 flex-col",
      };
      const positionIndex = ["top", "right", "bottom", "left"];

      const { margin = "0", padding = "0" } = styles ?? {};

      const [link, setLink] = useState(true);

      const setValue = (style: string, position: string, value: string) => {
        const filterPosition = (
          x: String,
          list: string[],
          complete: boolean
        ) => {
          let isFilter = false;
          list.forEach((y) => {
            if (complete ? x === y : x.includes(y)) isFilter = true;
          });
          return isFilter;
        };
        const filter = (obj: any, vals: string[], complete = false) =>
          Object.entries(obj).filter(([key, __], _) => {
            if (filterPosition(key.toLowerCase(), vals, complete)) {
              return false;
            }
            return true;
          });
        if (link) {
          setStyles((prev: any) => ({
            ...Object.fromEntries(filter(prev, positionIndex)),
            [style]: value,
          }));
          return;
        }
        setStyles((prev: any) => ({
          ...Object.fromEntries(filter(prev, ["margin", "padding"], true)),
          [style + capitalized(position)]: value,
        }));
      };

      return (
        <div className="rounded border border-dashed relative m-2 aspect-5/4 flex items-center justify-center">
          {Object.entries(inputClasses).map(([pos, cls], index) => (
            <UnitInputEditor
              key={index}
              className={`w-min items-center border-0 absolute m-auto h-min ${cls}`}
              inputClassName={"w-full min-w-10"}
              value={link ? margin : styles[`margin${capitalized(pos)}`] ?? 0}
              parameters={["margin", pos]}
              onInput={setValue}
            />
          ))}
          <span className="text-neutral-500 font-semibold absolute bottom-2 right-2 text-xs">
            Margin
          </span>
          <div className="rounded border border-dashed relative w-3/5 aspect-5/4">
            <div className=" absolute m-auto top-0 left-0 right-0 bottom-0 size-min rounded">
              <Button
                variant={"outline"}
                size={"icon"}
                onClick={() => {
                  setLink(!link);
                }}
              >
                {link ? <FaLink /> : <FaLinkSlash />}
              </Button>
            </div>

            {Object.entries(inputClasses).map(([pos, cls], index) => (
              <UnitInputEditor
                key={index}
                className={`w-min items-center border-0 absolute m-auto h-min ${cls}`}
                inputClassName={"w-full min-w-10"}
                value={
                  link ? padding : styles[`padding${capitalized(pos)}`] ?? 0
                }
                parameters={["padding", pos]}
                onInput={setValue}
              />
            ))}
            <span className="text-neutral-500 font-semibold absolute bottom-2 right-2 text-xs">
              Padding
            </span>
          </div>
        </div>
      );
    },
    Styles: ["padding", "margin"],
  },
  Typography: {
    Root: ({ styles, setStyles }: any) => {
      const { faces, addFace, getWeights, getStyles }: any = useTypeFace();

      const [fontWeights, setFontWeights] = useState([]);
      const [fontStyles, setFontStyles] = useState(["regular"]);

      const {
        fontFamily = null,
        fontWeight = null,
        fontSize = null,
        color = null,
        letterSpacing = null,
        lineHeight = null,
        textAlign = "left",
        fontStyle = "regular",
        textDecorationLine = "",
        textTransform = "",
      } = styles ?? {};

      return (
        <div className="flex flex-col items-stretch gap-4">
          <div className="flex justify-between">
            <Label htmlFor="typographydropdown">Typeface</Label>
            <Combobox
              notFound={"No Fonts Found"}
              value={fontFamily}
              placeholder={"Inherit from parent"}
              items={faces}
              onSelect={async (val: string, ff: string) => {
                addFace(val);
                setStyles((prev: any) => ({
                  ...prev,
                  fontFamily: ff,
                }));
                const weights = await getWeights(ff);
                setFontWeights(weights);
                const styles = await getStyles(ff);
                setFontStyles(styles);
              }}
            />
          </div>
          <DropdownEditor
            title={"Weight"}
            values={fontWeights}
            value={fontWeight}
            onSelect={(val: string) => {
              setStyles((prev: any) => ({
                ...prev,
                fontWeight: val,
              }));
            }}
          />
          <UnitInputEditor
            title={"Size"}
            parentClassName="flex-row justify-between"
            inputClassName={"w-20 focus-visible:border-none"}
            value={fontSize}
            onInput={(val: string) => {
              setStyles((prev: any) => ({
                ...prev,
                fontSize: val,
              }));
            }}
          />
          <div className="flex justify-between">
            <Label htmlFor="typographydropdown">Color</Label>
            <Popover>
              <PopoverTrigger>
                <div
                  className="size-8 rounded"
                  style={{
                    backgroundColor: color ?? "#ffff",
                  }}
                ></div>
              </PopoverTrigger>
              <PopoverContent className="p-0 bg-transparent border-none -translate-x-2">
                {" "}
                <ColorPicker
                  color={color}
                  theme={themes.dark}
                  onChange={(c) => {
                    setStyles((prev: any) => ({
                      ...prev,
                      color: c.hex,
                    }));
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-between items-start mt-4">
            <Label htmlFor="typographydropdown">Spacing</Label>

            <UnitInputEditor
              title={"Letter"}
              parentClassName="flex-col-reverse border-none gap-2 "
              titleClassName={" text-neutral-500 text-xs"}
              inputClassName={"w-10 focus-visible:border-none"}
              value={letterSpacing}
              onInput={(val: string) => {
                setStyles((prev: any) => ({
                  ...prev,
                  letterSpacing: val,
                }));
              }}
            />
            <UnitInputEditor
              title={"Line"}
              parentClassName="flex-col-reverse border-none gap-2 "
              titleClassName={" text-neutral-500 text-xs"}
              inputClassName={"w-10 focus-visible:border-none"}
              value={lineHeight}
              onInput={(val: string) => {
                setStyles((prev: any) => ({
                  ...prev,
                  lineHeight: val,
                }));
              }}
            />
          </div>
          <div className="flex justify-between">
            <Label htmlFor="typographydropdown">Alignment</Label>
            <ToggleGroup
              type={"single"}
              onValueChange={(val: string) =>
                setStyles((prev: any) => ({
                  ...prev,
                  textAlign: val,
                }))
              }
              value={textAlign}
            >
              {[
                ["left", <AlignLeft className="h-4 w-4" />],
                ["center", <AlignCenter className="h-4 w-4" />],
                ["right", <AlignRight className="h-4 w-4" />],
                ["justify", <AlignJustify className="h-4 w-4" />],
              ].map((item, index) => (
                <ToggleGroupItem
                  value={item[0] as string}
                  aria-label={`Toggle ${item[0]}`}
                  key={index}
                >
                  {item[1]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex justify-between">
            <Label htmlFor="typographydropdown">Style</Label>
            <ToggleGroup
              type={"single"}
              onValueChange={(val: string) => {
                setStyles((prev: any) => ({
                  ...prev,
                  fontStyle: val === "regular" ? "" : val,
                }));
              }}
              value={fontStyle}
            >
              {fontStyles.map((item, index) => (
                <ToggleGroupItem
                  value={item}
                  aria-label={`Toggle ${item}`}
                  key={index}
                >
                  {item === "regular" ? "None" : capitalized(item)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex justify-between">
            <Label htmlFor="typographydropdown">Stroke</Label>
            <ToggleGroup
              type={"single"}
              onValueChange={(val: string) =>
                setStyles((prev: any) => ({
                  ...prev,
                  textDecorationLine: val === "none" ? "" : val,
                }))
              }
              value={textDecorationLine === "" ? "none" : textDecorationLine}
            >
              {[
                ["none", <Ban className="h-4 w-4" />],
                ["underline", <Underline className="h-4 w-4" />],
                ["line-through", <Strikethrough className="h-4 w-4" />],
              ].map((item, index) => (
                <ToggleGroupItem
                  value={item[0] as string}
                  aria-label={`Toggle ${item[0]}`}
                  key={index}
                >
                  {item[1]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex justify-between">
            <Label htmlFor="typographydropdown">Transform</Label>
            <ToggleGroup
              type={"single"}
              onValueChange={(val: string) =>
                setStyles((prev: any) => ({
                  ...prev,
                  textTransform: val === "none" ? "" : val,
                }))
              }
              value={textTransform === "" ? "none" : textTransform}
            >
              {[
                ["none", <Ban className="h-4 w-4" />],
                ["lowercase", <CaseLower className="h-4 w-4" />],
                ["capitalize", <CaseSensitive className="h-4 w-4" />],
                ["uppercase", <CaseUpper className="h-4 w-4" />],
              ].map((item, index) => (
                <ToggleGroupItem
                  value={item[0] as string}
                  aria-label={`Toggle ${item[0]}`}
                  key={index}
                >
                  {item[1]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      );
    },
    Styles: [
      "fontFamily",
      "fontWeight",
      "fontSize",
      "color",
      "letterSpacing",
      "lineHeight",
      "textAlign",
      "fontStyle",
      "textDecorationLine",
      "textTransform",
    ],
  },
  Sizing: {
    Root: ({ styles, setStyles }: any) => {
      const {
        width = "auto",
        maxWidth = "auto",
        minWidth = "auto",
        height = "auto",
        maxHeight = "auto",
        minHeight = "auto",
        overflow = "auto",
        objectFit = "fill",
      } = styles ?? {};

      return (
        <div className="flex flex-col items-stretch gap-4">
          <UnitInputEditor
            title={"Width"}
            parentClassName="flex-row justify-between items-start"
            childrenInputclassName="flex flex-row border rounded"
            childrenclassName="flex py-2 gap-2"
            className={"flex-col border-none"}
            inputClassName={"w-full focus-visible:border-none text-start"}
            value={width}
            onInput={(val: string) => {
              setStyles((prev: any) => ({
                ...prev,
                width: val,
              }));
            }}
          >
            <UnitInputEditor
              title={"Min"}
              titleClassName={"text-neutral-500"}
              parentClassName="flex-col-reverse"
              inputClassName={"w-20 focus-visible:border-none text-start"}
              value={minWidth}
              onInput={(val: string) => {
                setStyles((prev: any) => ({
                  ...prev,
                  minWidth: val,
                }));
              }}
            />
            <UnitInputEditor
              title={"Max"}
              titleClassName={"text-neutral-500"}
              parentClassName="flex-col-reverse"
              inputClassName={"w-20 focus-visible:border-none"}
              value={maxWidth}
              onInput={(val: string) => {
                setStyles((prev: any) => ({
                  ...prev,
                  maxWidth: val,
                }));
              }}
            />
          </UnitInputEditor>

          <UnitInputEditor
            title={"Height"}
            parentClassName="flex-row justify-between items-start"
            childrenInputclassName="flex flex-row border rounded"
            childrenclassName="flex py-2 gap-2"
            className={"flex-col border-none"}
            inputClassName={"w-full focus-visible:border-none text-start"}
            value={height}
            onInput={(val: string) => {
              setStyles((prev: any) => ({
                ...prev,
                height: val,
              }));
            }}
          >
            <UnitInputEditor
              title={"Min"}
              titleClassName={"text-neutral-500"}
              parentClassName="flex-col-reverse"
              inputClassName={"w-20 focus-visible:border-none text-start"}
              value={minHeight}
              onInput={(val: string) => {
                setStyles((prev: any) => ({
                  ...prev,
                  minHeight: val,
                }));
              }}
            />
            <UnitInputEditor
              title={"Max"}
              titleClassName={"text-neutral-500"}
              parentClassName="flex-col-reverse"
              inputClassName={"w-20 focus-visible:border-none text-start"}
              value={maxHeight}
              onInput={(val: string) => {
                setStyles((prev: any) => ({
                  ...prev,
                  maxHeight: val,
                }));
              }}
            />
          </UnitInputEditor>
          <div className="flex justify-between">
            <Label htmlFor="typographydropdown">Overflow</Label>
            <ToggleGroup
              type={"single"}
              onValueChange={(val: string) =>
                setStyles((prev: any) => ({
                  ...prev,
                  overflow: val,
                }))
              }
              value={overflow}
            >
              {[
                ["visible", <Eye className="h-4 w-4" />],
                ["hidden", <EyeOff className="h-4 w-4" />],
                ["scroll", <MoveVertical className="h-4 w-4" />],
                ["auto", "Auto"],
              ].map((item, index) => (
                <ToggleGroupItem
                  value={item[0] as string}
                  aria-label={`Toggle ${item[0]}`}
                  key={index}
                >
                  {item[1]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <DropdownEditor
            title={"Object"}
            values={["fill", "contain", "cover", "none"]}
            triggerclassName={"min-w-30"}
            value={objectFit}
            onSelect={(val: string) => {
              setStyles((prev: any) => ({
                ...prev,
                objectFit: val,
              }));
            }}
          />
        </div>
      );
    },
    Styles: [
      "width",
      "maxWidth",
      "minWidth",
      "height",
      "maxHeight",
      "minHeight",
      "overflow",
      "objectFit",
    ],
  },
  Layout: {
    Root: ({ styles, setStyles }: any) => {
      const {
        display = "block",
        flexDirection = "",
        alignItems = "normal",
        justifyContent = "start",
        flexWrap = "nowrap",
        gap = "",
      } = styles ?? {};

      const [reversers, setReversers] = useState({
        flexDirection: false,
        flexWrap: false,
      });

      const getFlexValue = (val = flexDirection) =>
        val.split("-").length > 1 ? val.split("-").slice(0, -1).join("-") : val;

      useEffect(() => {
        if (!reversers.flexDirection) return;
        setStyles((prevAttr: any) => ({
          ...prevAttr,
          flexDirection: `${getFlexValue(prevAttr.flexDirection)}${
            reversers.flexDirection ? "-reverse" : ""
          }`,
        }));
      }, [reversers.flexDirection]);

      useEffect(() => {
        if (!reversers.flexDirection) return;
        setStyles((prevAttr: any) => ({
          ...prevAttr,
          flexWrap: reversers.flexWrap ? "wrap-reverse" : "",
        }));
      }, [reversers.flexWrap]);

      return (
        <div className="flex flex-col items-stretch gap-4">
          <GroupToggleEditor
            title={"Display"}
            onChange={(val: string) =>
              setStyles((prev: any) => ({
                ...Object.fromEntries(
                  Object.entries(prev).filter(
                    (x) =>
                      ![
                        "flexDirection",
                        "alignItems",
                        "justifyContent",
                        "flexWrap",
                      ].includes(x[0])
                  )
                ),
                display: val,
              }))
            }
            value={display}
            items={[
              ["block", <SquareDashed className="h-4 w-4" />],
              ["inline", <ChevronsLeftRightEllipsis className="h-4 w-4" />],
              ["flex", <LayoutTemplate className="h-4 w-4" />],
              ["grid", <LayoutGrid className="h-4 w-4" />],
              ["none", <Ban className="h-4 w-4" />],
            ]}
          />
          {["flex", "grid"].includes(display) && (
            <UnitInputEditor
              title={"Gap"}
              value={gap}
              parentClassName="flex-row justify-between"
              inputClassName={"w-20 focus-visible:border-none text-start"}
              onInput={(val: string) => {
                setStyles((prev: any) => ({
                  ...prev,
                  gap: val,
                }));
              }}
            />
          )}
          {display === "flex" && (
            <>
              <div className="flex">
                <GroupToggleEditor
                  title={"Direction"}
                  className={" w-full"}
                  onChange={(val: string) => {
                    setStyles((prev: any) => ({
                      ...prev,
                      flexDirection: `${getFlexValue(val)}${
                        reversers.flexDirection ? "-reverse" : ""
                      }`,
                    }));
                  }}
                  value={getFlexValue(flexDirection)}
                  items={[
                    ["row", "Horizontal"],
                    ["column", "Vertical"],
                  ]}
                />
                <Toggle
                  pressed={reversers.flexDirection}
                  onPressedChange={() => {
                    setReversers((prev) => ({
                      ...prev,
                      flexDirection: !prev.flexDirection,
                    }));
                  }}
                >
                  <ArrowLeftRight />
                </Toggle>
              </div>
              <GroupToggleEditor
                title={"Align"}
                onChange={(val: string) =>
                  setStyles((prev: any) => ({
                    ...prev,
                    alignItems: val,
                  }))
                }
                value={alignItems}
                items={[
                  ["start", <AlignStartHorizontal className="h-4 w-4" />],
                  ["center", <AlignCenterHorizontal className="h-4 w-4" />],
                  ["end", <AlignEndHorizontal className="h-4 w-4" />],
                  [
                    "stretch",
                    <AlignHorizontalSpaceAround className="h-4 w-4" />,
                  ],
                ]}
              />
              <GroupToggleEditor
                title={"Justify"}
                onChange={(val: string) =>
                  setStyles((prev: any) => ({
                    ...prev,
                    justifyContent: val,
                  }))
                }
                value={justifyContent}
                items={[
                  [
                    "start",
                    <AlignHorizontalJustifyStart className="h-4 w-4" />,
                  ],
                  [
                    "center",
                    <AlignHorizontalJustifyCenter className="h-4 w-4" />,
                  ],
                  ["end", <AlignHorizontalJustifyEnd className="h-4 w-4" />],
                  [
                    "space-around",
                    <AlignHorizontalSpaceAround className="h-4 w-4" />,
                  ],
                  [
                    "space-between",
                    <AlignHorizontalSpaceBetween className="h-4 w-4" />,
                  ],
                  [
                    "space-evenly",
                    <AlignHorizontalDistributeCenter className="h-4 w-4" />,
                  ],
                ]}
              />
              <div className="flex">
                <GroupToggleEditor
                  title={"Wrap"}
                  className={" w-full"}
                  onChange={(val: string) => {
                    setStyles((prev: any) => ({
                      ...prev,
                      flexWrap: `${getFlexValue(val)}${
                        reversers.flexWrap && val === "wrap" ? "-reverse" : ""
                      }`,
                    }));
                  }}
                  value={flexWrap}
                  items={[
                    ["nowrap", "No"],
                    ["wrap", "Yes"],
                  ]}
                />
                <Toggle
                  pressed={reversers.flexWrap}
                  onPressedChange={() => {
                    setReversers((prev) => ({
                      ...prev,
                      flexWrap: !prev.flexWrap,
                    }));
                  }}
                >
                  <ArrowLeftRight />
                </Toggle>
              </div>
            </>
          )}
        </div>
      );
    },
    Styles: [
      "display",
      "flexDirection",
      "alignItems",
      "justifyContent",
      "flexWrap",
    ],
  },
  Borders: {
    Root: ({ styles, setStyles }: any) => {
      const { borderStyle = "none", borderColor = "#000" } = styles ?? {};

      const borderRaidusMap = [
        "TopRight",
        "BottomLeft",
        "TopLeft",
        "BottomRight",
      ].map((x) => [`border${x}Radius`, capitalized(semiKebabCase(x))]);

      const capsPos = ["Top", "Bottom", "Left", "Right"];

      const widthMap = capsPos.map((x) => [
        `border${x}Width`,
        capitalized(semiKebabCase(x)),
      ]);
      const [links, setLinks] = useState({
        borderRadius: true,
        borderWidth: true,
        borderColor: true,
        borderStyle: true,
      });

      const borderStyleIcons = [
        ["none", <Ban className="h-4 w-4" />],
        ["solid", <Square className="h-4 w-4" />],
        ["dashed", <SquareDashed className="h-4 w-4" />],
        ["dotted", <Ellipsis className="h-4 w-4" />],
        ["double", <Equal className="h-4 w-4" />],
      ];

      return (
        <div className="flex flex-col items-stretch gap-4">
          <div className="flex flex-col gap-4">
            {[
              ["Radius", "borderRadius", borderRaidusMap],
              ["Width", "borderWidth", widthMap],
            ].map((y, i1) => (
              <div className="flex gap-2 justify-between" key={i1}>
                <UnitInputEditor
                  disabled={!links[y[1] as keyof typeof links]}
                  title={y[0]}
                  value={styles[y[1] as string]}
                  parentClassName={"flex-row items-start w-full"}
                  titleClassName={"pt-4"}
                  inputClassName={"border"}
                  childrenInputclassName={"flex"}
                  className={`border-none w-full ${
                    links[y[1] as keyof typeof links] ? "" : "flex-col"
                  }`}
                  childrenclassName={"grid grid-cols-2 p-2 gap-2"}
                  onInput={(val: string) => {
                    setStyles((prev: any) => {
                      return filterKeys(
                        {
                          ...prev,
                          [y[1] as keyof typeof links]: val,
                        },
                        (k: string) => {
                          if (Array.isArray(y[2])) {
                            return (
                              y[2].filter((x: string[]) => x[0] === k)
                                .length === 0
                            );
                          }
                          return true;
                        }
                      );
                    });
                  }}
                >
                  {!links[y[1] as keyof typeof links] &&
                    y[2] &&
                    Array.isArray(y[2]) &&
                    Array.isArray(y[2][0]) &&
                    y[2].map((x, index) => (
                      <UnitInputEditor
                        key={index}
                        title={x[1]}
                        value={styles[x[0] as string]}
                        onInput={(val: string) => {
                          setStyles((prev: any) => ({
                            ...prev,
                            [x[0]]: val,
                          }));
                        }}
                        inputClassName={"focus-visible:border-none"}
                        parentClassName={"flex-col-reverse gap-2"}
                        titleClassName={"text-neutral-500"}
                      />
                    ))}
                </UnitInputEditor>
                <Toggle
                  pressed={links[y[1] as keyof typeof links]}
                  onPressedChange={() => {
                    setLinks((prev) => ({
                      ...prev,
                      [y[1] as keyof typeof links]:
                        !prev[y[1] as keyof typeof links],
                    }));
                  }}
                >
                  <Scan />
                </Toggle>
              </div>
            ))}

            <div className="flex flex-col">
              <div className="flex gap-2 w-full">
                <div className="flex justify-between w-full">
                  <Label htmlFor="typographydropdown">style</Label>
                  <ToggleGroup
                    disabled={!links.borderStyle}
                    type={"single"}
                    onValueChange={(val: string) =>
                      setStyles((prev: any) => ({
                        ...prev,
                        borderStyle: val,
                      }))
                    }
                    value={borderStyle}
                  >
                    {borderStyleIcons.map((item, index) => (
                      <ToggleGroupItem
                        value={item[0] as string}
                        aria-label={`Toggle ${item[0]}`}
                        key={index}
                      >
                        {item[1]}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                <Toggle
                  pressed={links.borderStyle}
                  onPressedChange={() => {
                    setLinks((prev) => ({
                      ...prev,
                      borderStyle: !prev.borderStyle,
                    }));
                  }}
                >
                  <Scan />
                </Toggle>
              </div>
              <div className="flex flex-col pl-2">
                {!links.borderStyle &&
                  capsPos.map((x, i) => (
                    <div className="flex justify-between w-full" key={i}>
                      <Label
                        htmlFor="typographydropdown"
                        className="text-neutral-400"
                      >
                        {x}
                      </Label>
                      <ToggleGroup
                        type={"single"}
                        onValueChange={(val: string) =>
                          setStyles((prev: any) => ({
                            ...prev,
                            [`border${x}Style`]: val,
                          }))
                        }
                        value={styles[`border${x}Style`]}
                      >
                        {borderStyleIcons.map((item, index) => (
                          <ToggleGroupItem
                            value={item[0] as string}
                            aria-label={`Toggle ${item[0]}`}
                            key={index}
                          >
                            {item[1]}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex w-full justify-between gap-2">
                <ColorInputEditor
                  disabled={!links.borderColor}
                  title={"Color"}
                  className={"w-full"}
                  value={borderColor}
                  onChange={(val: string) =>
                    setStyles((prev: any) => ({
                      ...prev,
                      borderColor: val,
                    }))
                  }
                />
                <Toggle
                  pressed={links.borderColor}
                  onPressedChange={() => {
                    setLinks((prev) => ({
                      ...prev,
                      borderColor: !prev.borderColor,
                    }));
                  }}
                >
                  <Scan />
                </Toggle>
              </div>
              {!links.borderColor && (
                <div className="grid grid-cols-2 gap-4 p-2">
                  {capsPos.map((x, index) => (
                    <ColorInputEditor
                      key={index}
                      className={
                        "flex-col-reverse gap-2 text-neutral-500 w-full"
                      }
                      triggerClassName={"w-full"}
                      title={x}
                      value={styles[`border${x}Color`]}
                      onChange={(val: string) =>
                        setStyles((prev: any) => ({
                          ...prev,
                          [`border${x}Color`]: val,
                        }))
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    },
    Styles: [
      "borderRadius",
      ...["border", "TopRight", "BottomLeft", "TopLeft", "BottomRight"].map(
        (x) => `borderRadius${x}`
      ),
      ...[
        "border",
        "borderTop",
        "borderBottom",
        "borderLeft",
        "borderRight",
      ].flatMap((x) => ["Width", "Style", "Color"].map((y) => x + y)),
    ],
  },
  Background: {
    Root: ({ styles, setStyles }: any) => {
      const {
        backgroundColor = "",
        backgroundImage = "",
        backgroundSize = "auto",
        backgroundRepeat = "repeat",
        backgroundPosition = "0 0",
        backgroundAttachment = "scroll",
      } = styles ?? {};

      const [valueFor, setValueFor] = useState(
        backgroundImage && !backgroundImage.includes("gradient")
          ? "backgroundImage"
          : "backgroundColor"
      );

      const [backgroundState, setBackgroundState] = useState({
        backgroundSize: {
          width: "auto",
          height: "auto",
        },
        backgroundPosition: {
          xAxis: "0%",
          yAxis: "0%",
        },
      });

      const [backgroundFor, setBackgroundFor] = useState({
        backgroundSize: false,
        backgroundPosition: true,
      });

      const handleUpload = (fileUploaded: any) => {
        setStyles((prev: any) => ({
          ...prev,
          [valueFor]: `url(${URL.createObjectURL(fileUploaded)})`,
        }));
      };

      const resetBackground = () => {
        setStyles((prev: any) => ({
          ...prev,
          backgroundColor: "",
          backgroundImage: "",
          backgroundSize: "",
          backgroundRepeat: "",
          backgroundPosition: "",
        }));
      };
      const handleBackgroundUnit = (
        key: "backgroundSize" | "backgroundPosition",
        data: Record<string, string>
      ) => {
        const key1 = Object.keys(data)[0];
        const key1Value = data[key1] !== "" ? data[key1] : "0";

        const keyValues: Record<string, string[]> = {
          backgroundSize: ["width", "height"],
          backgroundPosition: ["xAxis", "yAxis"],
        };

        setBackgroundState((prev) => {
          return {
            ...prev,
            [key]: {
              ...(prev[key] as Record<string, string>),
              [key1]: key1Value,
            },
          };
        });

        const key2 = keyValues[key].find((x) => x !== key1);
        if (!key2) return;

        let indexedValues: string[] = [];
        indexedValues[keyValues[key].indexOf(key1)] = key1Value;

        indexedValues[keyValues[key].indexOf(key2)] = (
          backgroundState[key] as Record<string, string>
        )[key2];

        setStyles((attr: any) => {
          return {
            ...attr,
            [key]: `${indexedValues[0]} ${indexedValues[1]}`,
          };
        });
      };

      const [GColorFor, setGColorFor] = useState(
        backgroundImage.includes("gradient") ? "gradient" : "solid"
      );

      useEffect(() => {
        setGColorFor(
          backgroundImage.includes("gradient") ? "gradient" : "solid"
        );
      }, [backgroundImage]);

      return (
        <div className="flex flex-col items-stretch gap-4">
          <Tabs
            value={valueFor}
            onValueChange={(val) => {
              setValueFor(val);
              resetBackground();
            }}
            className="flex flex-col items-stretch px-4"
          >
            <TabsList className="w-full">
              <TabsTrigger value="backgroundColor">Color</TabsTrigger>
              <TabsTrigger value="backgroundImage">Image</TabsTrigger>
            </TabsList>
            <TabsContent
              value="backgroundColor"
              className="flex flex-col items-stretch gap-4"
            >
              <GColorInputEditor
                title={"Color"}
                value={
                  GColorFor === "solid" ? backgroundColor : backgroundImage
                }
                onChange={(val: string) => {
                  setStyles((prev: any) => ({
                    ...prev,
                    [GColorFor === "solid"
                      ? "backgroundColor"
                      : "backgroundImage"]: val,
                  }));
                }}
                colorFor={GColorFor}
                setColorFor={setGColorFor}
              />
            </TabsContent>
            <TabsContent
              value="backgroundImage"
              className="flex flex-col items-stretch gap-4"
            >
              <MediaInputEditor title="Image" onUpload={handleUpload} />
            </TabsContent>
          </Tabs>
          {(GColorFor === "gradient" || valueFor === "backgroundImage") && (
            <div className="px-4 flex flex-col gap-4">
              <div className={"flex flex-col gap-4"}>
                <div className="flex justify-between">
                  <Label htmlFor="typographydropdown">Size</Label>
                  <DropdownEditor
                    value={
                      ["auto", "cover", "contain"].includes(backgroundSize)
                        ? backgroundSize
                        : "unit"
                    }
                    onSelect={(val: string) => {
                      if (val === "unit") {
                        setBackgroundFor((prev: any) => ({
                          ...prev,
                          backgroundSize: true,
                        }));
                        setStyles((prev: any) => ({
                          ...prev,
                          backgroundSize: "0px 0px",
                        }));
                      } else {
                        setBackgroundFor((prev: any) => ({
                          ...prev,
                          backgroundSize: false,
                        }));

                        setStyles((prev: any) => ({
                          ...prev,
                          backgroundSize: val,
                        }));
                      }
                    }}
                    values={["auto", "cover", "contain", "unit"]}
                  />
                </div>
                {backgroundFor.backgroundSize && (
                  <div className="px-2 flex gap-2">
                    <UnitInputEditor
                      title={"Width"}
                      value={backgroundState.backgroundSize.width}
                      onInput={(val: string) => {
                        handleBackgroundUnit("backgroundSize", {
                          width: val,
                        });
                      }}
                      inputClassName={"focus-visible:border-none"}
                      parentClassName={"flex-col-reverse gap-2"}
                      titleClassName={"text-neutral-500"}
                    />
                    <UnitInputEditor
                      title={"Height"}
                      value={backgroundState.backgroundSize.height}
                      onInput={(val: string) => {
                        handleBackgroundUnit("backgroundSize", {
                          height: val,
                        });
                      }}
                      inputClassName={"focus-visible:border-none"}
                      parentClassName={"flex-col-reverse gap-2"}
                      titleClassName={"text-neutral-500"}
                    />
                  </div>
                )}
              </div>

              <DropdownEditor
                title={"repeat"}
                value={backgroundRepeat}
                values={["repeat", "repeat-x", "repeat-y", "no-repeat"]}
                onSelect={(val: string) => {
                  setStyles((prev: any) => ({
                    ...prev,
                    backgroundRepeat: val,
                  }));
                }}
              />

              <div className={"flex flex-col gap-4"}>
                <div className="flex justify-between">
                  <Label htmlFor="typographydropdown">Position</Label>
                  <DropdownEditor
                    value={
                      ["top", "bottom", "left", "right", "center"].includes(
                        backgroundPosition
                      )
                        ? backgroundPosition
                        : "unit"
                    }
                    onSelect={(val: string) => {
                      if (val === "unit") {
                        setBackgroundFor((prev: any) => ({
                          ...prev,
                          backgroundPosition: true,
                        }));
                        setStyles((prev: any) => ({
                          ...prev,
                          backgroundPosition: "0px 0px",
                        }));
                      } else {
                        setBackgroundFor((prev: any) => ({
                          ...prev,
                          backgroundPosition: false,
                        }));

                        setStyles((prev: any) => ({
                          ...prev,
                          backgroundPosition: val,
                        }));
                      }
                    }}
                    values={[
                      "top",
                      "bottom",
                      "left",
                      "right",
                      "center",
                      "unit",
                    ]}
                  />
                </div>
                {backgroundFor.backgroundPosition && (
                  <div className="px-2 flex gap-2">
                    <UnitInputEditor
                      title={"X Axis"}
                      value={backgroundState.backgroundPosition.xAxis}
                      onInput={(val: string) => {
                        handleBackgroundUnit("backgroundPosition", {
                          xAxis: val,
                        });
                      }}
                      inputClassName={"focus-visible:border-none"}
                      parentClassName={"flex-col-reverse gap-2"}
                      titleClassName={"text-neutral-500"}
                    />
                    <UnitInputEditor
                      title={"Y Axis"}
                      value={backgroundState.backgroundPosition.yAxis}
                      onInput={(val: string) => {
                        handleBackgroundUnit("backgroundPosition", {
                          yAxis: val,
                        });
                      }}
                      inputClassName={"focus-visible:border-none"}
                      parentClassName={"flex-col-reverse gap-2"}
                      titleClassName={"text-neutral-500"}
                    />
                  </div>
                )}
              </div>

              <DropdownEditor
                title={"Attachment"}
                value={backgroundAttachment}
                values={["scroll", "fixed", "local"]}
                onSelect={(val: string) => {
                  setStyles((prev: any) => ({
                    ...prev,
                    backgroundAttachment: val,
                  }));
                }}
              />
            </div>
          )}
        </div>
      );
    },
    Styles: [
      "backgroundColor",
      "backgroundImage",
      "backgroundPosition",
      "backgroundSize",
      "backgroundAttachment",
      "backgroundRepeat",
    ],
  },
  Shadow: {
    Root: ({ styles, setStyles }: any) => {
      const [valueFor, setValueFor] = useState("boxShadow");

      const [shadows, setShadows] = useState<Shadow[]>([]);

      useEffect(() => {
        if (!styles) return;
        setShadows(
          styles && styles[valueFor] ? extractShadow(styles[valueFor]) : []
        );
      }, [valueFor]);

      const handleShadows = (val: string, shadowIndex: Number, key: string) => {
        const setShadowAttribute = (newShadows: Shadow[]) =>
          setStyles((prev: any) => ({
            ...prev,
            [valueFor]: newShadows
              .map((x) => Object.values(x).join(" "))
              .join(", "),
          }));
        setShadows((prev: Shadow[]) => {
          let newShadows = prev.map((shadow, ind) => {
            if (ind === shadowIndex) return { ...shadow, [key]: val };
            return shadow;
          });
          setShadowAttribute(newShadows);
          return newShadows;
        });
      };

      useEffect(() => {
        if (!document) return;
        const canvas = document.getElementById("we-canvas");
        if (!canvas) return;
        canvas.addEventListener("click", () =>
          setShadows(
            styles && styles[valueFor] ? extractShadow(styles[valueFor]) : []
          )
        );
      }, []);

      return (
        <div className="flex flex-col items-stretch gap-4">
          <ToggleGroup
            type={"single"}
            className="w-full bg-muted"
            value={valueFor}
            onValueChange={(val: string) => setValueFor(val)}
          >
            {[
              ["boxShadow", "Box"],
              ["textShadow", "Text"],
            ].map((item, index) => (
              <ToggleGroupItem
                value={item[0]}
                aria-label={`Toggle ${item[0]}`}
                key={index}
              >
                {item[1]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Button
            variant={"outline"}
            onClick={() => {
              let newShadows: Shadow[] = [];
              setShadows((prev: Shadow[]) => {
                newShadows = [
                  ...prev,
                  {
                    color: "rgba(0,0,0,1)",
                    xOffset: "0px",
                    yOffset: "0px",
                    blur: "0px",
                    inset: "",
                  },
                ];
                return newShadows;
              });

              setStyles((prev: any) => ({
                ...prev,
                [valueFor]: newShadows
                  .map((x) => Object.values(x).join(" "))
                  .join(", "),
              }));
            }}
          >
            <FaPlus />
          </Button>
          <Accordion type="single" collapsible className="w-full">
            {shadows.map((shadow: Record<string, string>, ind) => {
              return (
                <AccordionItem value={`item-${ind}`} key={ind}>
                  <AccordionTrigger className="hover:no-underline cursor-pointer hover:bg-muted p-4 mb-2 items-center">
                    <div className="w-full flex justify-between items-center">
                      <span>Shadow #{ind + 1}</span>
                      <span
                        className="p-2 rounded-lg bg-destructive"
                        onClick={() => {
                          let newShadows: Shadow[] = [];
                          setShadows((prev: Shadow[]) =>
                            prev.filter((_, indf) => ind !== indf)
                          );
                          setStyles((prev: any) => ({
                            ...prev,
                            [valueFor]: newShadows
                              .map(
                                (x) =>
                                  `${x.color} ${x.xOffset} ${x.yOffset} ${x.blur} ${x.inset}`
                              )
                              .join(","),
                          }));
                        }}
                      >
                        <FaXmark />
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col items-stretch gap-4 px-4">
                    {valueFor === "boxShadow" && (
                      <DropdownEditor
                        title={"Location"}
                        value={shadow.inset}
                        values={{
                          "": "outside",
                          inset: "inside",
                        }}
                        onSelect={(val: string) => {
                          handleShadows(val, ind, "inset");
                        }}
                      />
                    )}
                    <ColorInputEditor
                      title={"Color"}
                      value={shadow.color}
                      onChange={(val: string) =>
                        handleShadows(val, ind, "color")
                      }
                    />

                    <div className="flex flex-col gap-4">
                      <Label>Position</Label>
                      <div className="px-2 flex justify-between gap-4">
                        {[
                          ["X Axis", "xOffset"],
                          ["Y Axis", "yOffset"],
                        ].map((data, i) => (
                          <UnitInputEditor
                            key={i}
                            title={data[0]}
                            value={shadow[data[1]]}
                            onInput={(val: any) =>
                              handleShadows(val, ind, data[1])
                            }
                            inputClassName={"focus-visible:border-none"}
                            parentClassName={"flex-col-reverse gap-2"}
                            titleClassName={"text-neutral-500"}
                          />
                        ))}
                      </div>
                    </div>
                    <UnitInputEditor
                      title={"Blur"}
                      parentClassName="flex-row justify-between"
                      inputClassName={"w-20 focus-visible:border-none"}
                      value={shadow.blur}
                      onInput={(val: string) => handleShadows(val, ind, "blur")}
                    />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      );
    },
    Styles: ["boxShadow", "textShadow"],
  },
  Animation: {
    Root: ({ styles, setStyles }: any) => {
      const {
        animationName = "",
        animationDuration = "0.5s",
        animationDelay = "0s",
        animationIterationCount = "1",
        animationDirection = "normal",
      } = styles ?? {};

      const AnimationsContext = useAnimations();
      if (!AnimationsContext) return;

      const { animations } = AnimationsContext;

      return (
        <div className="flex flex-col items-stretch gap-4">
          <div className="flex justify-between">
            <Label htmlFor="dropdowneditor">Animation</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {animationName ?? "Set Class"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Animaitons</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(animations).map((anim, i) => (
                  <DropdownMenuCheckboxItem
                    key={i}
                    checked={Object.keys(animations)?.includes(animationName)}
                    onCheckedChange={(state) => {
                      if (state)
                        setStyles((prev: any) => ({
                          ...prev,
                          animationName: anim,
                        }));
                      else
                        setStyles((prev: any) => ({
                          ...prev,
                          animationName: "",
                        }));
                    }}
                  >
                    {anim}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <UnitInputEditor
            title={"Duration"}
            value={animationDuration}
            units={["ms", "s"]}
            parentClassName="flex-row justify-between"
            inputClassName={"w-20 focus-visible:border-none text-start"}
            onInput={(val: string) => {
              setStyles((prev: any) => ({
                ...prev,
                animationDuration: val,
              }));
            }}
          />
          <UnitInputEditor
            title={"Delay"}
            value={animationDelay}
            units={["ms", "s"]}
            parentClassName="flex-row justify-between"
            inputClassName={"w-20 focus-visible:border-none text-start"}
            onInput={(val: string) => {
              setStyles((prev: any) => ({
                ...prev,
                animationDelay: val,
              }));
            }}
          />
          <InputEditor
            title={"Iteration"}
            value={animationIterationCount}
            onInput={(val: string) =>
              setStyles((prev: any) => ({
                ...prev,
                animationIterationCount: val,
              }))
            }
          />
          <DropdownEditor
            title={"Direction"}
            value={animationDirection}
            values={["normal", "reverse"]}
            onSelect={(val: string) => {
              setStyles((prev: any) => ({
                ...prev,
                animationDirection: val,
              }));
            }}
          />
        </div>
      );
    },
    Styles: [
      "animationName",
      "animationDuration",
      "animaiton",
      "animationDelay",
      "animationDirection",
    ],
  },
};
