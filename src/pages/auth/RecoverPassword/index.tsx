import styles from './index.module.css';
import {ITMO} from '@widgets/auth/ITMO';
import Block from '@widgets/Block';
import Label from '@widgets/auth/InputLabel';
import Input from '@widgets/auth/Input';
import Button from '@widgets/auth/Button';
import Error from '@widgets/auth/Error';
import {useContext, useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {RoutePaths} from '@shared/config/routes';
import {NotifyState} from '../Notification';
import ApiContext from "@features/api-context";
import {getErrorResponse} from "@features/response";
import {NewPasswordRequest} from "@shared/api/generated/model";


const PWD_MIN_LEN = 8;

const PWD_EMPTY_ER_MSG = 'Поля не должны быть пустым';

const PWD_LEN_ER_MSG = 'Пароль не должен быть короче 8 символов';
const PWD_NOT_EQ_MSG = 'Введенные пароли не совпадают';
const PWD_CASE_MSG = 'Пароль должен содержать минимум один символ верхнего и нижнего регистра';
const PWD_SPEC_CHR_MSG = 'Пароль должен содержать минимум один специальный символ';

const SUCCESS_MESSAGE = 'Смена пароля произошла успешно. Вернитесь на страницу входа.';

const NO_TOKEN_MESSAGE = 'Отсутствует токен восстановления пароля';
const INVALID_TOKEN_MESSAGE = 'Используемый токен восстановления пароля не существует или срок его действия истек.';

const SPEC_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;


function RecoverPasswordPage() {
  const navigate = useNavigate();
  const {api} = useContext(ApiContext);
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [repeatValue, setRepeatValue] = useState('');
  const [passwordRestoreToken, setPasswordRestoreToken] = useState('');

  useEffect(() => {
    const token = searchParams.get("token")

    const eEmptyToken = _empty(token);
    if (eEmptyToken) {
      const state: NotifyState = {
        msg: eEmptyToken
      };
      navigate(RoutePaths.notify, {state: state});
      return;
    }

    api.auth
      .validateRecoveryToken(token)
      .then(() => {
        console.log("Token is valid!");
        setPasswordRestoreToken(token);
      })
      .catch((e): any => {
        console.log(e.response.data);
        const state: NotifyState = {
          msg: INVALID_TOKEN_MESSAGE
        };
        navigate(RoutePaths.notify, {state: state});
      });
  });

  const _change = () => {
    let ok = true;
    setError('');

    const ePassword = _validatePassword(passwordValue);
    const eRepeat = _validatePassword(repeatValue);
    const eEqls = _validateConfirmation(passwordValue, repeatValue);

    if (eEqls) {
      setError(eEqls);
      ok = false;
    } else if (ePassword) {
      setError(ePassword);
      ok = false;
    } else if (eRepeat) {
      setError(eRepeat);
      ok = false;
    }

    if (ok) {
      const request: NewPasswordRequest = {
        token: passwordRestoreToken,
        newPassword: passwordValue,
        confirmNewPassword: repeatValue
      }

      api.auth
        .newPassword(request)
        .then((_) => {
          const state: NotifyState = {
            msg: SUCCESS_MESSAGE,
          };
          navigate(RoutePaths.notify, {state: state});
        })
        .catch((e): any => {
          setError(getErrorResponse(e.response));
        });
    }
  };

  const _passwordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
    setError('');
  };

  const _repeatOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatValue(e.target.value);
    setError('');
  };

  const _empty = (v: string | null) => {
    if (v == null || v.length == 0) {
      return NO_TOKEN_MESSAGE;
    }
    return null;
  };

  const _validatePassword = (password: string) => {
    if (password == '') {
      return PWD_EMPTY_ER_MSG;
    } else if (password.length < PWD_MIN_LEN) {
      return PWD_LEN_ER_MSG;
    } else if (password == password.toLowerCase() ||
      password == password.toUpperCase()) {
      return PWD_CASE_MSG;
    } else if (!SPEC_CHAR_REGEX.test(password)) {
      return PWD_SPEC_CHR_MSG;
    } else {
      return null;
    }
  }

  const _validateConfirmation = (newPwd: string, confirmPwd: string) => {
    if (newPwd != confirmPwd) {
      return (PWD_NOT_EQ_MSG);
    }
    return null;
  }

  return (
    <div className={styles.root}>
      <ITMO/>
      <Block className={styles.block}>
        <span className={styles.header}>Смена пароля</span>
        <Error value={error} isError={error != ''}/>
        {(passwordRestoreToken) && <div className={styles.form}>
          <div className={styles.form_item}>
            <Label value="Пароль"/>
            <Input value={passwordValue} onChange={_passwordOnChange}/>
          </div>
          <div className={styles.form_item}>
            <Label value="Подтверждение пароля"/>
            <Input value={repeatValue} onChange={_repeatOnChange}/>
          </div>
        </div>}
        <Button onClick={_change}>Отправить</Button>
      </Block>
    </div>
  );
}

export default RecoverPasswordPage;
