import { useState } from "react";

import styles from './index.module.css';
import { ITMO } from "@widgets/auth/ITMO";
import Block from "@widgets/Block";
import Error from "@widgets/auth/Error";
import Label from "@widgets/auth/InputLabel";
import Input from "@widgets/auth/Input";
import Button from "@widgets/auth/Button";

function RegisterPage() {
  const [isError, _] = useState(true);

  const _register = () => {
    console.log('register!');
  }

  return (
    <div className={styles.root}>
      <ITMO />
      <Block className={styles.block}>
        <span className={styles.header}>Регистрация</span>
        <Error value="Пароль должен содержать содержать специальные символы" isError={isError} />
        <div className={styles.form}>
          <div className={styles.form_item}>
            <Label value="Имя" />
            <Input />
          </div>
          <div className={styles.form_item}>
            <Label value="Фамилия" />
            <Input />
          </div>
          <div className={styles.form_item}>
            <Label value="Логин или номер ИСУ" />
            <Input />
          </div>
          <div className={styles.form_item}>
            <Label value="Email" />
            <Input />
          </div>
          <div className={styles.form_item}>
            <Label value="Пароль" />
            <Input />
          </div>
          <div className={styles.form_item}>
            <Label value="Подтверждение пароля" />
            <Input />
          </div>
        </div>
        <Button onClick={_register}>Зарегистрироваться</Button>
      </Block>
    </div>
  )
}

export default RegisterPage;
