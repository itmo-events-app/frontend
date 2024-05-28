import styles from './index.module.css';
import { ITMO } from '@widgets/auth/ITMO';
import Block from '@widgets/Block';
import Label from '@widgets/auth/InputLabel';
import Input from '@widgets/auth/Input';
import Button from '@widgets/auth/Button';
import Error from '@widgets/auth/Error';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RoutePaths } from '@shared/config/routes';
import { NotifyState } from '../Notification';
import ApiContext from '@features/api-context';
import { getErrorResponse } from '@features/response';
import { NewPasswordRequest } from '@shared/api/generated/model';

const PWD_MIN_LEN = 8;
const PWD_MAX_LEN = Number.MAX_VALUE; // to adjust

const SPEC_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;

const PWD_EMPTY_ERR_MSG = 'Поля не должны быть пустыми';
const PWD_LEN_ERR_MSG = 'Пароль не должен быть короче 8 символов';
const PWD_NOT_EQ_ERR_MSG = 'Введенные пароли не совпадают';
const PWD_CASE_ERR_MSG = 'Пароль должен содержать минимум один символ верхнего и нижнего регистра';
const PWD_SPEC_CHR_ERR_MSG = 'Пароль должен содержать минимум один специальный символ';

const SUCCESS_MESSAGE = 'Восстановление пароля произошло успешно. Вернитесь на страницу входа.';
const FAIL_MESSAGE = 'Не удалось восстановить пароль.';

const NO_TOKEN_ERR_MSG = 'Не удалось восстановить пароль. Необходимый для восстановления токен отсутствует.';
const TOKEN_INVALID_ERR_MSG = 'Используемый токен восстановления пароля не существует или срок его действия истек.';

function RecoverPasswordPage() {
  const navigate = useNavigate();
  const { api } = useContext(ApiContext);
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [repeatValue, setRepeatValue] = useState('');
  const [passwordRestoreToken, setPasswordRestoreToken] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token == null || token.length == 0) {
      const state: NotifyState = {
        msg: NO_TOKEN_ERR_MSG,
      };
      navigate(RoutePaths.notify, { state: state });
      return;
    }

    api.auth
      .validateRecoveryToken(token)
      .then(() => {
        console.log('Token is valid!');
        setPasswordRestoreToken(token);
      })
      .catch((e): any => {
        console.log(e.response.data);
        const state: NotifyState = {
          msg: TOKEN_INVALID_ERR_MSG,
        };
        navigate(RoutePaths.notify, { state: state });
      });
  }, [searchParams]);

  const _passwordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > PWD_MAX_LEN) return;
    setPasswordValue(value);
    setError('');
  };

  const _repeatOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > PWD_MAX_LEN) return;
    setRepeatValue(value);
    setError('');
  };

  const _change = () => {
    let ok = true;
    setError('');

    const ePassword = _validatePassword(passwordValue);
    const eEqls = _validateConfirmation(passwordValue, repeatValue);

    if (ePassword) {
      setError(ePassword);
      ok = false;
    } else if (eEqls) {
      setError(eEqls);
      ok = false;
    }

    if (ok) {
      const request: NewPasswordRequest = {
        token: passwordRestoreToken,
        newPassword: passwordValue,
        confirmNewPassword: repeatValue,
      };

      api.auth
        .newPassword(request)
        .then((_) => {
          const state: NotifyState = {
            msg: SUCCESS_MESSAGE,
          };
          navigate(RoutePaths.notify, { state: state });
        })
        .catch((e): any => {
          console.log(getErrorResponse(e.response));
          setError(FAIL_MESSAGE);
        });
    }
  };

  const _validatePassword = (password: string) => {
    if (password == '') {
      return PWD_EMPTY_ERR_MSG;
    } else if (password.length < PWD_MIN_LEN) {
      return PWD_LEN_ERR_MSG;
    } else if (password == password.toLowerCase() || password == password.toUpperCase()) {
      return PWD_CASE_ERR_MSG;
    } else if (!SPEC_CHAR_REGEX.test(password)) {
      return PWD_SPEC_CHR_ERR_MSG;
    } else {
      return null;
    }
  };

  const _validateConfirmation = (newPwd: string, confirmPwd: string) => {
    if (newPwd != confirmPwd) {
      return PWD_NOT_EQ_ERR_MSG;
    }
    return null;
  };

  return (
    <div className={styles.root}>
      <ITMO />
      {passwordRestoreToken && (
        <Block className={styles.block}>
          <span className={styles.header}>Смена пароля</span>
          <Error value={error} isError={error != ''} />
          {passwordRestoreToken && (
            <div className={styles.form}>
              <div className={styles.form_item}>
                <Label value="Пароль" />
                <Input type={passwordVisible ? '' : 'password'} value={passwordValue} onChange={_passwordOnChange} />
              </div>
              <div className={styles.form_item}>
                <Label value="Подтверждение пароля" />
                <Input type={passwordVisible ? '' : 'password'} value={repeatValue} onChange={_repeatOnChange} />
              </div>
              <div className={styles.form_item} style={{ flexDirection: 'row', marginTop: 10 }}>
                <Input
                  type="checkbox"
                  value={passwordVisible.toString()}
                  onChange={() => setPasswordVisible(!passwordVisible)}
                />
                <Label value="Показать пароль" />
              </div>
            </div>
          )}
          <Button onClick={_change}>Отправить</Button>
        </Block>
      )}
    </div>
  );
}

export default RecoverPasswordPage;
