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
      {clicked &&
        <div className={appendClassName(styles.checkbox_inner_part, props.className)} onClick={_onChange(!clicked)}>
        </div>
      }
    </div>
  );
}

export default Checkbox;
