import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const DateRangePicker = ({ value, onChange, placeholder = "Select dates" }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (selected) => {
    if (selected?.from && selected?.to) {
      onChange({
        from: selected.from.toISOString(),
        to: selected.to.toISOString(),
      });
      setOpen(false);
    }
  };

  const display =
    value?.from && value?.to
      ? `${format(new Date(value.from), "MMM d")} - ${format(
          new Date(value.to),
          "MMM d"
        )}`
      : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-[240px] justify-start text-left font-normal bg-gray-100 "
        >
          <CalendarIcon className="mr-2 h-4 w-4 " />
          {display}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 dark:bg-gray-700" align="end">
        <Calendar
          mode="range"
          selected={{
            from: value?.from ? new Date(value.from) : undefined,
            to: value?.to ? new Date(value.to) : undefined,
          }}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
