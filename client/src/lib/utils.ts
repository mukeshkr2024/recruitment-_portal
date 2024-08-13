import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const logOutSession = () => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem('access_token');

  console.log(token);
  // Remove the token from localStorage
  localStorage.removeItem('access_token');
};
