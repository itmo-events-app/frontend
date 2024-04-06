import Block from "@widgets/Block";
import Button from "@widgets/auth/Button";
import Input from "@widgets/auth/Input";

import styles from './index.module.css';
import Label from "@widgets/auth/InputLabel";
import Link from "@widgets/auth/Link";
import Error from "@widgets/auth/Error";
import { useState } from "react";
import { ITMO } from "@widgets/auth/ITMO";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "@shared/config/routes";


export function appendClassName(base: string, add?: string | null) {
if (add == null) {
  return base;
}
return base + ' ' + add;
}function LoginPage() {
  const [isError, _] = useState(true);
  const navigate = useNavigate();

  const _forgotPassword = () => {
    navigate(RoutePaths.restore);
  }

  const _register = () => {
    navigate(RoutePaths.register);
  }

  const _enter = () => {
    navigate(RoutePaths.eventList);
  }

  return (
    <div className={styles.root}>
      <ITMO />
      <Block className={styles.block}>
        <span className={styles.header}>Войти</span>
        <Error value="Неправильный Email или Пароль" isError={isError} />
        <div className={styles.form}>
          <div className={styles.form_item}>
            <Label value="Логин" />
            <Input placeholder="Email"/>
          </div>
          <div className={styles.form_item}>
            <Label value="Пароль" />
            <Input type='password' placeholder="Пароль"/>
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
