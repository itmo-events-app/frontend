import { appendClassName } from '@shared/util';
import styles from './index.module.css'

type Props = {
  value: string;
  error?: boolean
}

function Label(props: Props) {
  const errorClass = props.error ? styles.error : undefined;
  return <span className={appendClassName(styles.label, errorClass)}>{props.value}</span>
}

export default Label;
