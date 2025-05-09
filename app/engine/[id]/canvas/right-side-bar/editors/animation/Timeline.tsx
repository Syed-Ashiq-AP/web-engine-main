import { Slider } from "@/components/ui/slider";
import { ReactNode, useEffect, useState } from "react";
import { Keyframe } from "./Keyframe";
import { usePage } from "@/app/providers/page-provirder";
import { useAnimations } from "@/app/providers/animation-provider";

export const Timeline = () => {
  const timeNumbers = Array.from({ length: 21 }).map((_, i) => i * 5);
  const timeLine = Array.from({ length: 101 }).map((_, i) => (
    <div className="we-timespan" key={i}>
      <div
        className={`we-time-indicate ${
          i % 5 === 0 ? "we-time-indicate-long" : ""
        }`}
      >
        {i % 5 === 0 && (
          <span className=" text-xs font-medium text-neutral-400">{i}</span>
        )}
      </div>
    </div>
  ));

  const PageContext = usePage();
  if (!PageContext) return <></>;

  const { activeMenu } = PageContext;
  if (activeMenu !== "animation") return <></>;

  const AnimationsContext = useAnimations();
  if (!AnimationsContext) return <></>;

  const { animations, activeAnimation, time, setTime } = AnimationsContext;

  const [keyFrames, setKeyFrames] = useState<ReactNode[] | null>([]);

  useEffect(() => {
    if (!activeAnimation || !animations) {
      setKeyFrames(null);
      return;
    }
    const animationData = animations[activeAnimation];
    if (!animationData) {
      setKeyFrames(null);
      return;
    }

    setKeyFrames(
      Object.keys(animationData).map((position, i) => (
        <Keyframe key={i} position={parseInt(position)} />
      ))
    );
  }, [animations, activeAnimation]);

  if (!activeAnimation) return <></>;

  return (
    <div className="we-animation-editor-box">
      <div className="we-animation-editor">
        <div className="we-timeline">{timeLine}</div>
        <div className="we-keyframes-box">
          <div className="we-keyframe-time-indicator">
            {timeNumbers.map((_, i) => (
              <div key={i} className="we-keyframe-time-indicator-long"></div>
            ))}
          </div>
          <div className="absolute -top-3 w-[400%] z-50 h-[20px]">
            <Slider
              className="w-full"
              value={[time]}
              max={100}
              step={1}
              onValueChange={(val) => setTime(val[0])}
            />
          </div>
          {keyFrames}
        </div>
      </div>
    </div>
  );
};
