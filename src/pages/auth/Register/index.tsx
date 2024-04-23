import { useContext, useState } from 'react';

import styles from './index.module.css';
import { ITMO } from '@widgets/auth/ITMO';
import Block from '@widgets/Block';
import Label from '@widgets/auth/InputLabel';
import Input from '@widgets/auth/Input';
import Button from '@widgets/auth/Button';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@shared/config/routes';
import { NotifyState } from '../Notification';
import ApiContext from '@features/api-context';
import { RegistrationUserRequest, RegistrationUserRequestTypeEnum } from '@shared/api/generated';

const registerMsg = 'Заявка на регистрацию успешно создана. Ожидайте письма с подтверждением для входа.';

const errorValidators = {
  empty: (v: string) => {
    if (v == '') {
      return 'Поле не должно быть пустым';
    }
    return null;
  },
  len: (v: string) => {
    if (v.length < 8) {
      return 'Поле не должно быть короче 8 символов';
    }
    return null;
  },
  passwordEqual: (a: string, b: string) => {
    if (a != b) {
      return 'Пароль не совпадает';
    }
    return null;
  }
} as const;

function RegisterPage() {
  const { api } = useContext(ApiContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [surname, setSurname] = useState('');
  const [surnameError, setSurnameError] = useState('')
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeat, setRepeat] = useState('');
  const [repeatError, setRepeatError] = useState('');

  const _setName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError('');
  }

  const _setSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurname(e.target.value);
    setSurnameError('');
  }

  const _setEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
  }

  const _setPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError('');
  }

  const _setRepeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeat(e.target.value);
    setRepeatError('');
  }

  const _register = () => {
    let ok = true;

    const ename = errorValidators.empty(name);
    if (ename) {
      setNameError(ename);
      ok = false;
    }

    const esurname = errorValidators.empty(surname);
    if (esurname) {
      setSurnameError(esurname);
      ok = false;
    }

    const eemail = errorValidators.empty(email);
    if (eemail) {
      setEmailError(eemail);
      ok = false;
    }

    const epassword = errorValidators.len(password)
    if (epassword) {
      setPasswordError(epassword);
      ok = false;
    }

    const erepeat = errorValidators.len(repeat) || errorValidators.passwordEqual(password, repeat);
    if (erepeat) {
      setRepeatError(erepeat);
      ok = false;
    }

    if (ok) {
      const request: RegistrationUserRequest = {
        name: name,
        surname: surname,
        login: email,
        type: RegistrationUserRequestTypeEnum.Email,
        password: password,
        confirmPassword: repeat,
      }
      api.withReauth(() => api.auth.register(request))
        .then((_) => {
          const state: NotifyState = {
            msg: registerMsg,
          };
          navigate(RoutePaths.notify, { state: state });
        })
        .catch((e: any) => {
          if (e.response.data.errors) {
            setEmailError(e.response.data.errors.join('. '));
          }
          else {
            setPasswordError(e.response.data);
          }
        })
    }
  };


  return (
    <div className={styles.root}>
      <ITMO />
      <Block className={styles.block}>
        <span className={styles.header}>Регистрация</span>
        <div className={styles.form}>
          <div className={styles.form_item}>
            <Label value="Имя" />
            <Input value={name} onChange={_setName} error={nameError != ''} errorText={nameError} />
          </div>
          <div className={styles.form_item}>
            <Label value="Фамилия" />
            <Input value={surname} onChange={_setSurname} error={surnameError != ''} errorText={surnameError} />
          </div>
          <div className={styles.form_item}>
            <Label value="Email" />
            <Input value={email} onChange={_setEmail} error={emailError != ''} errorText={emailError} />
          </div>
          <div className={styles.form_item}>
            <Label value="Пароль" />
            <Input type="password" value={password} onChange={_setPassword} error={passwordError != ''} errorText={passwordError} />
          </div>
          <div className={styles.form_item}>
            <Label value="Подтверждение пароля" />
            <Input type="password" value={repeat} onChange={_setRepeat} error={repeatError != ''} errorText={repeatError} />
          </div>
        </div>
        <Button onClick={_register}>Зарегистрироваться</Button>
      </Block>
    </div>
  );
}

export default RegisterPage;
