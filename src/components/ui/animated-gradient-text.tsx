
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function AnimatedGradientText({ 
  children, 
  className, 
  animate = true 
}: AnimatedGradientTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!animate || !textRef.current) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    tl.to(textRef.current, {
      backgroundPosition: "200% center",
      duration: 3,
      ease: "power2.inOut"
    });

    return () => {
      tl.kill();
    };
  }, [animate]);

  return (
    <span
      ref={textRef}
      className={cn(
        "bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] bg-clip-text text-transparent",
        className
      )}
      style={{ backgroundPosition: "0% center" }}
    >
      {children}
    </span>
  );
}
