import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CustomCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  sublabel?: string;
  rightText?: string;
  containerClassName?: string;
}

export const CustomCheckbox = React.forwardRef<HTMLInputElement, CustomCheckboxProps>(({ label, sublabel, rightText, className, containerClassName, ...props }, ref) => {
  return (
    <div className={cn("flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors duration-200", containerClassName)}>
      <div className="flex items-center min-w-0">
        <div className="relative inline-flex items-center">
          <input type="checkbox" ref={ref} className={cn("peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md bg-white", "checked:bg-blue-500 checked:border-blue-500 transition-colors duration-200", "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30", className)} {...props} />
          <Check className="absolute w-4 h-4 text-white left-0.5 top-0.5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200" strokeWidth={3} />
        </div>
        {(label || sublabel) && (
          <div className="ml-3 min-w-0">
            {label && (
              <label htmlFor={props.id} className="text-sm font-medium text-gray-900 cursor-pointer truncate block">
                {label}
              </label>
            )}
            {sublabel && <span className="text-xs text-gray-500 truncate block">{sublabel}</span>}
          </div>
        )}
      </div>
      {rightText && <div className="text-sm text-gray-500">{rightText}</div>}
    </div>
  );
});

CustomCheckbox.displayName = "CustomCheckbox";
