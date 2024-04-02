import { RoutePaths } from '@shared/config/routes';
import styles from './index.module.css';
import { ITMO } from "@widgets/auth/ITMO";
import Block from "@widgets/Block";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Button from '@widgets/auth/Button';

type NotifyState = {
  msg?: string,
}

function NotifyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as NotifyState;

  useEffect(() => {
    if (state == null || state.msg == null) {
      navigate(RoutePaths.login, { replace: true });
    }
  });

  function _navigateLogin() {
    navigate(RoutePaths.login);
  }

  return (
    <div className={styles.root}>
      <ITMO />
      <Block className={styles.block}>
        <span>{state?.msg}</span>
      </Block>
      <Button className={styles.button} onClick={_navigateLogin}>Перейти на страницу входа</Button>
    </div>
  )
}

export default NotifyPage;
export type { NotifyState }
