"use client"
import React, { useRef, useEffect } from 'react';
import styles from './notifications.module.css';

interface NotificationPopoverProps {
  open: boolean;
  onToggle: () => void;
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({ open, onToggle }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      onToggle(); // Dışarıya tıklanırsa popover'ı kapat
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className={styles.popoverContainer} ref={popoverRef}>
      {open && (
        <div className={styles.popoverContent}>
          <p>Here are your notifications!</p>
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;
