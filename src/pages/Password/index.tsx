import styles from './index.module.css';
import { ITMO } from "@widgets/auth/ITMO";
import Block from "@widgets/Block";
import Label from "@widgets/auth/InputLabel";
import Input from "@widgets/auth/Input";
import Button from "@widgets/auth/Button";
import Error from '@widgets/auth/Error';
import { useState } from 'react';

function PasswordPage() {
  const [isError, _] = useState(true);

  const _change = () => {
    console.log('restore!');
  }

  return (
    <div className={styles.root}>
      <ITMO />
      <Block className={styles.block}>
        <span className={styles.header}>Смена пароля</span>
        <Error value="Пароль должен содержать содержать специальные символы" isError={isError} />
        <div className={styles.form}>
          <div className={styles.form_item}>
            <Label value="Пароль" />
            <Input />
          </div>
          <div className={styles.form_item}>
            <Label value="Подтверждение пароля" />
            <Input />
          </div>
        </div>
        <Button onClick={_change}>Отправить</Button>
      </Block>
    </div>
  )
}

export default PasswordPage;
