import styles from './index.module.css';

type Props = {
  className?: string;
  value: string;
  isError: boolean;
};

function Error(props: Props) {
  return <>{props.isError ? <span className={styles.error}>{props.value}</span> : <></>}</>;
}

export default Error;
