import * as React from "react"
import { cn } from "@/lib/utils"

interface OceanProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Ocean = React.forwardRef<HTMLDivElement, OceanProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-blue-900 to-blue-950",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Ocean.displayName = "Ocean"

export { Ocean }
