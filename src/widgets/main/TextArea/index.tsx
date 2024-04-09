import { appendClassName } from '@shared/util'
import styles from './index.module.css'
import ReactTextareaAutosize from 'react-textarea-autosize';

type Props = {
  type?: React.HTMLInputTypeAttribute,
  value: string,
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>,
  placeholder?: string,
  className?: string,
  minRows?: number,
  maxLength?: number,
}

function TextArea(props: Props) {
  return <ReactTextareaAutosize
    minRows={props.minRows ?? 3}
    placeholder={props.placeholder}
    className={appendClassName(styles.textarea, props.className)}
    onChange={props.onChange}
    value={props.value}
    maxLength={props.maxLength}
  />
}

export default TextArea
