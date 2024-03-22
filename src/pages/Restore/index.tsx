import styles from './index.module.css';
import { ITMO } from "@widgets/auth/ITMO";
import Block from "@widgets/Block";
import Label from "@widgets/auth/InputLabel";
import Input from "@widgets/auth/Input";
import Button from "@widgets/auth/Button";

function RestorePage() {
  const _restore = () => {
    console.log('restore!');
  }

  return (
    <div className={styles.root}>
      <ITMO />
      <Block className={styles.block}>
        <span className={styles.header}>Восстановление</span>
        <div className={styles.form_item}>
          <Label value="Пожалуйста, ваш email. Вы получите письмо со ссылкой для создания нового пароля." />
          <Input />
        </div>
        <Button onClick={_restore}>Восстановить пароль</Button>
      </Block>
    </div>
  )
}

export default RestorePage;
