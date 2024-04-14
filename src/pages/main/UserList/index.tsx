import {useContext, useEffect, useRef, useState} from 'react';
import styles from './index.module.css';
import BrandLogo from "@widgets/main/BrandLogo";
import PageName from "@widgets/main/PageName";
import SideBar from "@widgets/main/SideBar";
import { RoutePaths } from "@shared/config/routes.ts";
import Content from "@widgets/main/Content";
import PagedList, { PageEntry } from "@widgets/main/PagedList";
import Layout from "@widgets/main/Layout";
import { uid } from "uid";
import { appendClassName } from "@shared/util.ts";
import Search from "@widgets/main/Search";
import Dialog from "@widgets/main/Dialog";
import AssignDialogContent from "@pages/main/UserList/AssignDialogContent";
import Fade from "@widgets/main/Fade";
import ApiContext from "@features/api-context";
import {toUserModel, UserModel} from "@entities/user";
import {PrivilegeData} from "@entities/privilege-context";
import {PrivilegeNames} from "@shared/config/privileges";
import ContextMenu, {ContextMenuItem} from "@widgets/main/ContextMenu";
import {hasAnyPrivilege} from "@features/privileges";
import PrivilegeContext from "@features/privilege-context";
import {MenuVertical} from "@shared/ui/icons";
import RevokeDialogContent from "@pages/main/UserList/RevokeDialogContent";
import MessageDialogContent from "@pages/main/UserList/MessageDialogContent";

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

enum DialogSelected {
  NONE,
  ASSIGN,
  REVOKE,
  MESSAGE
}

class DialogData {
  heading: string | undefined;
  visible: DialogSelected;
  args: any;
  constructor(
    heading?: string,
    visible: DialogSelected = DialogSelected.NONE,
    args: any = {}
  ) {
    this.heading = heading;
    this.visible = visible;
    this.args = args;
  }
}


const privilegeOthers = {
  assign: new Set([
    new PrivilegeData(PrivilegeNames.ASSIGN_SYSTEM_ROLE)
  ]),
  revoke: new Set([
    new PrivilegeData(PrivilegeNames.REVOKE_SYSTEM_ROLE)
  ])

}

