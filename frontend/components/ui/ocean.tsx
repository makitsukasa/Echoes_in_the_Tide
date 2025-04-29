"use client"

import { useEffect, useRef } from "react"
import { Bottle } from "./bottle"

export function Ocean() {
  const oceanRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!oceanRef.current) return

      const { clientX, clientY } = e
      const { width, height } = oceanRef.current.getBoundingClientRect()

      // Calculate relative position
      const x = clientX / width - 0.5
      const y = clientY / height - 0.5

      // Apply subtle parallax effect
      oceanRef.current.style.transform = `translate(${x * 10}px, ${y * 10}px)`
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Ocean background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-blue-300/30 to-blue-500/70"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 15 Q 25 5, 50 15 Q 75 25, 100 15 L 100 20 L 0 20 Z' fill='rgba(255, 255, 255, 0.3)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 40px",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "bottom",
          animation: "wave 10s linear infinite",
        }}
      />

      {/* Wave animation */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 15 Q 25 5, 50 15 Q 75 25, 100 15 L 100 20 L 0 20 Z' fill='rgba(255, 255, 255, 0.5)'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 30px",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "bottom",
          animation: "wave 7s linear infinite",
        }}
      />

      {/* Parallax ocean container */}
      <div
        ref={oceanRef}
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ willChange: "transform" }}
      >
        {/* Random bottles */}
        <Bottle
          style={{
            left: "20%",
            top: "40%",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <Bottle
          style={{
            left: "65%",
            top: "60%",
            animation: "float 10s ease-in-out infinite 1s",
          }}
        />
        <Bottle
          style={{
            left: "40%",
            top: "70%",
            animation: "float 9s ease-in-out infinite 2s",
          }}
        />
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes wave {
          0% {
            background-position-x: 0;
          }
          100% {
            background-position-x: 200px;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(1deg);
          }
          50% {
            transform: translateY(-15px) rotate(-1deg);
          }
        }
      `}</style>
    </div>
  )
}
