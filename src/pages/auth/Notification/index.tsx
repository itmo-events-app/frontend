import styles from './index.module.css';
import { ITMO } from "@widgets/auth/ITMO";
import Block from "@widgets/Block";

function NotifyPage() {
  return (
    <div className={styles.root}>
      <ITMO />
      <Block className={styles.block}>
        <span>Заявка на восстановление отправлена</span>
      </Block>
    </div>
  )
}

export default NotifyPage;
