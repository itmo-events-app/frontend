import { ITMOLogo as ITMOLogo } from '@shared/ui/icons';

import styles from './index.module.css';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@shared/config/routes';

export function ITMO() {
  const navigate = useNavigate();

  function _redirectToLogin() {
    navigate(RoutePaths.login);
  }

  return <ITMOLogo className={styles.logo} onClick={_redirectToLogin} />;
}
