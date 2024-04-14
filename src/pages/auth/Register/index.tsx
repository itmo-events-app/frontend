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
const justError = 'Пароль должен содержать специальные символы'

function RegisterPage() {
  const [error, _] = useState(justError);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');

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
        <Error value={error} isError={error != ''} />
        <div className={styles.form}>
          <div className={styles.form_item}>
            <Label value="Имя" />
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className={styles.form_item}>
            <Label value="Фамилия" />
            <Input value={surname} onChange={(e) => setSurname(e.target.value)} />
          </div>
          <div className={styles.form_item}>
            <Label value="Email" />
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={styles.form_item}>
            <Label value="Пароль" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className={styles.form_item}>
            <Label value="Подтверждение пароля" />
            <Input value={repeat} onChange={(e) => setRepeat(e.target.value)} />
          </div>
        </div>
        <Button onClick={_register}>Зарегистрироваться</Button>
      </Block>
    </div>
  )
}

export default RegisterPage;
