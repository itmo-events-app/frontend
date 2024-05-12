import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar from '@widgets/main/SideBar';
import Search from '@widgets/main/Search';
import Button from '@widgets/main/Button';
import RoleList, { RoleElement } from '@widgets/main/RoleList';
import { RoleModel } from '@entities/role';
import ContextMenu, { ContextMenuItem } from '@widgets/main/ContextMenu';
import { useContext, useEffect, useRef, useState } from 'react';
import Dialog from '@widgets/main/Dialog';
import { appendClassName } from '@shared/util';

import styles from './index.module.css';
import Fade from '@widgets/main/Fade';
import { RoutePaths } from '@shared/config/routes';
import { hasAnyPrivilege } from '@features/privileges';
import { PrivilegeNames } from '@shared/config/privileges';
import { toRoleModel } from '@entities/role';
import CreateDialogContent from './CreateDialogContent';
import UpdateDialogContent from './UpdateDialogContext';
import PrivilegeContext from '@features/privilege-context';
import { PrivilegeData } from '@entities/privilege-context';
import ApiContext from '@features/api-context';
import { createRoleElementList, roleElementListGetElements } from '@widgets/main/RoleList/common';

class ContextMenuData {
  clientX: number;
  clientY: number;
  visible: boolean;
  items: ContextMenuItem[];
  constructor(clientX: number = 0, clientY: number = 0, visible: boolean = false, items: ContextMenuItem[] = []) {
    this.clientX = clientX;
    this.clientY = clientY;
    this.visible = visible;
    this.items = items;
  }
}

enum DialogSelected {
  NONE,
  CREATE,
  UPDATE,
}

class DialogData {
  heading: string | undefined;
  visible: DialogSelected;
  args: any;
  constructor(heading?: string, visible: DialogSelected = DialogSelected.NONE, args: any = {}) {
    this.heading = heading;
    this.visible = visible;
    this.args = args;
  }
}

const privilegeOthers = {
  create: new Set([new PrivilegeData(PrivilegeNames.CREATE_ROLE)]),
  edit: new Set([new PrivilegeData(PrivilegeNames.EDIT_ROLE)]),
  delete: new Set([new PrivilegeData(PrivilegeNames.DELETE_ROLE)]),
};

