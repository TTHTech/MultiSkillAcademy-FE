import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const ModalPortal = ({ children, isOpen }) => {
  const elRef = useRef(null);
  
  if (!elRef.current) {
    elRef.current = document.createElement('div');
  }
  
  useEffect(() => {
    const modalRoot = document.getElementById('modal-root') || document.body;
    const el = elRef.current;
    
    if (isOpen && el) {
      modalRoot.appendChild(el);
      return () => {
        modalRoot.removeChild(el);
      };
    }
  }, [isOpen]);
  
  return isOpen ? createPortal(children, elRef.current) : null;
};

export default ModalPortal;