"use client";

import animationData from "../../../../public/bg2.json";
import { useLottie } from "lottie-react";

const BgLottie = () => {
  const defaultOptions = {
    animationData: animationData,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { View, setSpeed } = useLottie(defaultOptions);

  // Slow down to 70% speed
  setSpeed(0.6);

  return (
    <div className="">
      <div className="w-full h-full">{View}</div>
    </div>
  );
};

export default BgLottie;
