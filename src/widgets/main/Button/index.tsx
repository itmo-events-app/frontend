import React from 'react';
import { appendClassName } from '@shared/util';
import styles from './index.module.css';

type Props = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: any;
  className?: string;
};

function Button(props: Props) {
  return (
    <button className={appendClassName(styles.button, props.className)} onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export default Button;
