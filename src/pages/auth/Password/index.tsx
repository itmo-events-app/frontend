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

const PASSWORD_MIN_LENGTH = 8;
const passwordLengthError = 'Пароль не должен быть короче 8 символов'
const passwordNotEqError = 'Пароль должен совпадать'

function PasswordPage() {
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [repeatValue, setRepeatValue] = useState('');

  const _change = () => {
    let ok = true;

    if (passwordValue.length < PASSWORD_MIN_LENGTH) {
      setError(passwordLengthError);
      ok = false;
    }

    if (repeatValue.length < PASSWORD_MIN_LENGTH) {
      setError(passwordLengthError);
      ok = false;
    }

    if (passwordValue != repeatValue) {
      setError(passwordNotEqError);
      ok = false;
    }

    if (ok) {
      // TODO: make actual api request
      const state: NotifyState = {
        msg: msg
      }

      navigate(RoutePaths.notify, { state: state });
    }
  }

  const _passwordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
  }

  const _repeatOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatValue(e.target.value);
  }


  return (
    <div className={styles.root}>
      <ITMO />
      <Block className={styles.block}>
        <span className={styles.header}>Смена пароля</span>
        <Error value={error} isError={error != ''} />
        <div className={styles.form}>
          <div className={styles.form_item}>
            <Label value="Пароль" />
            <Input value={passwordValue} onChange={_passwordOnChange} />
          </div>
          <div className={styles.form_item}>
            <Label value="Подтверждение пароля" />
            <Input value={repeatValue} onChange={_repeatOnChange} />
          </div>
        </div>
        <Button onClick={_change}>Отправить</Button>
      </Block>
    </div>
  )
}

export default PasswordPage;
