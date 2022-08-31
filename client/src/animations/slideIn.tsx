import React from "react";
import { useSpring } from "react-spring";
import useWindowDimensions from "../hooks/useWindowDimensions";

interface Props {
  direction: "top" | "right" | "bottom" | "left";
  delay?: number;
}

const SlideIn = ({ direction, delay = 250 }: Props) => {
  const { width, height } = useWindowDimensions();

  let startTransform =
    direction === "top"
      ? `translateY(-${height}px)`
      : direction === "bottom"
      ? `translateY(${height}px)`
      : direction === "left"
      ? `translateX(-${width}px)`
      : `translateX(${width}px)`;

  let endTransform =
    direction === "top" || direction === "bottom"
      ? "translateY(0)"
      : "translateX(0px)";

  return useSpring({
    from: { transform: startTransform },
    to: { transform: endTransform },
    delay: delay
  });
};

export default SlideIn;
