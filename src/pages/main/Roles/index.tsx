import { Home, Menu, Noted, Users } from '@shared/ui/icons';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar, { SideBarTab } from '@widgets/main/SideBar';
import Search from '@widgets/main/Search';
import Button from '@widgets/main/Button';
import RoleList from '@widgets/main/RoleList';
import { PrivilegeModel, RoleModel } from '@entities/Role';
import ContextMenu, { ContextMenuItem } from '@widgets/main/ContextMenu';
import { useEffect, useRef, useState } from 'react';
import Dialog from '@widgets/main/Dialog';
import { appendClassName } from '@shared/util';

import styles from './index.module.css'
import Fade from '@widgets/main/Fade';

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

class DialogData {
  content: any;
  visible: boolean;
  constructor(
    content?: any,
    visible: boolean = false,
  ) {
    this.content = content;
    this.visible = visible;
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
    new SideBarTab('Созданиe'),
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

const _CreateRoleDialogContent = () => {
  return (
    <div className={styles.dialog_content}>
      Create role
    </div>
  );
}

const _UpdateRoleDialogContent = (props: {role: RoleModel}) => {
  return (
    <div className={styles.dialog_content}>
      Update role + <div>{props.role.name}</div>
    </div>
  );
}


function RolesPage() {
  const [cmData, setCmData] = useState(new ContextMenuData());
  const [dialogData, setDialogData] = useState(new DialogData(true));

  const cmRef = useRef(null);
  const dialogRef = useRef(null);

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

  // close context menu when clicking outside
  useEffect(() => {
    const handler = (e: any) => {
      if (cmRef.current) {
        if (cmData.visible && !(cmRef.current as any).contains(e.target)) {
          _closeContextMenu();
        }
      }
    }
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    }
  }, [cmData, cmRef]);

  // close dialog when clicking outside
  useEffect(() => {
    const handler = (e: any) => {
      if (dialogRef.current) {
        if (dialogData.visible && !(dialogRef.current as any).contains(e.target)) {
          console.log('closing dialog.');
          _closeDialog();
        }
      }
    }
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    }
  }, [dialogData, dialogRef]);


  const _closeDialog = () => {
    setDialogData(new DialogData());
  }

  const _closeContextMenu = () => {
    setCmData(new ContextMenuData());
  }


  const _brandLogoClick = () => {
    console.log('brand logo!')
  }

  const _onSearch = (v: string) => {
    console.log(v);
  }

  const _createRole = (e: MouseEvent) => {
    setDialogData(new DialogData(_CreateRoleDialogContent(), true));
    e.stopPropagation();
  }

  const _onMenuClick = (role: RoleModel, e: React.MouseEvent) => {
    const _contextItems: ContextMenuItem[] = [
      new ContextMenuItem('Удалить', () => {
        setCmData({ ...cmData, visible: false });
      }),
      new ContextMenuItem('Редактировать', (e: React.MouseEvent) => {
        setCmData({ ...cmData, visible: false });
        setDialogData(new DialogData(_UpdateRoleDialogContent({role: role}), true));
        e.stopPropagation();
      }),
      new ContextMenuItem('Дублировать', () => {
        setCmData({ ...cmData, visible: false });
      }),
    ]
    e.stopPropagation();
    setCmData(new ContextMenuData(e.clientX, e.clientY, true, _contextItems));
  }

  const _RolesContent = () => {
    return (
      <Content className={styles.content}>
        <div className={styles.top}>
          <Search onSearch={_onSearch} placeholder="Поиск роли" />
          <Button onClick={_createRole} >Создать роль</Button>
        </div>
        <RoleList roles={_roles} onMenuClick={_onMenuClick} />
      </Content>
    )
  }

  const _ContextMenu = () => {
    return <ContextMenu
      items={cmData.items}
      className={appendClassName(styles.context_menu,
        (cmData.visible ? styles.visible : styles.hidden))}
      ref={cmRef}
    />;
  }

  const _Dialog = () => {
    return (
      <Dialog
        className={appendClassName(styles.dialog,
          (dialogData.visible ? styles.visible : styles.hidden))}
        text="Создать роль"
        ref={dialogRef}
        onClose={_closeDialog}
      >
        {dialogData.content}
      </Dialog>
    )
  }

  return (
    <Layout
      topLeft={<BrandLogo onClick={_brandLogoClick} />}
      topRight={<PageName text="Список ролей" />}
      bottomLeft={<SideBar tabs={_tabs} />}
      bottomRight={<_RolesContent />}
    >
      <_ContextMenu />
      <Fade
        className={appendClassName(styles.fade,
          (dialogData.visible) ? styles.visible : styles.hidden)}>
        <_Dialog />
      </Fade>
    </Layout>
  );
}

export default RolesPage;
