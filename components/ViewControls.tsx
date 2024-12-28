import { cn } from '@/lib/utils'
import { memo } from 'react'

type ViewControlsProps = {
  current: number
  min: number
  max: number
  onChange: (value: number) => void
}

export const ViewControls = memo(({ current, min, max, onChange }: ViewControlsProps) => (
  <div className="flex items-center justify-end gap-2 mb-4 px-4">
    {[...Array(max - min + 1)].map((_, idx) => {
      const value = min + idx
      return (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
            "hover:bg-primary-800/10 dark:hover:bg-primary-100/10",
            "focus:outline-none focus:ring-2 focus:ring-primary-500",
            value === current
              ? "bg-primary-900 dark:bg-primary-100 text-white dark:text-primary-900"
              : "bg-primary-100/50 dark:bg-primary-800/50 text-primary-900 dark:text-primary-100"
          )}
        >
          {value}
        </button>
      )
    })}
  </div>
))

ViewControls.displayName = 'ViewControls' 