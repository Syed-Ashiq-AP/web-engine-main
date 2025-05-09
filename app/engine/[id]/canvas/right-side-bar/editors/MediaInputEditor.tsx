import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { useRef } from "react";
import { Label } from "@/components/ui/label";

type MediaInputEditorType = {
  title: string;
  onUpload: (file: any) => void;
};

export const MediaInputEditor = ({ title, onUpload }: MediaInputEditorType) => {
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    onUpload(files[0]);
  };

  return (
    <div className={"flex justify-between"}>
      <Label htmlFor="typographydropdown">{title}</Label>
      <Button
        onClick={() => {
          hiddenFileInput.current && hiddenFileInput.current.click();
        }}
        size={"icon"}
        variant={"outline"}
      >
        <Image />
      </Button>
      <input
        type="file"
        onChange={handleUpload}
        ref={hiddenFileInput}
        style={{ display: "none" }}
        // accept={".png,.jpg,.jpeg,.webp,.svg"}
      />
    </div>
  );
};
