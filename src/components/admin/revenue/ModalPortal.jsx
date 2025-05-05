import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

// Custom Modal Portal Component
const ModalPortal = ({ children, isOpen }) => {
  // Create modal root if it doesn't exist
  useEffect(() => {
    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }

    // Clean up on unmount
    return () => {
      // Only remove if no other modals are open
      if (modalRoot.childNodes.length === 0) {
        document.body.removeChild(modalRoot);
      }
    };
  }, []);

  if (!isOpen) return null;

  // Use portal to render outside of component hierarchy
  return ReactDOM.createPortal(
    children,
    document.getElementById('modal-root') || document.body
  );
};

export default ModalPortal;