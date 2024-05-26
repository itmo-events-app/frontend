import styles from './index.module.css';
import React, { useState } from 'react';
import { appendClassName } from '@shared/util';

type Props = {
  value?: boolean;
  onChange?: (status: boolean) => void;
  className?: string;
};

function Checkbox(props: Props) {
  const [clicked, setClicked] = useState(props.value);

  function _onChange(status: boolean) {
    return function (e: React.MouseEvent<HTMLDivElement>) {
      props.onChange?.(status);
      setClicked(status);
      e.stopPropagation();
    };
  }

  return (
    <div className={appendClassName(styles.checkbox_container, props.className)} onClick={_onChange(!clicked)}>
      {clicked && (
        <div className={appendClassName(styles.checkbox_inner_part, props.className)} onClick={_onChange(!clicked)}>
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 12.6111L8.92308 17.5L20 6.5"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default Checkbox;
