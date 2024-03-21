import styles from './index.module.css'

type Props = {
  onClick?: any,
  children?: any,
  className?: string,
}

function Button(props: Props) {
  return <button className={styles.button + ' ' + (props.className ?? '')} onClick={props.onClick}>{props.children}</button>
}

export default Button
