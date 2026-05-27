import * as Burnt from 'burnt';

export const showSuccess = (title: string, message?: string) => {
  Burnt.toast({
    title,
    message,
    preset: 'done',
    duration: 2,
  });
};

export const showError = (title: string, message?: string) => {
  Burnt.toast({
    title,
    message,
    preset: 'error',
    duration: 2,
  });
};

export const showCustomToast = (title: string, message?: string) => {
  Burnt.toast({
    title,
    message,
    preset: 'custom',
    icon: {
      ios: { name: 'cart.fill', color: '#FF4D00' },
    },
    duration: 2,
  });
};
