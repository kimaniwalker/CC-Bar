"use client";
import { Stack } from "@/components/ds/Stack";
import { Text } from "@/components/ds/Text";
import React from "react";
import { motion } from "motion/react";

export default function Welcome() {
  return (
    <div className="flex flex-col justify-center p-4">
      <Stack justify="center">
        <Text as="div" size="xxl" className="text-center">
          <motion.h2
            initial={{
              opacity: 0,
              y: -25,
            }}
            whileInView={{
              scale: [0.75, 1],
              opacity: 1,
              y: 0,
            }}
            transition={{
              ease: "easeInOut",
              duration: 2.5,
              delay: 0.5,
            }}
            viewport={{ once: true, amount: 0.5 }}
          >
            CANDLE COW BAR
          </motion.h2>
        </Text>
      </Stack>
      <Stack
        align="center"
        direction="col"
        gap="lg"
        className="mt-8 mb-8 w-full"
      >
        <div className="sm:max-w-auto md:max-w-256 p-4">
          <Text as="div" size="lg">
            <motion.h3
              initial={{
                y: 50,
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                ease: "easeInOut",
                duration: 2.5,
                delay: 1,
              }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <p className="mb-4 text-center">Welcome to your new favorite creative escape. Located at 4052 Helena Rd in Helena, AL, our candle bar is a space where scent, creativity, and experience come together.</p>

              <p className="mb-4 text-center">
                We specialize in handcrafted candles, soaps, and custom fragrance products—but what truly sets us apart is the experience. Step inside and create your own signature candle from a curated selection of premium scents, designed to reflect your mood, style, and story. Whether you're stopping by for a relaxing solo visit, a date night, or a group outing, our space is built to make every moment memorable.
              </p>

              <div className="mt-12 w-full flex justify-center">
                <button className="px-4 py-2 bg-black text-white rounded-3xl hover:bg-gray-800 transition">
                  Book Your Experience
                </button>
              </div>


            </motion.h3>
          </Text>
        </div>
      </Stack>
    </div>
  );
}
