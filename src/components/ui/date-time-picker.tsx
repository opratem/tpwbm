"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  showTimePicker?: boolean;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  label,
  placeholder = "Select date & time",
  className = "",
  required = false,
  minDate,
  maxDate,
  showTimePicker = true,
  disabled = false,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"date" | "time">("date");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isYearOpen, setIsYearOpen] = useState(false);

  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        setSelectedDate(date);
        setCalendarDate(new Date(date.getFullYear(), date.getMonth(), 1));

        let hours = date.getHours();
        const minutes = date.getMinutes();

        if (hours >= 12) {
          setPeriod("PM");
          if (hours > 12) hours -= 12;
        } else {
          setPeriod("AM");
          if (hours === 0) hours = 12;
        }

        setHour(hours);
        setMinute(minutes);
      }
    }
  }, [value]);

  // Scroll to selected time when time tab is opened
  useEffect(() => {
    if (activeTab === "time") {
      setTimeout(() => {
        const hourEl = hourScrollRef.current?.querySelector(`[data-hour="${hour}"]`);
        const minuteEl = minuteScrollRef.current?.querySelector(`[data-minute="${minute}"]`);
        hourEl?.scrollIntoView({ block: "center", behavior: "smooth" });
        minuteEl?.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 100);
    }
  }, [activeTab, hour, minute]);

  const updateDateTime = useCallback(
    (date: Date | null, h: number, m: number, p: "AM" | "PM") => {
      if (!date) return;

      let hours = h;
      if (p === "PM" && hours !== 12) hours += 12;
      if (p === "AM" && hours === 12) hours = 0;

      const newDate = new Date(date);
      newDate.setHours(hours, m, 0, 0);

      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, "0");
      const day = String(newDate.getDate()).padStart(2, "0");
      const formattedHours = String(newDate.getHours()).padStart(2, "0");
      const formattedMinutes = String(newDate.getMinutes()).padStart(2, "0");

      onChange(`${year}-${month}-${day}T${formattedHours}:${formattedMinutes}`);
    },
    [onChange]
  );

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
    updateDateTime(newDate, hour, minute, period);

    if (showTimePicker) {
      setActiveTab("time");
    }
  };

  const handleHourClick = (h: number) => {
    setHour(h);
    updateDateTime(selectedDate, h, minute, period);
  };

  const handleMinuteClick = (m: number) => {
    setMinute(m);
    updateDateTime(selectedDate, hour, m, period);
  };

  const handlePeriodChange = (p: "AM" | "PM") => {
    setPeriod(p);
    updateDateTime(selectedDate, hour, minute, p);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCalendarDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCalendarDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
    updateDateTime(today, hour, minute, period);
  };

  const handleYearChange = (year: number) => {
    setCalendarDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(year);
      return newDate;
    });
    setIsYearOpen(false);
  };

  const clearSelection = () => {
    setSelectedDate(null);
    setHour(12);
    setMinute(0);
    setPeriod("AM");
    onChange("");
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === calendarDate.getMonth() &&
      today.getFullYear() === calendarDate.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === calendarDate.getMonth() &&
      selectedDate.getFullYear() === calendarDate.getFullYear()
    );
  };

  const isDisabled = (day: number) => {
    const date = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      day
    );
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) return true;
    if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999)))
      return true;
    return false;
  };

  const getDaysInMonth = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const formatDisplayValue = () => {
    if (!selectedDate) return placeholder;

    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    const dateStr = selectedDate.toLocaleDateString("en-US", options);
    if (!showTimePicker) return dateStr;

    const displayHour = hour.toString().padStart(2, "0");
    const displayMinute = minute.toString().padStart(2, "0");
    return `${dateStr}, ${displayHour}:${displayMinute} ${period}`;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal h-11 px-3",
              "border-gray-300 dark:border-gray-600",
              "hover:bg-gray-50 dark:hover:bg-gray-800",
              "focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              "transition-all duration-200",
              !selectedDate && "text-gray-400 dark:text-gray-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
            <span className="flex-1 truncate">{formatDisplayValue()}</span>
            {selectedDate && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-3 w-3 text-gray-400" />
              </button>
            )}
            {showTimePicker && <Clock className="ml-2 h-4 w-4 text-gray-400" />}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 shadow-xl border-gray-200 dark:border-gray-700"
          align="start"
          sideOffset={8}
        >
          {/* Tabs for Date/Time */}
          {showTimePicker && (
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setActiveTab("date")}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-all duration-200",
                  "flex items-center justify-center gap-2",
                  activeTab === "date"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <Calendar className="h-4 w-4" />
                Date
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("time")}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-all duration-200",
                  "flex items-center justify-center gap-2",
                  activeTab === "time"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <Clock className="h-4 w-4" />
                Time
              </button>
            </div>
          )}

          {/* Date Tab */}
          {activeTab === "date" && (
            <div className="p-4 space-y-4">
              {/* Calendar Header */}
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {monthNames[calendarDate.getMonth()]}
                  </span>

                  {/* Year Selector */}
                  <Popover open={isYearOpen} onOpenChange={setIsYearOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-sm font-semibold"
                      >
                        {calendarDate.getFullYear()}
                        <ChevronsUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 p-2" align="center">
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {years.map((year) => (
                          <button
                            type="button"
                            key={year}
                            onClick={() => handleYearChange(year)}
                            className={cn(
                              "w-full px-3 py-1.5 text-sm rounded-md text-left",
                              "hover:bg-gray-100 dark:hover:bg-gray-800",
                              "transition-colors duration-150",
                              year === calendarDate.getFullYear() &&
                                "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium"
                            )}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Today Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToToday}
                  className="text-xs h-7 px-3 text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  Today
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}

                {getDaysInMonth().map((day, index) => (
                  <div key={index} className="text-center aspect-square">
                    {day !== null ? (
                      <button
                        type="button"
                        disabled={isDisabled(day)}
                        onClick={() => handleDateClick(day)}
                        className={cn(
                          "w-full h-full rounded-lg text-sm font-medium",
                          "transition-all duration-150",
                          "hover:bg-gray-100 dark:hover:bg-gray-800",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                          isToday(day) &&
                            !isSelected(day) &&
                            "border-2 border-blue-400 text-blue-600 font-bold",
                          isSelected(day) &&
                            "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
                          isDisabled(day) &&
                            "opacity-30 cursor-not-allowed hover:bg-transparent"
                        )}
                      >
                        {day}
                      </button>
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Time Tab */}
          {activeTab === "time" && showTimePicker && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-center gap-3">
                {/* Hour Picker */}
                <div className="relative">
                  <div className="text-xs font-medium text-gray-400 text-center mb-2">
                    Hour
                  </div>
                  <div
                    ref={hourScrollRef}
                    className="h-40 w-16 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 scrollbar-thin"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <button
                        type="button"
                        key={h}
                        data-hour={h}
                        onClick={() => handleHourClick(h)}
                        className={cn(
                          "w-full py-2 text-center text-sm font-medium",
                          "transition-all duration-150",
                          "hover:bg-blue-100 dark:hover:bg-blue-900/50",
                          hour === h &&
                            "bg-blue-600 text-white hover:bg-blue-700"
                        )}
                      >
                        {h.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-2xl font-bold text-gray-300 dark:text-gray-600 mt-6">
                  :
                </span>

                {/* Minute Picker */}
                <div className="relative">
                  <div className="text-xs font-medium text-gray-400 text-center mb-2">
                    Min
                  </div>
                  <div
                    ref={minuteScrollRef}
                    className="h-40 w-16 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 scrollbar-thin"
                  >
                    {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                      <button
                        type="button"
                        key={m}
                        data-minute={m}
                        onClick={() => handleMinuteClick(m)}
                        className={cn(
                          "w-full py-2 text-center text-sm font-medium",
                          "transition-all duration-150",
                          "hover:bg-blue-100 dark:hover:bg-blue-900/50",
                          minute === m &&
                            "bg-blue-600 text-white hover:bg-blue-700"
                        )}
                      >
                        {m.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AM/PM Picker */}
                <div className="relative">
                  <div className="text-xs font-medium text-gray-400 text-center mb-2">
                    Period
                  </div>
                  <div className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handlePeriodChange("AM")}
                      className={cn(
                        "px-4 py-3 text-sm font-semibold",
                        "transition-all duration-150",
                        period === "AM"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePeriodChange("PM")}
                      className={cn(
                        "px-4 py-3 text-sm font-semibold border-t border-gray-200 dark:border-gray-700",
                        "transition-all duration-150",
                        period === "PM"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Selection Display */}
              <div className="text-center py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {hour.toString().padStart(2, "0")}:
                  {minute.toString().padStart(2, "0")}{" "}
                  <span className="text-blue-600">{period}</span>
                </div>
              </div>

              {/* Quick Time Presets */}
              <div>
                <div className="text-xs font-medium text-gray-400 mb-2">
                  Quick Select
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "9 AM", h: 9, m: 0, p: "AM" as const },
                    { label: "12 PM", h: 12, m: 0, p: "PM" as const },
                    { label: "3 PM", h: 3, m: 0, p: "PM" as const },
                    { label: "5 PM", h: 5, m: 0, p: "PM" as const },
                    { label: "6 PM", h: 6, m: 0, p: "PM" as const },
                    { label: "8 PM", h: 8, m: 0, p: "PM" as const },
                  ].map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setHour(preset.h);
                        setMinute(preset.m);
                        setPeriod(preset.p);
                        updateDateTime(selectedDate, preset.h, preset.m, preset.p);
                      }}
                      className={cn(
                        "text-xs h-8",
                        hour === preset.h &&
                          minute === preset.m &&
                          period === preset.p &&
                          "bg-blue-100 border-blue-400 text-blue-700"
                      )}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={!selectedDate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              <Check className="mr-1 h-4 w-4" />
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Simplified Date-only picker
export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Select date",
  className = "",
  required = false,
  minDate,
  maxDate,
  disabled = false,
}: Omit<DateTimePickerProps, "showTimePicker">) {
  return (
    <DateTimePicker
      value={value}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      className={className}
      required={required}
      minDate={minDate}
      maxDate={maxDate}
      showTimePicker={false}
      disabled={disabled}
    />
  );
}

// Time-only picker component
interface TimePickerProps {
  value: string; // HH:MM format
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export function TimePicker({
  value,
  onChange,
  label,
  placeholder = "Select time",
  className = "",
  required = false,
  disabled = false,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      if (!Number.isNaN(h) && !Number.isNaN(m)) {
        if (h >= 12) {
          setPeriod("PM");
          setHour(h === 12 ? 12 : h - 12);
        } else {
          setPeriod("AM");
          setHour(h === 0 ? 12 : h);
        }
        setMinute(m);
      }
    }
  }, [value]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const hourEl = hourScrollRef.current?.querySelector(`[data-hour="${hour}"]`);
        const minuteEl = minuteScrollRef.current?.querySelector(`[data-minute="${minute}"]`);
        hourEl?.scrollIntoView({ block: "center", behavior: "smooth" });
        minuteEl?.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, hour, minute]);

  const updateTime = useCallback(
    (h: number, m: number, p: "AM" | "PM") => {
      let hours = h;
      if (p === "PM" && hours !== 12) hours += 12;
      if (p === "AM" && hours === 12) hours = 0;

      const formattedHours = String(hours).padStart(2, "0");
      const formattedMinutes = String(m).padStart(2, "0");
      onChange(`${formattedHours}:${formattedMinutes}`);
    },
    [onChange]
  );

  const formatDisplayValue = () => {
    if (!value) return placeholder;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal h-11 px-3",
              "border-gray-300 dark:border-gray-600",
              "hover:bg-gray-50 dark:hover:bg-gray-800",
              "focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              !value && "text-gray-400 dark:text-gray-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <Clock className="mr-2 h-4 w-4 text-gray-400" />
            <span className="flex-1">{formatDisplayValue()}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-4 shadow-xl" align="start" sideOffset={8}>
          <div className="flex items-center justify-center gap-3">
            {/* Hour Picker */}
            <div className="relative">
              <div className="text-xs font-medium text-gray-400 text-center mb-2">Hour</div>
              <div
                ref={hourScrollRef}
                className="h-40 w-16 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <button
                    type="button"
                    key={h}
                    data-hour={h}
                    onClick={() => {
                      setHour(h);
                      updateTime(h, minute, period);
                    }}
                    className={cn(
                      "w-full py-2 text-center text-sm font-medium transition-all",
                      "hover:bg-blue-100 dark:hover:bg-blue-900/50",
                      hour === h && "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    {h.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-2xl font-bold text-gray-300 mt-6">:</span>

            {/* Minute Picker */}
            <div className="relative">
              <div className="text-xs font-medium text-gray-400 text-center mb-2">Min</div>
              <div
                ref={minuteScrollRef}
                className="h-40 w-16 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              >
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <button
                    type="button"
                    key={m}
                    data-minute={m}
                    onClick={() => {
                      setMinute(m);
                      updateTime(hour, m, period);
                    }}
                    className={cn(
                      "w-full py-2 text-center text-sm font-medium transition-all",
                      "hover:bg-blue-100 dark:hover:bg-blue-900/50",
                      minute === m && "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    {m.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            {/* AM/PM */}
            <div className="relative">
              <div className="text-xs font-medium text-gray-400 text-center mb-2">Period</div>
              <div className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setPeriod("AM");
                    updateTime(hour, minute, "AM");
                  }}
                  className={cn(
                    "px-4 py-3 text-sm font-semibold transition-all",
                    period === "AM"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100"
                  )}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPeriod("PM");
                    updateTime(hour, minute, "PM");
                  }}
                  className={cn(
                    "px-4 py-3 text-sm font-semibold border-t border-gray-200 dark:border-gray-700 transition-all",
                    period === "PM"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100"
                  )}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          {/* Current Selection */}
          <div className="text-center py-3 mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {hour.toString().padStart(2, "0")}:{minute.toString().padStart(2, "0")}{" "}
              <span className="text-blue-600">{period}</span>
            </div>
          </div>

          {/* Done button */}
          <div className="mt-4">
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Check className="mr-1 h-4 w-4" />
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
