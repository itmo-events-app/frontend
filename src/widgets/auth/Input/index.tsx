import { appendClassName } from '@shared/util'
import styles from './index.module.css'

type Props = {
  value: string,
  onChange: React.ChangeEventHandler<HTMLInputElement>
  type?: React.HTMLInputTypeAttribute,
  placeholder?: string,
  className?: string,
  error?: boolean,
  errorText?: string,
}

function Input(props: Props) {
  const error = props.error ?? false;
  const visibilityStyle = error ? styles.visible : styles.hidden;
  const inputErrorStyle = error ? styles.input_error : undefined;
  const errorText = props.errorText;

  return (
    <div className={appendClassName(styles.root, props.className)}>
      <input type={props.type} placeholder={props.placeholder} className={appendClassName(styles.input, inputErrorStyle)} onChange={props.onChange} value={props.value} />
      <p className={appendClassName(styles.helper_error, visibilityStyle)}>{errorText}</p>
    </div>
  )
}

export default Input
