import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar from '@widgets/main/SideBar';
import { RoutePaths } from '@shared/config/routes';
import Button from '@widgets/auth/Button';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const navigate = useNavigate();

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Профиль" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.profile} />}
      bottomRight=
      {
        <Content>
          <div className={styles.root}>
            <div className={styles.fullw}>
              <Button className={styles.button}>Редактировать</Button>
            </div>
            <div>
              Имя: Иванов Иван
            </div>
            <div>
              Основная роль: USER
            </div>
            <div>
              Уведомления: Включены
            </div>
            <div className={styles.fullw2}>
              <Button className={styles.button2} onClick={() => navigate(RoutePaths.login)}>Выйти</Button>
            </div>
          </div>
        </Content>
      }
    />
  );
}

export default ProfilePage;
