import About from "@/components/client/Home/About";
import FeaturedProducts from "@/components/server/FeaturedProducts";

export default function Home() {
  return (
    <>
      <About />
      <FeaturedProducts />
      <About />
    </>
  );
}
