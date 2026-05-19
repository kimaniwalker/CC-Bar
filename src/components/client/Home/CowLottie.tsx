// app/components/MyLottieComponent.tsx

"use client";

import animationData from "../../../../public/cow.json";
import { useLottie } from "lottie-react";

const CowLottie = () => {
  const defaultOptions = {
    animationData: animationData,
    loop: true,
  };

  const { View } = useLottie(defaultOptions);

  return (
    <div className="">
      <div className="w-full h-full">{View}</div>
    </div>
  );
};

export default CowLottie;
