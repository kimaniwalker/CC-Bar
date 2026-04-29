"use client";
import { Text } from "@/components/ds/Text";
import React from "react";
import { motion } from "motion/react";
import { Stack } from "@/components/ds/Stack";
import { useRouter } from 'next/navigation';
export default function About() {
  
  const router = useRouter();
  const getTodayCST = () => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  }
  const handleBookClick = () => {
    router.push('/reservations?date=' + getTodayCST());
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed bg-[url('/wavy.png')] bg-blend-darken"></div>
      <div className="relative z-10 flex flex-col h-full">
        <Stack justify="center">
                <Text as="div" size="xxl" className="text-center text-white z-10 absolute top-25">
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
                className="mt-8 mb-8 w-full absolute bottom-50"
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
                     
        
                      <div className="mt-12 w-full flex justify-center">
                        <button onClick={handleBookClick} className="px-8 py-4 bg-black text-white rounded-4xl hover:bg-gray-800 transition z-10">
                          Book Your Experience
                        </button>
                      </div>
        
        
                    </motion.h3>
                  </Text>
                </div>
              </Stack>
      </div>
    </div>
  );
}
