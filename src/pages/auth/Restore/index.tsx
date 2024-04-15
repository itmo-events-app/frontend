import styles from './index.module.css';
import {ITMO} from '@widgets/auth/ITMO';
import Block from '@widgets/Block';
import Label from '@widgets/auth/InputLabel';
import Input from '@widgets/auth/Input';
import Button from '@widgets/auth/Button';
import {useNavigate} from 'react-router-dom';
import {NotifyState} from '../Notification';
import {RoutePaths} from '@shared/config/routes';
import {useContext, useState} from 'react';
import ApiContext from "@features/api-context";
import {RecoveryPasswordRequest} from '@shared/api/generated';
import {getErrorResponse} from "@features/response";
import Error from "@widgets/auth/Error";

const EMAIL_MAX_LENGTH = 128;
const RETURN_URL = window.location.protocol + "//" + window.location.host + RoutePaths.recoverPassword;

const LABEL = 'Пожалуйста, укажите ваш Email. Вы получите письмо со ссылкой для создания нового пароля.';

const MAIL_DOMAIN_MSG = 'Некорректный Email. Поддерживаемые домены: @itmo.ru, @idu.itmo.ru и @niuitmo.ru';
const MAIN_UNKNOWN_MSG = 'Пользователь c таким Email не существует';
const SUCCESS_MESSAGE = 'Заявка на восстановление отправлена. Вы получите письмо на ваш Email со ссылкой для создания нового пароля.';


function RestorePage() {
  const navigate = useNavigate();

  const {api} = useContext(ApiContext);
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
  }

  const _validateEmail = (email: string) => {
    if (email == '') {
      return 'Поле не должно быть пустым';
    }
    if (!new RegExp("^\\w[\\w\\-.]*@(niu|idu.)?itmo\\.ru$").test(email)) {
      return MAIL_DOMAIN_MSG;
    }
    return null;
  };

  const _restore = () => {
    let ok = true;

    const eEmail = _validateEmail(email);
    if (eEmail) {
      setEmailError(eEmail);
      ok = false;
    }

    if (ok) {
      const request: RecoveryPasswordRequest = {
        returnUrl: RETURN_URL,
        email: email
      }

      api.auth
        .recoveryPassword(request)
        .then((_) => {
          const state: NotifyState = {
            msg: SUCCESS_MESSAGE,
          };
          navigate(RoutePaths.notify, {state: state});
        })
        .catch((e): any => {
          console.log(getErrorResponse(e.response));
          if (getErrorResponse(e.response).includes("Пользователь не найден")) {
            setErrorText(MAIN_UNKNOWN_MSG);
          }
          setIsError(true);
        });
    }
  };

  return (
    <div className={styles.root}>
      <ITMO/>
      <Block className={styles.block}>
        <span className={styles.header}>Восстановление пароля</span>
        <Error value={errorText} isError={isError}/>
        <div className={styles.form_item}>
          <Label value={LABEL}/>
          <Input value={email} onChange={_setEmail} error={emailError != ''} errorText={emailError}/>
        </div>
        <Button onClick={_restore}>Восстановить пароль</Button>
      </Block>
    </div>
  );
}

export default RestorePage;
