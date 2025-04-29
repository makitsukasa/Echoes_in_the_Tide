import type React from "react"
export function Bottle({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <div className="absolute z-10 w-12 h-16" style={style}>
      <div className="relative w-full h-full">
        {/* Bottle neck */}
        <div className="absolute top-0 left-1/2 w-4 h-5 -ml-2 bg-blue-100/80 rounded-t-lg"></div>

        {/* Bottle body */}
        <div className="absolute top-4 w-full h-12 bg-blue-100/80 rounded-b-lg"></div>

        {/* Cork */}
        <div className="absolute top-0 left-1/2 w-3 h-2 -ml-1.5 bg-amber-700/80 rounded-t-sm"></div>

        {/* Shine effect */}
        <div className="absolute top-6 left-2 w-1 h-6 bg-white/30 rounded-full"></div>
        <div className="absolute top-7 left-3 w-0.5 h-4 bg-white/20 rounded-full"></div>
      </div>
    </div>
  )
}
