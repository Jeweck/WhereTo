
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-between items-center mb-6 px-1",
        caption_label: "text-lg font-bold text-primary",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 opacity-70 hover:opacity-100 hover:bg-accent rounded-full"
        ),
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7 w-full mb-4",
        head_cell: "text-muted-foreground font-bold text-[0.85rem] uppercase text-center flex items-center justify-center h-10",
        row: "grid grid-cols-7 w-full",
        cell: "h-12 w-full text-center text-sm p-0 relative focus-within:relative focus-within:z-20 flex items-center justify-center",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-medium aria-selected:opacity-100 hover:bg-primary/10 rounded-full transition-all"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-md scale-110",
        day_today: "bg-secondary/20 text-primary font-bold border-2 border-secondary",
        day_outside:
          "day-outside text-muted-foreground/30 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-5 w-5" />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-5 w-5" />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
