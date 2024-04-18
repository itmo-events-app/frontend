import styles from './index.module.css';
import {ITMO} from '@widgets/auth/ITMO';
import Block from '@widgets/Block';
import Label from '@widgets/auth/InputLabel';
import Input from '@widgets/auth/Input';
import Button from '@widgets/auth/Button';
import Error from '@widgets/auth/Error';
import {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {RoutePaths} from '@shared/config/routes';
import {NotifyState} from '../Notification';
import ApiContext from "@features/api-context";
import {UserChangePasswordRequest} from "@shared/api/generated/model";

const PWD_MIN_LEN = 8;
const PWD_MAX_LEN = Number.MAX_VALUE; // to adjust

const PWD_EMPTY_ERR_MSG = 'Поле не должно быть пустыми';
const PWD_LEN_ERR_MSG = 'Пароль не должен быть короче 8 символов';
const PWD_NOT_EQ_ERR_MSG = 'Введенные пароли не совпадают';
const PWD_CASE_ERR_MSG = 'Пароль должен содержать минимум один символ верхнего и нижнего регистра';
const PWD_SPEC_CHR_ERR_MSG = 'Пароль должен содержать минимум один специальный символ';
const PWD_EQ_OLD_ERR_MSG = 'Указанный пароль не совпадает с текущим';
const PWD_EQ_CUR_ERR_MSG = 'Указанный новый пароль совпадает с текущим';

const SUCCESS_MESSAGE = 'Смена пароля произошла успешно. Вернитесь на страницу входа.';
const FAIL_MESSAGE = 'Не удалось сменить пароль.';

const SPEC_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;


function ChangePasswordPage() {
  const navigate = useNavigate();
  const {api} = useContext(ApiContext);

  const [error, setError] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');

  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');


  const _setOldPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const length = value.length;

    if (length > PWD_MAX_LEN) {
      return;
    }

    setOldPassword(value);
    setOldPasswordError('');
    setError('');
  }

  const _setNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const length = value.length;

    if (length > PWD_MAX_LEN) {
      return;
    }

    setNewPassword(value);
    setNewPasswordError('');
  }

  const _setConfirmNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const length = value.length;

    if (length > PWD_MAX_LEN) {
      return;
    }

    setConfirmNewPassword(value);
    setConfirmNewPasswordError('');
  }


  const _change = () => {
    let ok = true;
    setError('');

    const eOldPwd = _validatePassword(oldPassword);
    if (eOldPwd) {
      setOldPasswordError(eOldPwd);
      ok = false;
    }

    const eNewPwd = _validatePassword(newPassword);
    if (eNewPwd) {
      setNewPasswordError(eNewPwd);
      ok = false;
    }

    const eConfPwd = _validatePassword(confirmNewPassword);
    const eEqlPwd = _validateConfirmation(newPassword, confirmNewPassword);
    const eCngPwd = _validatePwdChange(oldPassword, newPassword);
    if (eConfPwd) {
      setConfirmNewPasswordError(eConfPwd);
      ok = false;
    } else if (eEqlPwd) {
      setConfirmNewPasswordError(eEqlPwd);
      ok = false;
    } else if (eCngPwd) {
      setNewPasswordError(eCngPwd);
      ok = false;
    }

    if (ok) {
      const request: UserChangePasswordRequest = {
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword
      }

      api.withReauth(() => api.profile.changePassword(request))
        .then(() => {
          const state: NotifyState = {
            msg: SUCCESS_MESSAGE,
          };
          navigate(RoutePaths.notify, {state: state});
        })
        .catch((e: any) => {
          console.log(e.response.data);
          setError(FAIL_MESSAGE);

          // TODO add responses handling
          if (e.response.data.includes('Ошибка аутентификации')) {
            setOldPasswordError(PWD_EQ_OLD_ERR_MSG);
          }
        });
    }
  };

  const _validatePassword = (password: string) => {
    if (password == '') {
      return PWD_EMPTY_ERR_MSG;
    } else if (password.length < PWD_MIN_LEN) {
      return PWD_LEN_ERR_MSG;
    } else if (password == password.toLowerCase() ||
      password == password.toUpperCase()) {
      return PWD_CASE_ERR_MSG;
    } else if (!SPEC_CHAR_REGEX.test(password)) {
      return PWD_SPEC_CHR_ERR_MSG;
    } else {
      return null;
    }
  }

  const _validateConfirmation = (newPwd: string, confirmPwd: string) => {
    if (newPwd != confirmPwd) {
      return (PWD_NOT_EQ_ERR_MSG);
    }
    return null;
  }

  const _validatePwdChange = (newPwd: string, oldPwd: string) => {
    if (newPwd == oldPwd) {
      return (PWD_EQ_CUR_ERR_MSG);
    }
    return null;
  }

  return (
    <div className={styles.root}>
      <ITMO/>
      <Block className={styles.block}>
        <span className={styles.header}>Смена пароля</span>
        <Error value={error} isError={error != ''}/>
        <div className={styles.form}>
          <div className={styles.form_item}>
            <Label value="Старый пароль"/>
            <Input value={oldPassword} onChange={_setOldPassword} error={oldPasswordError != ''}
                   errorText={oldPasswordError}/>
          </div>
          <div className={styles.form_item}>
            <Label value="Новый пароль"/>
            <Input value={newPassword} onChange={_setNewPassword} error={newPasswordError != ''}
                   errorText={newPasswordError}/>
          </div>
          <div className={styles.form_item}>
            <Label value="Подтверждение пароля"/>
            <Input value={confirmNewPassword} onChange={_setConfirmNewPassword} error={confirmNewPasswordError != ''}
                   errorText={confirmNewPasswordError}/>
          </div>
        </div>
        <Button onClick={_change}>Отправить</Button>
      </Block>
    </div>
  );
}

export default ChangePasswordPage;
