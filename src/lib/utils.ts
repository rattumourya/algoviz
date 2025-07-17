import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, "$1-$2") // get all lowercase letters that are near to uppercase
        .replace(/[\s_]+/g, "-") // replace all spaces and low dash
        .toLowerCase();
}
