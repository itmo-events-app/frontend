import { uid } from 'uid'
import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar from '@widgets/main/SideBar';
import { RoutePaths } from '@shared/config/routes';
import Button from '@widgets/auth/Button';
import { useNavigate } from 'react-router-dom';

class EventRole {
  id: string
  eventName: string
  eventRole: string

  constructor(
    eventName: string,
    eventRole: string,
  ) {
    this.id = uid();
    this.eventName = eventName;
    this.eventRole = eventRole;
  }
}

const _mainRole: string = "USER";

const _additionalRoles: EventRole[] = [
  new EventRole("Событие 1", "Главный оргаизатор"),
  new EventRole("Событие 2", "Помощник организатора"),
  new EventRole("Событие 3", "Модератор")
]

function ProfilePage() {
  const navigate = useNavigate();

  function _createRole(role: EventRole) {
    return (
      <tr key={role.id}>
        <td>{role.eventName}</td>
        <td>{role.eventRole}</td>
      </tr>
    );
  }

  function _createRoleTable(mainRole: string, additionalRoles: EventRole[]) {
    const items: any = [];

    for (const role of additionalRoles) {
      items.push(_createRole(role));
    }

    return (
      <table className={styles.roles_table}>
        <tbody>
        <tr>
          <th>Основная роль</th>
          <th>{mainRole}</th>
        </tr>
        {items}
        </tbody>
      </table>
    );
  }

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Профиль" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.profile} />}
      bottomRight=
        {
          <Content>
            <div className={styles.root}>
              <div className={styles.profile}>
                <div className={styles.profile_col}>
                  <table className={styles.table}>
                    <tbody>
                    <tr>
                      <td>Имя</td>
                      <td>Иванов Иван</td>
                    </tr>
                    <tr>
                      <td>Уведомления</td>
                      <td>Включены</td>
                    </tr>
                    </tbody>
                  </table>
                  <div className={styles.button_row}>
                    <Button className={styles.button}>Редактировать</Button>
                    <Button className={styles.button} onClick={() => navigate(RoutePaths.login)}>Выйти</Button>
                  </div>
                </div>
              </div>
              {_createRoleTable(_mainRole, _additionalRoles)}
            </div>
          </Content>
        }
    />
  );
}

export default ProfilePage;
