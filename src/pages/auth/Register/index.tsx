import { useState } from "react";

import styles from './index.module.css';
import { ITMO } from "@widgets/auth/ITMO";
import Block from "@widgets/Block";
import Error from "@widgets/auth/Error";
import Label from "@widgets/auth/InputLabel";
import Input from "@widgets/auth/Input";
import Button from "@widgets/auth/Button";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "@shared/config/routes";
import { NotifyState } from "../Notification";

const registerMsg = 'Заявка на регистрацию успешно создана. Ожидайте письма с подтверждением для входа.';

function RegisterPage() {
  const [isError, _] = useState(true);
  const navigate = useNavigate();

  const _register = () => {
    const state: NotifyState = {
      msg: registerMsg
    }
    navigate(RoutePaths.notify, { state: state });
  }

  return (
    <div className={styles.root}>
      <ITMO />
      <Block className={styles.block}>
        <span className={styles.header}>Регистрация</span>
        <Error value="Пароль должен содержать специальные символы" isError={isError} />
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
