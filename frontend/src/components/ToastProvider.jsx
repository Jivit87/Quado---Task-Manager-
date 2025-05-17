import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#2A2A2A',
          color: '#FFFFFF',
          border: '1px solid #00FF85',
        },
        success: {
          style: {
            border: '1px solid #00FF85',
          },
          iconTheme: {
            primary: '#00FF85',
            secondary: '#FFFFFF',
          },
        },
        error: {
          style: {
            border: '1px solid #FF2965',
          },
          iconTheme: {
            primary: '#FF2965',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  );
};

export default ToastProvider;