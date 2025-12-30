"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "date"
    | "datetime-local"
    | "url";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  description?: string;
  validation?: (value: unknown) => string | null;
  disabled?: boolean;
  defaultValue?: string | boolean | number;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  multiple?: boolean;
  autoComplete?: string;
}

interface EnhancedFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
  className?: string;
  columns?: 1 | 2 | 3;
}

export function EnhancedForm({
  fields,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  onCancel,
  loading = false,
  error: externalError,
  success: externalSuccess,
  className = "",
  columns = 1,
}: EnhancedFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    for (const field of fields) {
      initial[field.name] = field.defaultValue ?? (field.type === "checkbox" ? false : "");
    }
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: FormField, value: unknown): string | null => {
    // Required validation
    if (field.required) {
      if (field.type === "checkbox" && !value) {
        return `${field.label} is required`;
      }
      if (!value || (typeof value === "string" && !value.trim())) {
        return `${field.label} is required`;
      }
    }

    // Custom validation
    if (field.validation && value) {
      return field.validation(value);
    }

    // Email validation
    if (field.type === "email" && value && typeof value === "string") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    // URL validation
    if (field.type === "url" && value && typeof value === "string") {
      try {
        new URL(value);
      } catch {
        return "Please enter a valid URL";
      }
    }

    // Number validation
    if (field.type === "number" && value) {
      const num = Number(value);
      if (field.min !== undefined && num < field.min) {
        return `Minimum value is ${field.min}`;
      }
      if (field.max !== undefined && num > field.max) {
        return `Maximum value is ${field.max}`;
      }
    }

    return null;
  };

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field was touched
    if (touched[name]) {
      const field = fields.find((f) => f.name === name);
      if (field) {
        const error = validateField(field, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error || "",
        }));
      }
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));

    const field = fields.find((f) => f.name === name);
    if (field) {
      const error = validateField(field, formData[name]);
      setErrors((prev) => ({
        ...prev,
        [name]: error || "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    }

    setErrors(newErrors);
    setTouched(
      Object.fromEntries(fields.map((field) => [field.name, true]))
    );

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name];
    const error = errors[field.name];
    const showError = touched[field.name] && error;

    return (
      <div key={field.name} className="space-y-2">
        <Label
          htmlFor={field.name}
          className="text-sm font-medium text-[hsl(218,31%,18%)]"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {field.type === "textarea" ? (
          <Textarea
            id={field.name}
            name={field.name}
            value={value as string}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            placeholder={field.placeholder}
            disabled={field.disabled || loading || isSubmitting}
            rows={field.rows || 4}
            className={`${
              showError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-slate-200 focus:border-[hsl(218,31%,18%)] focus:ring-[hsl(218,31%,18%)]"
            }`}
          />
        ) : field.type === "select" ? (
          <Select
            value={value as string}
            onValueChange={(val) => handleChange(field.name, val)}
            disabled={field.disabled || loading || isSubmitting}
          >
            <SelectTrigger
              className={`${
                showError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-200 focus:border-[hsl(218,31%,18%)] focus:ring-[hsl(218,31%,18%)]"
              }`}
            >
              <SelectValue placeholder={field.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : field.type === "checkbox" ? (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={value as boolean}
              onCheckedChange={(checked) => handleChange(field.name, checked)}
              disabled={field.disabled || loading || isSubmitting}
              className="border-slate-300"
            />
            <label
              htmlFor={field.name}
              className="text-sm text-slate-700 cursor-pointer"
            >
              {field.placeholder || field.label}
            </label>
          </div>
        ) : (
          <Input
            id={field.name}
            name={field.name}
            type={field.type}
            value={value as string}
            onChange={(e) =>
              handleChange(
                field.name,
                field.type === "number" ? Number(e.target.value) : e.target.value
              )
            }
            onBlur={() => handleBlur(field.name)}
            placeholder={field.placeholder}
            disabled={field.disabled || loading || isSubmitting}
            min={field.min}
            max={field.max}
            step={field.step}
            accept={field.accept}
            multiple={field.multiple}
            autoComplete={field.autoComplete}
            className={`${
              showError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-slate-200 focus:border-[hsl(218,31%,18%)] focus:ring-[hsl(218,31%,18%)]"
            }`}
          />
        )}

        {field.description && !showError && (
          <p className="text-xs text-slate-500">{field.description}</p>
        )}

        {showError && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3 w-3" />
            {error}
          </div>
        )}
      </div>
    );
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {externalError && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{externalError}</AlertDescription>
        </Alert>
      )}

      {externalSuccess && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{externalSuccess}</AlertDescription>
        </Alert>
      )}

      <div className={`grid ${gridCols[columns]} gap-6`}>
        {fields.map(renderField)}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading || isSubmitting}
            className="border-slate-300 hover:bg-slate-50"
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading || isSubmitting}
          className="bg-[hsl(218,31%,18%)] hover:bg-[hsl(218,31%,25%)] text-white gap-2"
        >
          {(loading || isSubmitting) && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
