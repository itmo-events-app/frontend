import styles from './index.module.css';

type Props = {
  className?: string,
  value: string;
  onClick?: any;
}

function Link(props: Props) {
  return <a className={styles.link + ' ' + (props.className ?? '')} onClick={props.onClick}>{props.value}</a>
}

export default Link;
