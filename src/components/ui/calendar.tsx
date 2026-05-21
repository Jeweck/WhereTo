
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
      className={cn("p-4 bg-white rounded-xl", className)}
      classNames={{
        months: "relative flex flex-col gap-y-4",
        month: "space-y-6",
        month_caption: "flex justify-between items-center px-1 mb-4",
        caption_label: "text-xl font-black text-primary",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 opacity-70 hover:opacity-100 rounded-full"
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 opacity-70 hover:opacity-100 rounded-full"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex w-full mb-2",
        weekday: "text-muted-foreground font-bold text-[0.7rem] flex-1 text-center uppercase tracking-widest",
        week: "flex w-full mt-1",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1 flex items-center justify-center h-10",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-bold aria-selected:opacity-100 rounded-full hover:bg-accent flex items-center justify-center transition-all"
        ),
        selected: "bg-green-500 text-white hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white shadow-md rounded-full scale-105",
        today: "text-primary font-black ring-2 ring-primary/10",
        outside: "opacity-0 pointer-events-none",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      formatters={{
        formatCaption: (date, options) => {
          const month = date.toLocaleString(options?.locale?.code || 'en-US', { month: 'long' });
          const year = date.getFullYear();
          return `${month} ${year}`;
        },
        formatWeekdayName: (date) => {
          const names = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
          return names[date.getDay()];
        }
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-5 w-5" />,
        IconRight: () => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