function RoleListPage() {
  const { privilegeContext } = useContext(PrivilegeContext);
  const { api } = useContext(ApiContext);

  const [cmData, setCmData] = useState(new ContextMenuData());
  const [dialogData, setDialogData] = useState(new DialogData());

  const [search, setSearch] = useState('');

  const cmRef = useRef(null);
  const dialogRef = useRef(null);

  const menuVisible = hasAnyPrivilege(
    privilegeContext.systemPrivileges,
    new Set([...privilegeOthers.edit, ...privilegeOthers.delete])
  );

  const [roles, setRoles] = useState([] as RoleElement[]);

  // set context menu position. not using transform(-100%, 0%) to handle content bounds
  // NOTE: can move to controller object
  // TODO: handle when context menu out of content bounds
  useEffect(() => {
    if (cmRef.current) {
      const current = cmRef.current as any;
      current.style.left = `${cmData.clientX - (cmRef.current as any).offsetWidth}px`;
      current.style.top = `${cmData.clientY}px`;
    }
  });

  // close context menu when clicking outside
  useEffect(() => {
    const handler = (e: any) => {
      if (cmRef.current) {
        if (cmData.visible && !(cmRef.current as any).contains(e.target)) {
          _closeContextMenu();
        }
      }
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [cmData, cmRef]);

  // close dialog when clicking outside
  useEffect(() => {
    const handler = (e: any) => {
      if (dialogRef.current) {
        console.log(e.target)
        if (dialogData.visible && !(dialogRef.current as any).contains(e.target) && e.target.role != "option") {
          _closeDialog();
        }
      }
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [dialogData, dialogRef]);

  // load roles on page open
  useEffect(() => {
    api
      .withReauth(() => api.role.getAllRoles())
      .then((r) => {
        const l = createRoleElementList(r.data.map((role) => toRoleModel(role)));
        setRoles(l);
      });
  }, []);

  const _closeDialog = () => {
    setDialogData(new DialogData());
  };

  const _closeContextMenu = () => {
    setCmData(new ContextMenuData());
  };

  const _onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const _openCreateDialog = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setDialogData(new DialogData('Создание роли', DialogSelected.CREATE));
    e.stopPropagation();
  };

  const _onMenuClick = (role: RoleModel, e: React.MouseEvent) => {
    const contextItems: ContextMenuItem[] = [
      new ContextMenuItem('Редактировать', (e: React.MouseEvent) => {
        setCmData({ ...cmData, visible: false });
        setDialogData(new DialogData('Редактирование роли', DialogSelected.UPDATE, { role: role }));
        e.stopPropagation();
      }),
      new ContextMenuItem('Удалить', () => {
        setCmData({ ...cmData, visible: false });
        _deleteRole(role);
      }),
    ];

    const mine = privilegeContext.systemPrivileges;

    const filteredItems = contextItems.filter((item) => {
      switch (item.text) {
        case 'Редактировать':
          return hasAnyPrivilege(mine, privilegeOthers.edit) && role.isEditable;
        case 'Удалить':
          return hasAnyPrivilege(mine, privilegeOthers.delete) && role.isEditable;
      }
    });

    e.stopPropagation();
    setCmData(new ContextMenuData(e.clientX, e.clientY, true, filteredItems));
  };

  const _onSearchSearch = (v: string) => {
    api
      .withReauth(() => api.role.searchByName(v))
      .then((r) => {
        setRoles(createRoleElementList(r.data.map((role) => toRoleModel(role))));
      });
  };

  const _createRoleCallback = (role: RoleModel) => {
    const prevRoles = roleElementListGetElements(roles);
    setRoles(createRoleElementList([...prevRoles, role]));
    setDialogData(new DialogData());
  };

  const _updateRoleCallback = (prev: RoleModel, cur: RoleModel) => {
    const prevRoles = roleElementListGetElements(roles);

    setRoles(
      createRoleElementList(
        prevRoles.map((p) => {
          if (p.id == prev.id) {
            return cur;
          }
          return p;
        })
      )
    );
    setDialogData(new DialogData());
  };

  const _deleteRole = (cur: RoleModel) => {
    api
      .withReauth(() => api.role.deleteRole(cur.id))
      .then((_) => {
        const prevRoles = roleElementListGetElements(roles);
        setRoles(createRoleElementList(prevRoles.filter((r) => r.id !== cur.id)));
      });
  };

  const _RolesContent = () => {
    return (
      <Content className={styles.content}>
        <div className={styles.top}>
          <Search value={search} onChange={_onSearchChange} onSearch={_onSearchSearch} placeholder="Поиск роли" />
          {hasAnyPrivilege(privilegeContext.systemPrivileges, privilegeOthers.create) ? (
            <Button onClick={_openCreateDialog} className={styles.create_button}>
              Создать роль
            </Button>
          ) : (
            <></>
          )}
        </div>
        <RoleList roles={roles} setRoles={setRoles} onMenuClick={menuVisible ? _onMenuClick : undefined} />
      </Content>
    );
  };

  const _ContextMenu = () => {
    return (
      <ContextMenu
        items={cmData.items}
        className={appendClassName(styles.context_menu, cmData.visible ? styles.visible : styles.hidden)}
        ref={cmRef}
      />
    );
  };

  const _Dialog = () => {
    let component = <></>;
    switch (dialogData.visible) {
      case DialogSelected.CREATE:
        component = <CreateDialogContent callback={_createRoleCallback} {...dialogData.args} />;
        break;
      case DialogSelected.UPDATE:
        component = <UpdateDialogContent callback={_updateRoleCallback} {...dialogData.args} />;
        break;
    }
    return (
      <Dialog
        className={appendClassName(styles.dialog, dialogData.visible ? styles.visible : styles.hidden)}
        text={dialogData.heading}
        ref={dialogRef}
        onClose={_closeDialog}
      >
        {component}
      </Dialog>
    );
  };

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Роли" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.roleList} />}
      bottomRight={_RolesContent()}
    >
      <_ContextMenu />
      <Fade className={appendClassName(styles.fade, dialogData.visible ? styles.visible : styles.hidden)}>
        <_Dialog />
      </Fade>
    </Layout>
  );
}

export default RoleListPage;
