"use client";
import { Stack } from "@/components/ds/Stack";
import { Text } from "@/components/ds/Text";
import React from "react";
import { motion } from "motion/react";

export default function Welcome() {
  return (
    <div className="flex flex-col justify-center pt-16 pb-16">
      <Stack justify="center">
        <Text as="div" size="xxl">
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
            viewport={{ once: true, amount: 0.5 }}
          >
            CHARMÈUR
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
              Charmeur (pronounced ʃaʁmœʁ) is a French noun, typically
              masculine, that translates to charmer in English. It refers to
              someone who possesses charm, is captivating, or has the ability to
              attract and please others. It can also be used to describe someone
              who is flirtatious or seductive. It`s gotta be in you, NOT on you.
            </motion.h3>
          </Text>
        </div>
      </Stack>
    </div>
  );
}
