import styles from './index.module.css';

type Props = {
  className?: string,
  children?: any
}

function Block(props: Props) {
  return <div className={styles.block + ' ' + (props.className ?? '')}>{props.children}</div>
}

export default Block
