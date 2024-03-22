import Block from "@widgets/Block";
import Button from "@widgets/auth/Button";
import Input from "@widgets/auth/Input";

import styles from './index.module.css';
import Label from "@widgets/auth/InputLabel";
import Link from "@widgets/auth/Link";
import Error from "@widgets/auth/Error";
import { useState } from "react";
import { ITMO } from "@widgets/auth/ITMO";


function LoginPage() {
  const [isError, _] = useState(true);

  const _forgotPassword = () => {
    console.log('forgot password!');
  }

  const _register = () => {
    console.log('register!');
  }

  const _enter = () => {
    console.log('enter!');
  }

  return (
    <div className={styles.root}>
      <ITMO />
      <Block className={styles.block}>
        <span className={styles.header}>Войти</span>
        <Error value="Неправильный логин или пароль" isError={isError} />
        <div className={styles.form}>
          <div className={styles.form_item}>
            <Label value="Логин или номер ИСУ" />
            <Input />
          </div>
          <div className={styles.form_item}>
            <Label value="Пароль" />
            <Input type='password' />
            <Link onClick={_forgotPassword} value="Забыли пароль?" />
          </div>
        </div>
        <Button onClick={_enter}>Войти</Button>
        <Link className={styles.register} onClick={_register} value="Нет учетной записи? Зарегистрироваться" />
      </Block>
    </div>
  );
}

export default LoginPage;
