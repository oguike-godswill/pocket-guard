"use client";

import { type ReactNode } from "react";
import {
  motion,
  type Variant,
  type Variants,
  type HTMLMotionProps,
} from "framer-motion";

const hidden: Variant = { opacity: 0, y: 24 };
const visible: Variant = { opacity: 1, y: 0 };

const fadeUpVariants: Variants = {
  hidden,
  visible: { ...visible, transition: { duration: 0.5, ease: "easeOut" } },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

type AnimationVariant = "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scaleUp";

const variantMap: Record<AnimationVariant, Variants> = {
  fadeUp: fadeUpVariants,
  fadeIn: fadeInVariants,
  slideLeft: slideLeftVariants,
  slideRight: slideRightVariants,
  scaleUp: scaleUpVariants,
};

export function Animate({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
  ...props
}: {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children" | "variants" | "initial" | "whileInView" | "viewport" | "transition" | "custom" | "style" | "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd">) {
  return (
    <motion.div
      variants={variantMap[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  staggerDelay = 0.08,
  ...props
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
} & Omit<HTMLMotionProps<"div">, "children" | "variants" | "initial" | "whileInView" | "viewport" | "transition" | "custom" | "style" | "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd">) {
  return (
    <motion.div
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variant = "fadeUp",
  ...props
}: {
  children: ReactNode;
  className?: string;
  variant?: AnimationVariant;
} & Omit<HTMLMotionProps<"div">, "children" | "variants" | "initial" | "whileInView" | "viewport" | "transition" | "custom" | "style" | "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd">) {
  return (
    <motion.div
      variants={variantMap[variant]}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
