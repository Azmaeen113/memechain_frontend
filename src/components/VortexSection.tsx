import React from "react";
import { Vortex } from "@/components/ui/vortex";

interface VortexSectionProps {
  className?: string;
}

export const VortexSection = ({ className = "" }: VortexSectionProps) => {
  return (
    <div className={`relative h-full w-full ${className}`}>
      <Vortex
        backgroundColor="transparent"
        className="w-full h-full"
      />
    </div>
  );
};
