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
import ContextMenu, { ContextMenuItem } from '@widgets/main/ContextMenu';
import { useEffect, useRef, useState } from 'react';

// const _PlainIcon = () => <div style={{ height: '24px', width: '24px' }}></div>;

class ContextMenuData {
  clientX: number;
  clientY: number;
  visible: boolean;
  items: ContextMenuItem[];
  constructor(
    clientX: number = 0,
    clientY: number = 0,
    visible: boolean = false,
    items: ContextMenuItem[] = []
  ) {
    this.clientX = clientX;
    this.clientY = clientY;
    this.visible = visible;
    this.items = items;
  }
}

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
  new RoleModel(1, 'PLAIN', [], 'Пользователь без привилегий')
]

function RolesPage() {
  const [cmData, setCmData] = useState(new ContextMenuData());
  const cmRef = useRef(null);

  // set context menu position. not using transform(-100%, 0%) to handle content bounds
  // NOTE: can move to controller object
  // TODO: handle when context menu out of content bounds
  useEffect(() => {
    if (cmRef.current) {
      const current = cmRef.current as any;
      current.style.left = `${cmData.clientX - (cmRef.current as any).offsetWidth}px`;
      current.style.top = `${cmData.clientY}px`;
    }
  })

  // close context menu when clicking not on context menu
  useEffect(() => {
    const handler = (e: any) => {
      if (cmRef.current) {
        if (cmData.visible && !(cmRef.current as any).contains(e.target)) {
          setCmData(new ContextMenuData());
        }
      }
    }

    document.addEventListener('click', handler);

    return () => {
      document.removeEventListener('click', handler);
    }
  }, [cmData, cmRef]);

  const _brandLogoClick = () => {
    console.log('brand logo!')
  }

  const _onSearch = (v: string) => {
    console.log(v);
  }

  const _createRole = (v: any) => {
    console.log(v);
  }

  const _onMenuClick = (role: RoleModel, e: React.MouseEvent) => {
    const _contextItems: ContextMenuItem[] = [
      new ContextMenuItem('Удалить', () => {
        console.log(role, 'delete!')
        setCmData({ ...cmData, visible: false });
      }),
      new ContextMenuItem('Редактировать', () => {
        console.log(role, 'edit!')
        setCmData({ ...cmData, visible: false });
      }),
      new ContextMenuItem('Дублировать', () => {
        console.log(role, 'duplicate!')
        setCmData({ ...cmData, visible: false });
      }),
    ]
    e.stopPropagation();
    setCmData(new ContextMenuData(e.clientX, e.clientY, true, _contextItems));
  }

  const _ContextMenu = () => {
    const style: React.CSSProperties = {
      position: 'absolute',
      visibility: cmData.visible ? 'visible' : 'hidden',
    }

    return <ContextMenu
      items={cmData.items}
      style={style}
      ref={cmRef}
    />;
  }

  const _RolesContent = () => {
    return (
      <Content className={styles.content}>
        <div className={styles.top}>
          <Search onSearch={_onSearch} placeholder="Поиск роли" />
          <Button onClick={_createRole} >Создать роль</Button>
        </div>
        <RoleList roles={_roles} onMenuClick={_onMenuClick} />
        <_ContextMenu />
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
