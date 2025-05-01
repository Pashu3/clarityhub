"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type ButtonVariant = "default" | "outline" | "ghost" | "link" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  animated?: boolean;
  as?: any; // Allow rendering as different element/component
  href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    children, 
    variant = "default", 
    size = "md", 
    isLoading = false,
    animated = true,
    disabled,
    as,
    href,
    ...props 
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variantStyles = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "underline-offset-4 hover:underline text-primary",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    };
    
    const sizeStyles = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-11 px-6 text-base",
      icon: "h-10 w-10 p-0"
    };

    const ComponentToUse = as || (animated ? motion.button : "button");
    const animationProps = animated ? {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
    } : {};

    // If it's a Link component
    if (as === Link) {
      return (
        <Link
          href={href || "#"}
          className={cn(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            className
          )}
          {...(props as any)}
        >
          {isLoading ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : null}
          {children}
        </Link>
      );
    }
    
    return (
      <ComponentToUse
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          isLoading && "opacity-80 pointer-events-none",
          className
        )}
        disabled={isLoading || disabled}
        ref={ref}
        {...animationProps}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </ComponentToUse>
    );
  }
);

Button.displayName = "Button";