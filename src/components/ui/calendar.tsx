
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
  showOutsideDays = false,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-between items-center px-2 mb-6",
        caption_label: "text-lg font-bold text-foreground",
        nav: "flex items-center space-x-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100"
        ),
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7 mb-2",
        head_cell: "text-muted-foreground font-medium text-[0.8rem] h-9 flex items-center justify-center uppercase",
        row: "grid grid-cols-7 w-full mt-1",
        cell: "h-9 w-9 flex items-center justify-center text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-full hover:bg-accent flex items-center justify-center transition-all"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white shadow-md",
        day_today: "text-blue-600 font-bold border border-blue-100",
        day_outside: "invisible",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      formatters={{
        formatCaption: (date, options) => {
          const month = date.toLocaleString(options?.locale?.code || 'en-US', { month: 'long' });
          const year = date.getFullYear();
          return `${month} ${year}`;
        },
        formatWeekdayName: (date) => {
          // Return single letter for the weekday (S, M, T, W, T, F, S)
          return date.toLocaleString('en-US', { weekday: 'narrow' });
        }
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
