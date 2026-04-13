"use client";
import { Text } from "@/components/ds/Text";
import React from "react";
import { motion } from "motion/react";

export default function About() {
  return (
    <div className="h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed bg-[url('/sand.jpg')] bg-blend-darken"></div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <Text as="div" size="xxl" className="text-white">
          <motion.h2
            initial={{
              opacity: 0,
              y: 50,
            }}
            whileInView={{
              scale: [0.75, 1.5],
              opacity: 1,
              y: 0,
            }}
            transition={{
              ease: "easeInOut",
              duration: 2.5,
              delay: 0.5,
            }}
            viewport={{ once: true, amount: 0.2 }}
          >
            Our Story
          </motion.h2>
        </Text>
      </div>
    </div>
  );
}
