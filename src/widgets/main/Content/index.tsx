import styles from './index.module.css'

type Props = {
  children: any[],
}

function Content(props: Props) {
  return <div className={styles.content}>{props.children}</div>
}

export default Content

