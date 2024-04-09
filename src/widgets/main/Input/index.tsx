import { appendClassName } from '@shared/util'
import styles from './index.module.css'

type Props = {
  value: string,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  type?: React.HTMLInputTypeAttribute,
  placeholder?: string,
  className?: string,
}

function Input(props: Props) {
  return <input type={props.type} placeholder={props.placeholder} className={appendClassName(styles.input, props.className)} value={props.value} onChange={props.onChange} />
}

export default Input
