"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = React.memo(
  ({ className }: { className?: string }) => {
    // The original registry drop shipped these path strings corrupted (each
    // trailing cubic `C` had 4 numbers instead of 6, so the browser couldn't
    // parse them). Regenerate them from the same linear family, completing the
    // final cubic so every path is valid SVG.
    const paths = Array.from({ length: 50 }, (_, i) => {
      const x0 = -380 + i * 7
      const y0 = -189 - i * 8
      const cx = -312 + i * 7
      const cy = 216 - i * 8
      const mx = 152 + i * 7
      const my = 343 - i * 8
      const ex = 616 + i * 7
      const ey = 470 - i * 8
      const fx = 684 + i * 7
      const fy = 875 - i * 8
      return `M${x0} ${y0}C${x0} ${y0} ${cx} ${cy} ${mx} ${my}C${ex} ${ey} ${fx} ${fy} ${fx} ${fy}`
    });
    return (
      <div
        className={cn(
          "absolute inset-0 flex h-full w-full items-center justify-center [mask-repeat:no-repeat] [mask-size:40px]",
          className,
        )}
      >
        <svg
          className="pointer-events-none absolute z-0 h-full w-full"
          width="100%"
          height="100%"
          viewBox="0 0 696 316"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >

          {paths.map((path, index) => (
            <motion.path
              key={`path-` + index}
              d={path}
              stroke={`url(#linearGradient-${index})`}
              strokeOpacity="0.4"
              strokeWidth="0.5"
            ></motion.path>
          ))}
          <defs>
            {paths.map((_path, index) => (
              <motion.linearGradient
                id={`linearGradient-${index}`}
                key={`gradient-${index}`}
                initial={{
                  x1: "0%",
                  x2: "0%",
                  y1: "0%",
                  y2: "0%",
                }}
                animate={{
                  x1: ["0%", "100%"],
                  x2: ["0%", "95%"],
                  y1: ["0%", "100%"],
                  y2: ["0%", `${93 + Math.random() * 8}%`],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: Math.random() * 10,
                }}
              >
                <stop stopColor="#6366F1" stopOpacity="0"></stop>
                <stop stopColor="#818CF8"></stop>
                <stop offset="32.5%" stopColor="#4F46E5"></stop>
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"></stop>
              </motion.linearGradient>
            ))}

            <radialGradient
              id="paint0_radial_242_278"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
            >
              <stop offset="0.0666667" stopColor="#d4d4d4"></stop>
              <stop offset="0.243243" stopColor="#d4d4d4"></stop>
              <stop offset="0.43594" stopColor="white" stopOpacity="0"></stop>
            </radialGradient>
          </defs>
        </svg>
      </div>
    );
  },
);

BackgroundBeams.displayName = "BackgroundBeams";
