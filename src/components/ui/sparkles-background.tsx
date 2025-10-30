"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

interface SparklesBackgroundProps {
  className?: string;
  particleDensity?: number;
  particleColor?: string;
  minSize?: number;
  maxSize?: number;
}

export const SparklesBackground: React.FC<SparklesBackgroundProps> = ({
  className = "",
  particleDensity = 600,
  particleColor = "#FFFFFF",
  minSize = 0.4,
  maxSize = 1,
}) => {
  return (
    <div className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}>
      <SparklesCore
        background="transparent"
        minSize={minSize}
        maxSize={maxSize}
        particleDensity={particleDensity}
        className="w-full h-full"
        particleColor={particleColor}
      />
    </div>
  );
};
