import { appendClassName } from '@shared/util';
import styles from './index.module.css';
import { forwardRef } from 'react';

type Props = {
  className?: string;
  children?: any;
  onClose?: () => void;
  text?: string;
  style?: React.CSSProperties;
};

const Dialog = forwardRef((props: Props, ref: any) => {
  return (
    <div className={appendClassName(styles.dialog, props.className)} style={props.style} ref={ref}>
      <div className={styles.dop__wrap}>
        <div className={styles.header}>
          <div className={styles.name}>{props.text}</div>
          <button className={styles.close} onClick={props.onClose}>
            ×
          </button>
        </div>
        <div className={styles.content}>{props.children}</div>
      </div>
    </div>
  );
});

export default Dialog;
