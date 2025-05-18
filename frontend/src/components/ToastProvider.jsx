import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#FFFFFF',
          color: '#1A1A1A',
          padding: '12px 16px',
          borderRadius: '5px',
          fontWeight: '500',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        success: {
          style: {
            background: '#FFFFFF',
            color: '#1A1A1A',
            boxShadow: '0 4px 12px rgba(0, 200, 118, 0.2)',
          },
          iconTheme: {
            primary: '#00C776',
            secondary: '#FFFFFF',
          },
        },
        error: {
          style: {
            background: '#FFFFFF',
            color: '#1A1A1A',
            boxShadow: '0 4px 12px rgba(255, 77, 79, 0.2)',
          },
          iconTheme: {
            primary: '#FF4D4F',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  );
};

export default ToastProvider;