import styles from './index.module.css';
import { ITMO } from '@widgets/auth/ITMO';
import Block from '@widgets/Block';
import Label from '@widgets/auth/InputLabel';
import Input from '@widgets/auth/Input';
import Button from '@widgets/auth/Button';
import Error from '@widgets/auth/Error';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { RoutePaths } from '@shared/config/routes';
import { NotifyState } from '../Notification';
import ApiContext from '@features/api-context';
import { getErrorResponse } from '@features/response';
import { RecoveryPasswordRequest } from '@shared/api/generated/model';

const EMAIL_MAX_LENGTH = 128;

const RETURN_URL = window.location.protocol + '//' + window.location.host + RoutePaths.recoverPassword;
const MAIL_REGEX = '^\\w[\\w\\-.]*@(niu|idu.)?itmo\\.ru$';

const LABEL = 'Пожалуйста, укажите ваш Email. Вы получите письмо со ссылкой для восстановления пароля.';

const FIELD_EMPTY_ERR_MSG = 'Поле не должно быть пустым';
const MAIL_DOMAIN_ERR_MSG = 'Некорректный Email. Поддерживаемые домены: @itmo.ru, @idu.itmo.ru и @niuitmo.ru';
const MAIL_UNKNOWN_ERR_MSG = 'Пользователя c таким Email не существует';
const SUCCESS_MESSAGE =
  'Заявка на восстановление пароля отправлена. Вы получите письмо на ваш Email со ссылкой для восстановления пароля.';
const FAIL_MESSAGE = 'Неудалось отправить заявку на восстановление пароля.';

function RestorePage() {
  const navigate = useNavigate();
  const { api } = useContext(ApiContext);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const _setEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > EMAIL_MAX_LENGTH) {
      return;
    }
    setEmail(value);
    setEmailError('');
    setErrorText('');
  };

  const _validateEmail = (email: string) => {
    if (email == '') {
      return FIELD_EMPTY_ERR_MSG;
    }
    if (!new RegExp(MAIL_REGEX).test(email)) {
      return MAIL_DOMAIN_ERR_MSG;
    }
    return null;
  };

  const _restore = (e: any) => {
    e.preventDefault();
    let ok = true;

    const eEmail = _validateEmail(email);
    if (eEmail) {
      setEmailError(eEmail);
      ok = false;
    }

    if (ok) {
      const request: RecoveryPasswordRequest = {
        returnUrl: RETURN_URL,
        email: email,
      };
      api.auth
        .recoveryPassword(request)
        .then((_) => {
          const state: NotifyState = {
            msg: SUCCESS_MESSAGE,
          };
          navigate(RoutePaths.notify, { state: state });
        })
        .catch((e): any => {
          console.log(getErrorResponse(e.response));
          if (getErrorResponse(e.response).includes('Пользователь не найден')) {
            setErrorText(MAIL_UNKNOWN_ERR_MSG);
          } else {
            setErrorText(FAIL_MESSAGE);
          }
          setIsError(true);
        });
    }
  };

  return (
    <div className={styles.root}>
      <ITMO />
      <Block className={styles.block}>
        <span className={styles.header}>Восстановление пароля</span>
        <Error value={errorText} isError={isError} />
        <form onSubmit={_restore} className={styles.form_item}>
          <Label value={LABEL} />
          <Input value={email} onChange={_setEmail} error={emailError != ''} errorText={emailError} />

          <Button className={styles.btn}>Восстановить пароль</Button>
        </form>
      </Block>
    </div>
  );
}

export default RestorePage;
