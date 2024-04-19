import styles from './index.module.css';
import {useEffect} from "react";
import {appendClassName} from '@shared/util';


type Props = {
  active: boolean;
  setActive: any;
  children: any
};


function ModalBlock(props: Props) {

  const _onEscape = (event: any) => {
    if (event.key == 'Escape') {
      props.setActive(false);
    }
  }

  useEffect(() => {
    if (props.active) {
      document.addEventListener("keydown", _onEscape, false);
    }
    return () => {
      document.removeEventListener("keydown", _onEscape, false);
    };
  }, [props.active]);


  return (
    <div className={props.active ? appendClassName(styles.modal, styles.active) : styles.modal}
         onClick={() => props.setActive(false)}
         >
      <div className={props.active ? appendClassName(styles.modal__content, styles.active) : styles.modal__content}
           onClick={event => event.stopPropagation()}>
        {props.children}
      </div>
    </div>
  );
}

export default ModalBlock;
