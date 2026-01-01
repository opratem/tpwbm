"use client";

import { useState } from "react";
import { DateTimePicker, DatePicker, TimePicker } from "@/components/ui/date-time-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DatePickerDemo() {
  const [dateTime, setDateTime] = useState<string>("");
  const [dateOnly, setDateOnly] = useState<string>("");
  const [timeOnly, setTimeOnly] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");

  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Date & Time Picker Components
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Intuitive, modern date and time selection components
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Full DateTime Picker */}
          <Card>
            <CardHeader>
              <CardTitle>Date & Time Picker</CardTitle>
              <CardDescription>
                Combined date and time selection with tab interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DateTimePicker
                label="Event Date & Time"
                value={dateTime}
                onChange={setDateTime}
                placeholder="Select date and time"
                required
              />
              <div className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <strong>Value:</strong> {dateTime || "Not selected"}
              </div>
            </CardContent>
          </Card>

          {/* Date Only Picker */}
          <Card>
            <CardHeader>
              <CardTitle>Date Picker</CardTitle>
              <CardDescription>
                Date-only selection without time component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DatePicker
                label="Birth Date"
                value={dateOnly}
                onChange={setDateOnly}
                placeholder="Select date"
              />
              <div className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <strong>Value:</strong> {dateOnly || "Not selected"}
              </div>
            </CardContent>
          </Card>

          {/* Time Only Picker */}
          <Card>
            <CardHeader>
              <CardTitle>Time Picker</CardTitle>
              <CardDescription>
                Standalone time selection with scrollable interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TimePicker
                label="Meeting Time"
                value={timeOnly}
                onChange={setTimeOnly}
                placeholder="Select time"
                required
              />
              <div className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <strong>Value:</strong> {timeOnly || "Not selected"}
              </div>
            </CardContent>
          </Card>

          {/* With Min/Max Date */}
          <Card>
            <CardHeader>
              <CardTitle>With Date Constraints</CardTitle>
              <CardDescription>
                Date picker with minimum and maximum date restrictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DateTimePicker
                label="Future Event"
                value={eventDate}
                onChange={setEventDate}
                placeholder="Select a future date"
                minDate={minDate}
                maxDate={maxDate}
                required
              />
              <div className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <p><strong>Min:</strong> {minDate.toLocaleDateString()}</p>
                <p><strong>Max:</strong> {maxDate.toLocaleDateString()}</p>
                <p><strong>Value:</strong> {eventDate || "Not selected"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                Tab-based interface for date and time
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                Year dropdown for quick navigation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                Today button for quick selection
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                Scrollable hour and minute pickers
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                Quick time presets (9 AM, 12 PM, etc.)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                Clear button to reset selection
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                Min/Max date constraints
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                Disabled state support
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                Auto-scroll to selected time
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                Dark mode support
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
