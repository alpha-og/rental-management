import React from "react";
import { cn } from "@client/lib/utils";
import { Input } from "@client/components/ui/input";

export const FormField: React.FC<{
    label: string;
    value: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}> = ({ label, value, onChange, disabled = false, placeholder, className }) => (
    <div className={cn("space-y-1", className)}>
        <label className="text-sm font-medium text-gray-700">{label} :</label>
        <Input
            value={value || ""} // Ensure value is never undefined
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className="h-8 text-sm"
        />
    </div>
);
