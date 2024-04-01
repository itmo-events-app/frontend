import { appendClassName } from '@shared/util'
import styles from './index.module.css'

type Props = {
  text?: string,
  checked?: boolean,
  onChange?: any,
  placeholder?: string,
  className?: string,
}

function InputCheckbox(props: Props) {
  return (
    <label className={styles.label}>
      <input type="checkbox" checked={props.checked} onChange={props.onChange} className={appendClassName(styles.checkbox, props.className)} />
      <span>{props.text}</span>
    </label>
  )
}

export default InputCheckbox
