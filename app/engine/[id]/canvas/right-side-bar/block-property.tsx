import React from "react";
import {
  StyleControllerKeys,
  styleControllers,
  Styles,
} from "./controls/styleControllers";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Combobox } from "@/components/ui/combobox";
import {
  AttributeControllersKeys,
  Attributes,
  nativeAttributeControllers,
} from "./controls/nativeAttributeControllers";
import { useClassName } from "@/app/providers/class-provider";
import { EventListeners } from "../../node/utils";
import { ListenController } from "./controls/ListenController";
import { useJS } from "@/app/providers/js-provider";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

export const BlockProperty = ({ className }: { className: ClassNameValue }) => {
  const ClassNameContext = useClassName();
  if (!ClassNameContext) return;
  const { classes = {} } = ClassNameContext;

  const JSContext = useJS();
  if (!JSContext) return;
  const { globalFunctions } = JSContext;

  const [styles, setStyles] = React.useState<Styles | null>(null);
  const [attributes, setAttributes] = React.useState<Attributes | null>(null);
  const [elementClasses, setElementClasses] = React.useState<string[] | null>(
    null
  );

  const [styleControlls, setStyleControlls] = React.useState<string[]>([]);

  const [attributeControllers, setAttributeControllers] = React.useState<
    string[]
  >([]);

  const [listenerControlls, setListenerControlls] = React.useState<{
    [key: string]: string;
  }>({});

  React.useEffect(() => {
    document.dispatchEvent(
      new CustomEvent("setListeners", { detail: { listenerControlls } })
    );
  }, [listenerControlls]);
  React.useEffect(() => {
    document.dispatchEvent(
      new CustomEvent("setStyles", { detail: { styles } })
    );
  }, [styles]);
  React.useEffect(() => {
    document.dispatchEvent(
      new CustomEvent("setAttributes", { detail: { attributes } })
    );
  }, [attributes]);

  const handleSetListen = (listener: string, funcName: string) => {
    setListenerControlls((prev) => ({ ...prev, [listener]: funcName }));
  };

  const deepFilter = (l1: any, l2: any) => {
    let isTrue = false;
    l1.forEach((i1: any) => {
      l2.forEach((i2: any) => {
        if (i1.includes(i2)) {
          isTrue = true;
          return;
        }
      });
    });
    return isTrue;
  };

  React.useEffect(() => {
    document.addEventListener("loadAttributes", (e: Event) => {
      const event = e as CustomEvent;
      const element: HTMLElement = event.detail.element;
      if (!element) {
        setStyles(null);
        setAttributes(null);
        setElementClasses(null);
        setStyleControlls([]);
        setAttributeControllers([]);
        setListenerControlls({});
        return;
      }
      const styleAttr = element.style;
      if (!styleAttr) {
        setAttributes(null);
        return;
      }
      let styles: Styles = {};
      Object.entries(styleAttr).forEach(([style, value], _) => {
        if (
          typeof value === "string" &&
          value.length > 0 &&
          isNaN(parseInt(style))
        ) {
          styles[style] = value;
        }
      });

      setStyleControlls(
        Object.keys(styleControllers).filter((clsx, _) => {
          return deepFilter(
            Object.keys(styles),
            styleControllers[clsx as StyleControllerKeys].Styles
          );
        })
      );
      setStyles(styles);
      setAttributes({});
      let newAttributes: { [key: string]: any } = {};
      const tag = element.tagName.toLowerCase();
      const tagAttributes = Object.keys(nativeAttributeControllers).filter(
        (attr) =>
          nativeAttributeControllers[
            attr as AttributeControllersKeys
          ].Tags.some((t: string) => [tag, "*"].includes(t))
      );
      tagAttributes.forEach((attr) =>
        nativeAttributeControllers[
          attr as AttributeControllersKeys
        ].Attributes.forEach(
          (atr: any) => (newAttributes[atr] = element.getAttribute(atr))
        )
      );
      setAttributes(newAttributes);
      setAttributeControllers(tagAttributes);
      setElementClasses(
        Array.from(element.classList as DOMTokenList).map((x: string) =>
          x.replace(/_/g, " ")
        )
      );

      const extract_function = (fun: string) => {
        const match = fun.match(/^[\w$]+(?=\s*\()/);
        if (!match) return "";
        return match[0];
      };
      let eventListeners: { [key: string]: string } = {};
      EventListeners.forEach((lis) => {
        const fun = element.getAttribute(`on${lis}`);
        if (fun) eventListeners[lis] = extract_function(fun);
      });
      setListenerControlls(eventListeners);
    });
  }, []);

  const handleElementClass = (cls: string) => {
    const isRemove = elementClasses?.includes(cls);
    const newClass = (elementClasses ?? []).includes(cls)
      ? (elementClasses ?? []).filter((x) => x !== cls)
      : [...(elementClasses ?? []), cls];
    setElementClasses(newClass);
    document.dispatchEvent(
      new CustomEvent("setClass", {
        detail: { className: cls.replace(/\s+/g, "_"), isRemove },
      })
    );
  };
  return (
    <div className={cn(className)}>
      <Combobox
        placeholder="Add Property"
        value={null}
        checkbox={false}
        triggerClassName="w-full"
        notFound={"No Properties Found"}
        items={Object.keys(styleControllers)
          .map((controller) => ({
            value: controller,
            label: controller,
          }))
          .filter((x) => !styleControlls.includes(x.value))}
        onSelect={(val: any) => {
          setStyleControlls((prev) => [...prev, val]);
        }}
      />
      <div className="border p-4 mb-2 rounded-lg font-medium text-sm flex flex-col items-stretch gap-4">
        <div className="flex justify-between">
          <Label htmlFor="dropdowneditor">Class Name</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Set Class</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Classes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.keys(classes).map((cls, i) => (
                <DropdownMenuCheckboxItem
                  key={i}
                  checked={elementClasses?.includes(cls)}
                  onCheckedChange={() => handleElementClass(cls)}
                >
                  {cls}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="attributes">
          <AccordionTrigger className="border hover:no-underline cursor-pointer hover:bg-muted p-4 mb-2 items-center">
            Attributes
          </AccordionTrigger>
          <AccordionContent className="flex flex-col p-4 border rounded-lg gap-4">
            {attributeControllers.map((attr, i) =>
              React.createElement(
                nativeAttributeControllers[attr as AttributeControllersKeys]
                  .Root,
                {
                  setAttributes: setAttributes,
                  attributes,
                  key: i,
                }
              )
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="listeners">
          <AccordionTrigger className="border hover:no-underline cursor-pointer hover:bg-muted p-4 mb-2 items-center">
            Listeners
          </AccordionTrigger>

          <AccordionContent className="flex flex-col p-4 border rounded-lg gap-4">
            <Combobox
              value={null}
              checkbox={false}
              triggerClassName="w-full"
              items={EventListeners.map((listener) => ({
                value: listener,
                label: listener,
              })).filter(
                (x) => !Object.keys(listenerControlls).includes(x.value)
              )}
              onSelect={(val: any) => {
                setListenerControlls((prev) => ({ ...prev, [val]: "" }));
              }}
              notFound={"No listeners found"}
              placeholder={"Add Listener"}
            />
            {Object.entries(listenerControlls).map(([lis, name], i) => (
              <ListenController
                key={i}
                functions={Object.keys(globalFunctions)}
                listen={lis}
                handler={handleSetListen}
                funcName={name}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
        {styleControlls.map((control, index) => (
          <AccordionItem value={control} key={index}>
            <AccordionTrigger>{control}</AccordionTrigger>
            <AccordionContent>
              {React.createElement(
                styleControllers[control as StyleControllerKeys].Root,
                {
                  setStyles,
                  styles,
                }
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
