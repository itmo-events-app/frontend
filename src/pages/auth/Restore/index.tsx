import styles from './index.module.css';
import { ITMO } from "@widgets/auth/ITMO";
import Block from "@widgets/Block";
import Label from "@widgets/auth/InputLabel";
import Input from "@widgets/auth/Input";
import Button from "@widgets/auth/Button";
import { useNavigate } from 'react-router-dom';
import { NotifyState } from '../Notification';
import { RoutePaths } from '@shared/config/routes';

const label = 'Пожалуйста, укажите ваш email. Вы получите письмо со ссылкой для создания нового пароля.';
const msg = 'Заявка на восстановление отправлена. Вы получите письмо со ссылкой для создания нового пароля.'


function RestorePage() {
  const navigate = useNavigate();

  const _restore = () => {
    const state: NotifyState = {
      msg: msg
    }
    navigate(RoutePaths.notify, { state: state });
  }

  return (
    <div className={styles.root}>
      <ITMO />
      <Block className={styles.block}>
        <span className={styles.header}>Восстановление пароля</span>
        <div className={styles.form_item}>
          <Label value={label} />
          <Input />
        </div>
        <Button onClick={_restore}>Восстановить пароль</Button>
      </Block>
    </div>
  )
}

export default RestorePage;
