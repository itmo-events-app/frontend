import Block from '@widgets/Block';
import Button from '@widgets/auth/Button';
import Input from '@widgets/auth/Input';

import styles from './index.module.css';
import Label from '@widgets/auth/InputLabel';
import Link from '@widgets/auth/Link';
import Error from '@widgets/auth/Error';
import { useContext, useEffect, useState } from 'react';
import { ITMO } from '@widgets/auth/ITMO';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@shared/config/routes';
import { LoginRequest } from '@shared/api/generated';
import { TokenContextData } from '@shared/lib/token';
import ApiContext from '@features/api-context';

const LOGIN_MAX_LENGTH = 128;
const PASSWORD_MIN_LENGTH = 8;

function LoginPage() {
  const navigate = useNavigate();
  const { api, setToken, resetToken } = useContext(ApiContext);

  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const [loginValue, setLoginValue] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginErrorText, setLoginErrorText] = useState('');

  const [passwordValue, setPasswordValue] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState('');

  // TODO: can remove when backend stops throwing 500 if token in header
  useEffect(() => {
    if (api.isLoggedIn()) {
      resetToken();
      console.log('token is resetted');
    }
  });

  const _forgotPassword = () => {
    navigate(RoutePaths.restore);
  };

  const _register = () => {
    navigate(RoutePaths.register);
  };

  const _loginOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > LOGIN_MAX_LENGTH) {
      return;
    }
    setLoginValue(value);
  };

  const _passwordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordValue(value);

    const validation = _validatePassword(value);
    if (!validation) {
      setPasswordError(false);
    }
  };

  const _enterOnClick = () => {
    let ok = true;
    const login = _validateLogin(loginValue);
    const password = _validatePassword(passwordValue);

    if (login) {
      setLoginError(true);
      setLoginErrorText(login);
      ok = false;
    }

    if (password) {
      setPasswordError(true);
      setPasswordErrorText(password);
      ok = false;
    }

    if (ok) {
      const request: LoginRequest = {
        login: loginValue,
        password: passwordValue,
      };
      api.auth
        .login(request)
        .then((r) => {
          const token = r.data;
          setToken(new TokenContextData(token));
          console.log('token updated');
          navigate(RoutePaths.home);
        })
        .catch((): any => {
          setErrorText("Неправильно указан логин и/или пароль");
          setIsError(true);
        });
    }
  };

  const _validateLogin = (_: string) => {
    return null;
  };

  const _validatePassword = (password: string) => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return 'Пароль должен быть не короче 8 символов';
    }
    return null;
  };

  return (
    <div className={styles.root}>
      <ITMO />
      <Block className={styles.block}>
        <span className={styles.header}>Войти</span>
        <div className={styles.form}>
          <div className={styles.form_item}>
            <Label value="Логин" />
            <Input
              placeholder="Email"
              value={loginValue}
              onChange={_loginOnChange}
              error={loginError}
              errorText={loginErrorText}
            />
          </div>
          <div className={styles.form_item}>
            <Label value="Пароль" />
            <Input
              type="password"
              placeholder="Пароль"
              value={passwordValue}
              onChange={_passwordOnChange}
              error={passwordError}
              errorText={passwordErrorText}
            />
            <Error value={errorText} isError={isError} />
            <Link onClick={_forgotPassword} value="Забыли пароль?" />
          </div>
        </div>
        <Button onClick={_enterOnClick}>Войти</Button>
        <Link className={styles.register} onClick={_register} value="Нет учетной записи? Зарегистрироваться" />
      </Block>
    </div>
  );
}

export default LoginPage;
