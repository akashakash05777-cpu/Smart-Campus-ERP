import { useState } from 'react';

// Simple toast implementation
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = 'default' }) => {
    // For now, just log to console since we don't have a toast provider set up
    console.log(`Toast: ${title} - ${description}`);
    
    // In a real implementation, you would add the toast to state and display it
    const id = Date.now();
    const newToast = { id, title, description, variant };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return { toast, toasts };
};

export { useToast };