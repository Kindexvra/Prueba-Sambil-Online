"use client"

import { Progress } from "@/components/ui/progress"

interface StatBarProps {
  label: string
  value: number
  maxValue: number
}

export default function StatBar({ label, value, maxValue }: StatBarProps) {
  // Calculate percentage for the progress bar
  const percentage = Math.min(100, (value / maxValue) * 100)

  // Determine color based on stat value
  const getColorClass = () => {
    if (percentage < 30) return "bg-red-500"
    if (percentage < 50) return "bg-orange-500"
    if (percentage < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span>{value}</span>
      </div>
      <Progress value={percentage} className={`h-2.5 ${getColorClass()}`} />
    </div>
  )
}
