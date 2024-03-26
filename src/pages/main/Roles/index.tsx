import { Home, Menu, Noted, Users } from '@shared/ui/icons';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar, { SideBarTab } from '@widgets/main/SideBar';
import Search from '@widgets/main/Search';

import styles from './index.module.css'
import Button from '@widgets/main/Button';
import RoleList from '@widgets/main/RoleList';
import { PrivilegeModel, RoleModel } from '@entities/Role';

// const _PlainIcon = () => <div style={{ height: '24px', width: '24px' }}></div>;

const _tabs: SideBarTab[] = [
  new SideBarTab('Мероприятия', <Menu />, [
    new SideBarTab('Доступные'),
    new SideBarTab('Участия'),
    new SideBarTab('Организуемые'),
    new SideBarTab('Создание'),
  ], true),
  new SideBarTab('Площадки', <Home />, [
    new SideBarTab('Доступные'),
    new SideBarTab('Создание'),
  ]),
  new SideBarTab('Уведомления', <Noted />),
  new SideBarTab('Профиль', <Users />),

]

const _roles: RoleModel[] = [
  new RoleModel(1, 'USER', [
    new PrivilegeModel(1, 'CREATE', 'Создание презентаций'),
    new PrivilegeModel(2, 'UPDATE', 'Обновление презентаций'),
    new PrivilegeModel(3, 'DELETE', 'Удаление презентаций'),
  ], 'Пользователь'),
  new RoleModel(1, 'ADMIN', [
    new PrivilegeModel(1, 'CREATE', 'Создание презентаций'),
    new PrivilegeModel(2, 'UPDATE', 'Обновление презентаций'),
    new PrivilegeModel(3, 'DELETE', 'Удаление презентаций'),
    new PrivilegeModel(1, 'CREATE', 'Создание презентаций'),
    new PrivilegeModel(2, 'UPDATE', 'Обновление презентаций'),
    new PrivilegeModel(3, 'DELETE', 'Удаление презентаций'),
  ], 'Администратор'),
  new RoleModel(1, 'PLAIN', [], 'Пользователь без ролей')
]

function RolesPage() {
  const _brandLogoClick = () => {
    console.log('brand logo!')
  }

  const _onSearch = (v: string) => {
    console.log(v);
  }

  const _createRole = (v: string) => {
    console.log(v);
  }


  const _RolesContent = () => {
    return (
      <Content className={styles.content}>
        <div className={styles.top}>
          <Search onSearch={_onSearch} placeholder="Поиск роли" />
          <Button onClick={_createRole} >Создать роль</Button>
        </div>
        <RoleList roles={_roles} />
      </Content>
    )
  }


  return (
    <Layout
      topLeft={<BrandLogo onClick={_brandLogoClick} />}
      topRight={<PageName text="Список ролей" />}
      bottomLeft={<SideBar tabs={_tabs} />}
      bottomRight={<_RolesContent />}
    />
  );
}

export default RolesPage;
