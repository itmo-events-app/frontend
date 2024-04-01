import { appendClassName } from '@shared/util'
import styles from './index.module.css'
import ReactTextareaAutosize from 'react-textarea-autosize';

type Props = {
  type?: React.HTMLInputTypeAttribute,
  value?: string,
  placeholder?: string,
  className?: string,
  minRows?: number,
}

function TextArea(props: Props) {
  return <ReactTextareaAutosize
    minRows={props.minRows ?? 3}
    placeholder={props.placeholder}
    className={appendClassName(styles.textarea, props.className)}
    defaultValue={props.value}
  />
}

export default TextArea
