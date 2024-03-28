import { appendClassName } from '@shared/util'
import styles from './index.module.css'

type Props = {
  type?: React.HTMLInputTypeAttribute,
  value?: string,
  placeholder?: string,
  className?: string,
}

function Input(props: Props) {
  return <input type={props.type} placeholder={props.placeholder} className={appendClassName(styles.input, props.className)} defaultValue={props.value} />
}

export default Input
