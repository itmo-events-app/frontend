import { appendClassName } from '@shared/util';
import styles from './index.module.css';
import ReactTextareaAutosize from 'react-textarea-autosize';

type Props = {
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  className?: string;
  minRows?: number;
  errorText?: string;
};

function TextArea(props: Props) {
  const error = props.errorText != undefined && props.errorText != '';
  const visibilityStyle = error ? styles.visible : styles.hidden;
  const inputErrorStyle = error ? styles.input_error : undefined;
  const errorText = props.errorText;

  return (
    <div className={appendClassName(styles.root, props.className)}>
      <ReactTextareaAutosize
        minRows={props.minRows ?? 3}
        placeholder={props.placeholder}
        className={appendClassName(appendClassName(styles.textarea, inputErrorStyle), props.className)}
        onChange={props.onChange}
        value={props.value}
      />
      <p className={appendClassName(styles.helper_error, visibilityStyle)}>{errorText}</p>
    </div>
  );
}

export default TextArea;
