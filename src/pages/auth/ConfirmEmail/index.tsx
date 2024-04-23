import {useContext, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {RoutePaths} from "@shared/config/routes";
import ApiContext from "@features/api-context";
import {NotifyState} from "@pages/auth/Notification";
import styles from './index.module.css';
import {ITMO} from "@widgets/auth/ITMO";
import Error from "@widgets/auth/Error";
import Button from "@widgets/auth/Button";
import Block from "@widgets/Block";
import Link from "@widgets/auth/Link";


const RETURN_URL = window.location.protocol + "//" + window.location.host + RoutePaths.confirmEmail;

const SUCCESS_MESSAGE = 'Подтверждение почты произошло успешно. Вернитесь на страницу входа.';
const FAIL_MESSAGE = 'Не удалось подтвердить почту.';

const NO_TOKEN_ERR_MSG = 'Не удалось подтвердить почту. Необходимый для восстановления токен отсутствует.';
const TOKEN_INVALID_ERR_MSG = 'Используемый токен подтверждения почты не существует или срок его действия истек.';

const MAIL_RECONFIRM_MSG = 'Письмо со ссылкой для подтверждения почты отправлено.';
const MAIL_RECONFIRM_FAIL_MSG = 'Не удалось отправить письмо со ссылкой для подтверждения почты.';


function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {api} = useContext(ApiContext);
  const [emailConfirmToken, setEmailConfirmToken] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get("token");

    if (token == null || token.length == 0) {
      const state: NotifyState = {
        msg: NO_TOKEN_ERR_MSG
      };
      navigate(RoutePaths.notify, {state: state});
      return;
    }

    api.auth
      .validateEmailVerificationToken(token)
      .then(() => {
        console.log("Token is valid!");
        setEmailConfirmToken(token);
      })
      .catch((e): any => {
        console.log(e.response.data);
        setError(TOKEN_INVALID_ERR_MSG);
      });
  }, [searchParams]);

  useEffect(() => {
    if (!emailConfirmToken || emailConfirmToken.length == 0) {
      console.log('emailConfirmToken еще не назначен');
      return;
    }
    api.auth
      // .verifyEmail(emailConfirmToken)
      .verifyEmail()  // TODO в openapi и на бэке требовать токен для подтверждения почты
      .then(() => {
        console.log("Email confirmed!");
        const state: NotifyState = {
          msg: SUCCESS_MESSAGE
        };
        navigate(RoutePaths.notify, {state: state});
      })
      .catch((e): any => {
        console.log(e.response.data);
        setError(FAIL_MESSAGE);
      });
  }, [emailConfirmToken]);


  const _resend = () => {
    api.auth
      .sendVerificationEmail(RETURN_URL)
      .then(() => {
        console.log("Email confirmation message sent!");
        const state: NotifyState = {
          msg: MAIL_RECONFIRM_MSG
        };
        navigate(RoutePaths.notify, {state: state});
      })
      .catch((e) => {
        console.log(e.response.data);
        setError(MAIL_RECONFIRM_FAIL_MSG);
      });
  }

  return (
    <div className={styles.root}>
      <ITMO/>
      <Block className={styles.block}>
        <span className={styles.header}>Подтверждение почты</span>
        <Error value={error} isError={error != ''}/>
        <Link onClick={_resend} value={'Отправить письмо ещё раз'}/>
        <Button onClick={() => navigate(RoutePaths.login)}>Перейти на страницу входа</Button>
      </Block>
    </div>
  );
}

export default ConfirmEmail;
