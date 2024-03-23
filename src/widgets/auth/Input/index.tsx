import styles from './index.module.css'

type Props = {
  type?: React.HTMLInputTypeAttribute,
  value?: string,
  className?: string,
}

function Input(props: Props) {
  return <input type={props.type} className={styles.input + ' ' + (props.className ?? '')} value={props.value} />
}

export default Input
