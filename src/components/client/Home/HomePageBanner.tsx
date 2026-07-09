"use client";

import { Text } from "@/components/ds/Text";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Calendar, Sparkles, Users, Flame } from "lucide-react";
import BgLottie from "./BgLottie";
import { sendGAEvent, sendGTMEvent } from "@next/third-parties/google";

export default function HomePageBanner() {
  const router = useRouter();

  const getTodayCST = () => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  };

  const handleBookClick = () => {
    sendGTMEvent({ event: "buttonClicked", value: "Reserve Your Spot" });
    sendGAEvent({
      action: "buttonClicked",
      category: "HomePageBanner",
      label: "Reserve Your Spot",
    });
    router.push("/reservations?date=" + getTodayCST());
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white pt-8">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-linear-to-b from-neutral-50 via-white to-neutral-50" />

      {/* Lottie Background - More visible on mobile */}
      <div className="absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none sm:opacity-75 md:opacity-100">
        <div className="w-full h-full sm:w-[120%] sm:h-[120%] md:w-[150%] md:h-[150%] md:scale-150">
          <BgLottie />
        </div>
      </div>

      {/* Main content - Account for header */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 sm:py-16 sm:px-6 lg:px-8 md:min-h-[calc(100vh-5rem)]">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full border border-neutral-200">
            <Flame className="w-4 h-4 text-neutral-900" />
            <Text size="sm" className="text-neutral-700 font-medium">
              Luxury Creative Experiences
            </Text>
          </div>
        </motion.div>

        {/* Main heading - Mobile first */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-center mb-6 max-w-4xl"
        >
          <Text
            as="h1"
            size="base"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-neutral-900 mb-4 tracking-tight leading-tight"
          >
            Craft Your{" "}
            <span className="relative inline-block">
              <span className="text-neutral-900">Masterpiece</span>
              <div className="absolute bottom-1 left-0 right-0 h-3 bg-yellow-300 -z-10" />
            </span>
          </Text>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="max-w-lg mx-auto px-4"
          >
            <Text
              size="sm"
              className="text-neutral-600 leading-relaxed sm:text-lg"
            >
              Join our exclusive candle-making classes. Create bespoke scents in
              an intimate, sophisticated setting.
            </Text>
          </motion.div>
        </motion.div>

        {/* Feature highlights - Stacked on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col gap-3 mb-8 w-full max-w-xs sm:flex-row sm:flex-wrap sm:justify-center sm:max-w-2xl sm:gap-4"
        >
          {[
            { icon: Users, text: "Small Groups" },
            { icon: Sparkles, text: "Premium Materials" },
            { icon: Calendar, text: "Flexible Times" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all"
            >
              <feature.icon className="w-5 h-5 text-neutral-900" />
              <Text size="sm" className="text-neutral-700 font-medium">
                {feature.text}
              </Text>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button - Full width on mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="w-full max-w-xs sm:max-w-sm"
        >
          <motion.button
            onClick={handleBookClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full group relative px-8 py-4 bg-neutral-900 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Subtle shine */}
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ["-200%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />

            <div className="relative flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5 text-white" />
              <Text
                size="sm"
                className="text-white font-bold tracking-wide sm:text-lg"
              >
                Reserve Your Spot
              </Text>
            </div>
          </motion.button>
        </motion.div>

        {/* Subtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-6 text-center"
        >
          <Text size="xs" className="text-neutral-500 sm:text-sm">
            Limited seats • Book today
          </Text>
        </motion.div>
      </div>

      {/* Decorative Lottie - Bottom corner on desktop */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.6 }}
        className="hidden lg:block absolute bottom-8 right-8 w-48 h-48 opacity-40 pointer-events-none"
      >
        <BgLottie />
      </motion.div>
    </div>
  );
}
