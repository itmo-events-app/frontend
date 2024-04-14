import { appendClassName } from '@shared/util';
import styles from './index.module.css';

type Props = {
  className?: string;
  children?: any;
};

function Fade(props: Props) {
  return <div className={appendClassName(styles.fade, props.className)}>{props.children}</div>;
}

export default Fade;
