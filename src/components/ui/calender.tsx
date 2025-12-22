"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/events";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

interface CalendarProps {
  events?: Event[];
  onEventClick?: (event: Event) => void;
  className?: string;
  showCreateButton?: boolean;
  onCreateEvent?: () => void;
}

export default function Calendar({
                                   events = [],
                                   onEventClick,
                                   className = "",
                                   showCreateButton = false,
                                   onCreateEvent,
                                 }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  const today = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get the first day of the month and how many days in the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get events for the current month
  const monthEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate);
    return (
        eventDate.getFullYear() === currentYear &&
        eventDate.getMonth() === currentMonth
    );
  });

  // Group events by date
  const eventsByDate = monthEvents.reduce((acc, event) => {
    const date = new Date(event.startDate).getDate();
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<number, Event[]>);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(new Date(currentYear, currentMonth + (direction === "next" ? 1 : -1), 1));
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "worship":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "fellowship":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "youth":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "education":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "outreach":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isToday = (day: number) => {
    return (
        today.getDate() === day &&
        today.getMonth() === currentMonth &&
        today.getFullYear() === currentYear
    );
  };

  const renderCalendarDays = () => {
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
          <div key={`empty-${i}`} className="h-24 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50" />
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = eventsByDate[day] || [];
      const isTodayDate = isToday(day);

      days.push(
          <div
              key={day}
              className={`h-24 border border-gray-200 dark:border-gray-700 p-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  isTodayDate ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600" : ""
              }`}
          >
            <div className={`text-sm font-medium mb-1 ${isTodayDate ? "text-blue-600 dark:text-blue-400" : ""}`}>
              {day}
            </div>
            <div className="space-y-1 overflow-hidden">
              {dayEvents.slice(0, 2).map((event) => (
                  <div
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className="text-xs px-1 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity truncate"
                      style={{
                        backgroundColor: getCategoryColor(event.category).includes("blue") ? "#dbeafe" :
                            getCategoryColor(event.category).includes("green") ? "#dcfce7" :
                                getCategoryColor(event.category).includes("purple") ? "#f3e8ff" :
                                    getCategoryColor(event.category).includes("orange") ? "#fed7aa" :
                                        getCategoryColor(event.category).includes("red") ? "#fecaca" : "#f3f4f6",
                        color: getCategoryColor(event.category).includes("blue") ? "#1e40af" :
                            getCategoryColor(event.category).includes("green") ? "#166534" :
                                getCategoryColor(event.category).includes("purple") ? "#7c3aed" :
                                    getCategoryColor(event.category).includes("orange") ? "#ea580c" :
                                        getCategoryColor(event.category).includes("red") ? "#dc2626" : "#374151",
                      }}
                      title={`${event.title} - ${formatTime(event.startDate)}`}
                  >
                    {event.title}
                  </div>
              ))}
              {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 px-1">
                    +{dayEvents.length - 2} more
                  </div>
              )}
            </div>
          </div>
      );
    }

    return days;
  };

  return (
      <div className={`space-y-4 ${className}`}>
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <Button
                variant="outline"
                size="sm"
                onClick={navigateToToday}
                className="text-blue-600 hover:text-blue-700"
            >
              Today
            </Button>
            {showCreateButton && (
                <Button
                    variant="default"
                    size="sm"
                    onClick={onCreateEvent}
                    className="ml-2"
                >
                  + Create Event
                </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                  variant={view === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("month")}
                  className="rounded-none"
              >
                Month
              </Button>
              <Button
                  variant={view === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("week")}
                  className="rounded-none"
              >
                Week
              </Button>
              <Button
                  variant={view === "day" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("day")}
                  className="rounded-none"
              >
                Day
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-0">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b">
              {dayNames.map((day) => (
                  <div
                      key={day}
                      className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                  >
                    {day}
                  </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {renderCalendarDays()}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Event Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-sm">Worship</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-sm">Fellowship</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500"></div>
                <span className="text-sm">Youth</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-500"></div>
                <span className="text-sm">Education</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-sm">Outreach</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events Summary */}
        {monthEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Events This Month ({monthEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {monthEvents
                      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                      .map((event) => (
                          <div
                              key={event.id}
                              onClick={() => onEventClick?.(event)}
                              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                          >
                            <div className="w-12 text-center">
                              <div className="text-sm font-bold text-blue-600">
                                {new Date(event.startDate).getDate()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(event.startDate).toLocaleDateString("en-US", { month: "short" })}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium truncate">{event.title}</h4>
                                <Badge className={getCategoryColor(event.category)}>
                                  {event.category}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatTime(event.startDate)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                                {event.requiresRegistration && (
                                    <div className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      <span>{event.registeredCount}/{event.capacity || "∞"}</span>
                                    </div>
                                )}
                              </div>
                            </div>
                          </div>
                      ))}
                </div>
              </CardContent>
            </Card>
        )}
      </div>
  );
}
