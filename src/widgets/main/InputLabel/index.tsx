import styles from './index.module.css';

type Props = {
  value: string;
};

function InputLabel(props: Props) {
  return <span className={styles.label}>{props.value}</span>;
}

export default InputLabel;
