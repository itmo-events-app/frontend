import styles from './index.module.css';
import { ITMO } from "@widgets/auth/ITMO";
import Block from "@widgets/Block";
import Label from "@widgets/auth/InputLabel";
import Input from "@widgets/auth/Input";
import Button from "@widgets/auth/Button";
import Error from '@widgets/auth/Error';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@shared/config/routes';
import { NotifyState } from '../Notification';

const msg = 'Смена пароля произошла успешно. Вернитесь на страницу входа.'

function PasswordPage() {
  const [isError, _] = useState(true);
  const navigate = useNavigate();

  const _change = () => {
    const state: NotifyState = {
      msg: msg
    }
    navigate(RoutePaths.notify, { state: state });
  }

  return (
    <div className={styles.root}>
      <ITMO />
      <Block className={styles.block}>
        <span className={styles.header}>Смена пароля</span>
        <Error value="Пароль должен содержать специальные символы" isError={isError} />
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
