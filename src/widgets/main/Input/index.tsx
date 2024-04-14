import { appendClassName } from '@shared/util';
import styles from './index.module.css';
import React, { FC, HTMLProps } from 'react';

export type InputProps = {
  value: string;
  placeholder?: string;
  className?: string;
  errorText?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
} & Omit<HTMLProps<HTMLInputElement>, 'onChange'>;

const Input: FC<InputProps> = ({ errorText, className, ...rest }) => {
  const error = errorText != undefined && errorText != '';
  const visibilityStyle = error ? styles.visible : styles.hidden;
  const inputErrorStyle = error ? styles.input_error : undefined;

  return (
    <div className={appendClassName(styles.root, className)}>
      <input className={appendClassName(styles.input, inputErrorStyle)} {...rest} />
      {errorText && <p className={appendClassName(styles.helper_error, visibilityStyle)}>{errorText}</p>}
    </div>
  );
};

export default Input;
