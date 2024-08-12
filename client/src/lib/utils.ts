import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from 'js-cookie';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const logOutSession = () => {
  const token = Cookies.get('access_token');

  console.log(token);
  Cookies.remove('access_token');
}