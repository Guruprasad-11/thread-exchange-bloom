
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FloatingCard({ children, className, delay = 0 }: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const tl = gsap.timeline({ repeat: -1, delay });
    
    tl.to(cardRef.current, {
      y: -10,
      duration: 2,
      ease: "power2.inOut"
    })
    .to(cardRef.current, {
      y: 0,
      duration: 2,
      ease: "power2.inOut"
    });

    // Initial animation
    gsap.fromTo(cardRef.current, 
      { 
        opacity: 0, 
        y: 50,
        scale: 0.9
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: delay * 0.5,
        ease: "back.out(1.7)"
      }
    );

    return () => {
      tl.kill();
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "transform-gpu will-change-transform",
        className
      )}
    >
      {children}
    </div>
  );
}
