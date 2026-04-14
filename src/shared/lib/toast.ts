import { toast, ToastOptions } from 'react-toastify';

const toastOption: ToastOptions = { position: 'bottom-right', hideProgressBar: true, pauseOnHover: false, pauseOnFocusLoss: false };

export const toastSuccess = (text: string, autoClose: number | false = 3000) => {
  toast.success(text, { ...toastOption, autoClose });
};

export const toastError = (text: string, autoClose: number | false = 3000) => {
  toast.error(text, { ...toastOption, autoClose });
};

export const toastInfo = (text: string, autoClose: number | false = 3000) => {
  toast.info(text, { ...toastOption, autoClose });
};