export default function UserListPage() {
  const { api } = useContext(ApiContext);
  const { privilegeContext } = useContext(PrivilegeContext);
  const [users, setUsers] = useState([] as UserModel[]);

  const cmRef = useRef(null);

  const [cmData, setCmData] = useState(new ContextMenuData());
  const [dialogData, setDialogData] = useState(new DialogData());

  const menuVisible = hasAnyPrivilege(privilegeContext.systemPrivileges, new Set([
    ...privilegeOthers.assign,
    ...privilegeOthers.revoke
  ]))

  // set context menu position. not using transform(-100%, 0%) to handle content bounds
  // NOTE: COPIED FROM ROLE LIST PAGE
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

  //todo fix assign dialog closing incorrectly

  // close dialog when clicking outside
  // useEffect(() => {
  //   const handler = (e: any) => {
  //     if (dialogRef.current) {
  //       if (dialogData.visible && !(dialogRef.current as any).contains(e.target)) {
  //         _closeDialog();
  //       }
  //     }
  //   }
  //   document.addEventListener('click', handler);
  //   return () => {
  //     document.removeEventListener('click', handler);
  //   }
  // }, [dialogData, dialogRef]);

  // fill users on startup
  useEffect(() => {
    _fetchUsers()
  }, [])

  function _fetchUsers() {
    api.withReauth(() => api.profile.getAllUsers())
      .then(r => {
        const l = r.data.map(user => toUserModel(user))
        setUsers(l);
      })
  }

  const _renderedUserEntries: any[] = users.map(u => {
    return new PageEntry(() => { return _renderUserEntry(u) });
  });

  function _renderUserEntry(ue: UserModel) {
    return (
      <div key={uid()} className={styles.user}>
        <div className={styles.user_entry}>
          <div className={styles.user_left}>
            <div className={styles.user_heading}>
              <div className={styles.user_name}>
                {ue.name} {ue.surname}
              </div>
              <div className={styles.user_role}>
                {ue.role}
              </div>
            </div>
            <div className={styles.user_login}>
              {ue.loginType}: {ue.login}
            </div>
          </div>
          <div className={styles.user_right}>
            <div className={styles.read_button_container}>
              {menuVisible
                ? <MenuVertical onClick={(e) => _onMenuClick(ue, e)} className={styles.icon_dots} />
                : <div></div>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const _assignRoleToUser = (userId: number, roleId: number) => {
    //todo rewrite alerts to error messages and success operations
    api.withReauth(() => api.role.assignSystemRole(userId, roleId))
      .then(_ => {
        _fetchUsers()
        setDialogData(new DialogData('Операция прошла успешно!',
          DialogSelected.MESSAGE,
          { messageText: 'Роль пользователя отозвана.' }));
      }).catch(error => {
      setDialogData(new DialogData('Некорректная операция!',
        DialogSelected.MESSAGE,
        { messageText: error.response.data }));
    })
  }

  const _revokeRoleFromUser = (userId: number) => {
    //todo rewrite alerts to error messages and success operations
    api.withReauth(() => api.role.revokeSystemRole(userId))
      .then(_ => {
        _fetchUsers()
        setDialogData(new DialogData('Операция прошла успешно!',
          DialogSelected.MESSAGE,
          { messageText: 'Роль пользователя отозвана.' }));
      }).catch(error => {
        //todo throw error message without error code
      setDialogData(new DialogData('Некорректная операция!',
        DialogSelected.MESSAGE,
        { messageText: error.response.data }));
    })
  }

  const _onSearch = () => {
    console.log('searching')
  }

  const _closeDialog = () => {
    setDialogData(new DialogData());
  }

  const _closeContextMenu = () => {
    setCmData(new ContextMenuData());
  }

  const _Dialog = () => {
    let component = <></>
    switch (dialogData.visible) {
      case DialogSelected.ASSIGN:
        component = <AssignDialogContent
          onDone={_assignRoleToUser}
          {...dialogData.args}
        />
        break;
      case DialogSelected.REVOKE:
        component = <RevokeDialogContent
          onDone={_revokeRoleFromUser}
          {...dialogData.args}
        />;
        break;
      case DialogSelected.MESSAGE:
        component = <MessageDialogContent
          onDone={_closeDialog}
          {...dialogData.args}
        />;
        break;
    }
    return (
      <Dialog
        className={appendClassName(styles.dialog,
          (dialogData.visible ? styles.visible : styles.hidden))}
        text={dialogData.heading}
        //todo solve unclosable assign dialog issue
        // ref={dialogRef}
        onClose={_closeDialog}
      >
        {component}
      </Dialog>
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

  const _onMenuClick = (user: UserModel, e: React.MouseEvent) => {
    const contextItems: ContextMenuItem[] = [
      new ContextMenuItem('Назначить роль', (e: React.MouseEvent) => {
        setCmData({ ...cmData, visible: false });
        setDialogData(new DialogData('Назначить роль', DialogSelected.ASSIGN, { userId: user.id }));
        e.stopPropagation();
      }),
      new ContextMenuItem('Отозвать роль', () => {
        setCmData({ ...cmData, visible: false });
        setDialogData(new DialogData('Отозвать роль', DialogSelected.REVOKE, { userId: user.id }));
        e.stopPropagation();
      }),
    ]

    const mine = privilegeContext.systemPrivileges;

    const filteredItems = contextItems.filter(item => {
      switch (item.text) {
        case 'Назначить роль': return hasAnyPrivilege(mine, privilegeOthers.assign)
        case 'Отозвать роль': return hasAnyPrivilege(mine, privilegeOthers.revoke)
      }
    })
    e.stopPropagation();
    setCmData(new ContextMenuData(e.clientX, e.clientY, true, filteredItems));
  }

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Пользователи" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.userList} />}
      bottomRight={
        <Content>
          <div className={styles.search}>
            <Search onSearch={_onSearch} placeholder="Поиск" />
          </div>
          <PagedList page={1} page_size={5} page_step={5} items={_renderedUserEntries} />
          <_ContextMenu/>
          <Fade
            className={appendClassName(styles.fade,
              (dialogData.visible) ? styles.visible : styles.hidden)}>
            <_Dialog />
          </Fade>
        </Content>
      }
    />
  );
}
