import About from "@/components/client/Home/About";
import BannerAd from "@/components/client/Home/BannerAd";
import Welcome from "@/components/client/Home/Welcome";
import AllProducts from "@/components/server/AllProducts";

import React from "react";

export default function Home() {
  return (
    <>
      <BannerAd />
      <Welcome />
      <BannerAd rotate />
      <About />
      <AllProducts />
    </>
  );
}
