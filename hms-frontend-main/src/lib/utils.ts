import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLocalData = (name: string) => {
   return localStorage.getItem(name);
};

export const setLocalData = (name: string, value: string) => {
   return localStorage.setItem(name, value);
};