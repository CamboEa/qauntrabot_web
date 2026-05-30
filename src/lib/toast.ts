import { toast as toastify, type ToastOptions, type Id } from "react-toastify";

const defaults: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

function mergeOptions(options?: ToastOptions): ToastOptions {
  return { ...defaults, ...options };
}

export const toast = {
  success(message: string, options?: ToastOptions): Id {
    return toastify.success(message, mergeOptions(options));
  },
  error(message: string, options?: ToastOptions): Id {
    return toastify.error(message, mergeOptions(options));
  },
  info(message: string, options?: ToastOptions): Id {
    return toastify.info(message, mergeOptions(options));
  },
  warning(message: string, options?: ToastOptions): Id {
    return toastify.warning(message, mergeOptions(options));
  },
};
