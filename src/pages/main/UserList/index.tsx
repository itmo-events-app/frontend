import { useContext, useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import PageName from '@widgets/main/PageName';
import SideBar from '@widgets/main/SideBar';
import { RoutePaths } from '@shared/config/routes.ts';
import Content from '@widgets/main/Content';
import { PageEntry } from '@widgets/main/PagedList';
import Layout from '@widgets/main/Layout';
import { uid } from 'uid';
import { appendClassName } from '@shared/util.ts';
import Search from '@widgets/main/Search';
import Dialog from '@widgets/main/Dialog';
import DialogContent from '@pages/main/UserList/DialogContent';
import Fade from '@widgets/main/Fade';
import ApiContext from '@features/api-context';
import { RoleGroup, toUserModel, UserModel } from '@entities/user';
import { PrivilegeData } from '@entities/privilege-context';
import { PrivilegeNames } from '@shared/config/privileges';
import ContextMenu, { ContextMenuItem } from '@widgets/main/ContextMenu';
import { hasAnyPrivilege } from '@features/privileges';
import PrivilegeContext from '@features/privilege-context';
import { ArrowDown, MenuVertical } from '@shared/ui/icons';
import MessageDialogContent from '@pages/main/UserList/MessageDialogContent';
import { UserResponse } from '@shared/api/generated/model';
import PagedList2 from '@widgets/main/PagedList2';

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
  ASSIGN_SYSTEM,
  REVOKE_SYSTEM,
  ASSIGN_EVENT,
  REVOKE_EVENT,
  MESSAGE,
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

class UserElement {
  entry: UserModel;
  expanded: boolean;

  constructor(entry: UserModel, expanded: boolean = false) {
    this.entry = entry;
    this.expanded = expanded;
  }
}

const privilegeOthers = {
  assign_system: new Set([new PrivilegeData(PrivilegeNames.ASSIGN_SYSTEM_ROLE)]),
  revoke_system: new Set([new PrivilegeData(PrivilegeNames.REVOKE_SYSTEM_ROLE)]),
  // assign_event: new Set([new PrivilegeData(PrivilegeNames.ASSIGN_ORGANIZATIONAL_ROLE)]),
  // revoke_event: new Set([new PrivilegeData(PrivilegeNames.REVOKE_ORGANIZATIONAL_ROLE)]),
};

export default function UserListPage() {
  const { api } = useContext(ApiContext);
  const { privilegeContext } = useContext(PrivilegeContext);
  const [userElements, setUserElements] = useState([] as UserElement[]);
  const [userElementPage, setUserElementPage] = useState([] as PageEntry[]);

  const cmRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(1);

  const [cmData, setCmData] = useState(new ContextMenuData());
  const [dialogData, setDialogData] = useState(new DialogData());

  // const menuVisible = hasAnyPrivilege(
  //   privilegeContext.systemPrivileges,
  //   new Set([...privilegeOthers.assign_system, ...privilegeOthers.revoke_system,
  //     ...privilegeOthers.assign_event, ...privilegeOthers.revoke_event])
  // );

  // set context menu position. not using transform(-100%, 0%) to handle content bounds
  // NOTE: COPIED FROM ROLE LIST PAGE
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

  // fill users on startup
  useEffect(() => {
    _fetchUsers();
  }, [page, size]);

  function _fetchUsers() {
    api
      .withReauth(() => api.profile.getAllUsers(searchQuery, page - 1, size))
      .then((r) => {
        const l = r.data.items?.map((user: UserResponse) => new UserElement(toUserModel(user))) || [];
        setUserElements(l);
        setTotalElements(r.data.total || 0);
        setTotalPages(Math.ceil((r.data.total || 0) / size));
      });
  }

  function _createRoleGroup(roleGroup: RoleGroup) {
    return (
      <div key={uid()} className={styles.role_group}>
        <div className={styles.role_group_name}>{roleGroup.name}</div>
        <div className={styles.role_group_roles}>
          {roleGroup.roles.map((role, index) => (
            <div key={index}>{role}</div>
          ))}
        </div>
      </div>
    );
  }

  function _createRoleGroupList(roleGroups: RoleGroup[]) {
    const res = [];
    for (const group of roleGroups) {
      res.push(_createRoleGroup(group));
    }
    return res;
  }

  function _expand(tab: UserElement) {
    return () => {
      tab.expanded = !tab.expanded;
      setUserElements([...userElements]);
    };
  }

  useEffect(() => {
    setUserElementPage(
      userElements.map((ne) => {
        return new PageEntry(() => _renderUserEntry(ne));
      })
    );
  }, [userElements]);

  function _renderUserEntry(ue: UserElement) {
    return (
      <div key={uid()} className={styles.user}>
        <div className={styles.user_entry}>
          <div className={styles.user_left}>
            <div className={styles.user_heading}>
              <div className={styles.user_name}>
                {ue.entry.name} {ue.entry.surname}
              </div>
              {/*<div className={styles.user_role}>{ue.systemRoles}</div>*/}
            </div>
            <div className={styles.user_login}>
              {ue.entry.loginType}: {ue.entry.login}
            </div>
          </div>
          <div className={styles.user_right}>
            <div className={styles.read_button_container}>
              <MenuVertical onClick={(e) => _onMenuClick(ue.entry, e)} className={styles.icon_dots} />
              <ArrowDown
                onClick={_expand(ue)}
                className={appendClassName(styles.icon_expand, ue.expanded ? styles.expanded : null)}
              />
            </div>
          </div>
        </div>
        {ue.expanded ? (
          <div className={styles.role_groups}>{_createRoleGroupList(ue.entry.roleGroups ?? [])}</div>
        ) : (
          <></>
        )}
      </div>
    );
  }

  const _assignRoleToUser = (userId: number, roleId: number, eventId: number) => {
    if (eventId == -1) {
      _assignSystemRole(userId, roleId);
    } else {
      if (eventId == 0) {
        setDialogData(
          new DialogData('Некорректная операция!', DialogSelected.MESSAGE, {
            messageText: 'Вы должны выбрать мероприятие!',
          })
        );
        return;
      }
      switch (roleId) {
        //magic numbers are default role ids
        case 3:
          _assignOrganizerRole(userId, eventId);
          break;
        case 4:
          _assignAssistantRole(userId, eventId);
          break;
        default:
          _assignOrganizationalRole(userId, roleId, eventId);
          break;
      }
    }
  };

  function _assignSystemRole(userId: number, roleId: number) {
    api
      .withReauth(() => api.role.assignSystemRole(userId, roleId))
      .then((_) => {
        _fetchUsers();
        setDialogData(
          new DialogData('Операция прошла успешно!', DialogSelected.MESSAGE, {
            messageText: 'Роль назначена пользователю!',
          })
        );
      })
      .catch((error) => {
        setDialogData(
          new DialogData('Некорректная операция!', DialogSelected.MESSAGE, { messageText: error.response.data })
        );
      });
  }

  function _assignOrganizationalRole(userId: number, roleId: number, eventId: number) {
    api
      .withReauth(() => api.role.assignOrganizationalRole(userId, eventId, roleId))
      .then((_) => {
        _fetchUsers();
        setDialogData(
          new DialogData('Операция прошла успешно!', DialogSelected.MESSAGE, {
            messageText: 'Роль назначена пользователю!',
          })
        );
      })
      .catch((error) => {
        setDialogData(
          new DialogData('Некорректная операция!', DialogSelected.MESSAGE, { messageText: error.response.data })
        );
      });
  }

  function _assignOrganizerRole(userId: number, eventId: number) {
    api
      .withReauth(() => api.role.assignOrganizerRole(userId, eventId))
      .then((_) => {
        _fetchUsers();
        setDialogData(
          new DialogData('Операция прошла успешно!', DialogSelected.MESSAGE, {
            messageText: 'Роль назначена пользователю!',
          })
        );
      })
      .catch((error) => {
        setDialogData(
          new DialogData('Некорректная операция!', DialogSelected.MESSAGE, { messageText: error.response.data })
        );
      });
  }

  function _assignAssistantRole(userId: number, eventId: number) {
    api
      .withReauth(() => api.role.assignAssistantRole(userId, eventId))
      .then((_) => {
        _fetchUsers();
        setDialogData(
          new DialogData('Операция прошла успешно!', DialogSelected.MESSAGE, {
            messageText: 'Роль назначена пользователю!',
          })
        );
      })
      .catch((error) => {
        setDialogData(
          new DialogData('Некорректная операция!', DialogSelected.MESSAGE, { messageText: error.response.data })
        );
      });
  }

  const _revokeRoleFromUser = (userId: number, roleId: number, eventId: number) => {
    if (eventId == -1) {
      _revokeSystemRole(userId, roleId);
    } else {
      if (eventId == 0) {
        setDialogData(
          new DialogData('Некорректная операция!', DialogSelected.MESSAGE, {
            messageText: 'Вы должны выбрать мероприятие!',
          })
        );
        return;
      }
      switch (roleId) {
        //magic numbers are default role ids
        case 3:
          _revokeOrganizerRole(userId, eventId);
          break;
        case 4:
          _revokeAssistantRole(userId, eventId);
          break;
        default:
          _revokeOrganizationalRole(userId, roleId, eventId);
          break;
      }
    }
  };

  function _revokeSystemRole(userId: number, roleId: number) {
    api
      .withReauth(() => api.role.revokeSystemRole(userId, roleId))
      .then((_) => {
        _fetchUsers();
        setDialogData(
          new DialogData('Операция прошла успешно!', DialogSelected.MESSAGE, {
            messageText: 'Роль пользователя отозвана.',
          })
        );
      })
      .catch((error) => {
        setDialogData(
          new DialogData('Некорректная операция!', DialogSelected.MESSAGE, { messageText: error.response.data })
        );
      });
  }

  function _revokeOrganizationalRole(userId: number, roleId: number, eventId: number) {
    api
      .withReauth(() => api.role.revokeOrganizationalRole(userId, eventId, roleId))
      .then((_) => {
        _fetchUsers();
        setDialogData(
          new DialogData('Операция прошла успешно!', DialogSelected.MESSAGE, {
            messageText: 'Роль пользователя отозвана.',
          })
        );
      })
      .catch((error) => {
        setDialogData(
          new DialogData('Некорректная операция!', DialogSelected.MESSAGE, { messageText: error.response.data })
        );
      });
  }

  function _revokeOrganizerRole(userId: number, eventId: number) {
    api
      .withReauth(() => api.role.revokeOrganizerRole(userId, eventId))
      .then((_) => {
        _fetchUsers();
        setDialogData(
          new DialogData('Операция прошла успешно!', DialogSelected.MESSAGE, {
            messageText: 'Роль пользователя отозвана.',
          })
        );
      })
      .catch((error) => {
        setDialogData(
          new DialogData('Некорректная операция!', DialogSelected.MESSAGE, { messageText: error.response.data })
        );
      });
  }

  function _revokeAssistantRole(userId: number, eventId: number) {
    api
      .withReauth(() => api.role.revokeAssistantRole(userId, eventId))
      .then((_) => {
        _fetchUsers();
        setDialogData(
          new DialogData('Операция прошла успешно!', DialogSelected.MESSAGE, {
            messageText: 'Роль пользователя отозвана.',
          })
        );
      })
      .catch((error) => {
        setDialogData(
          new DialogData('Некорректная операция!', DialogSelected.MESSAGE, { messageText: error.response.data })
        );
      });
  }

  const _onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const _closeDialog = () => {
    setDialogData(new DialogData());
  };

  const _closeContextMenu = () => {
    setCmData(new ContextMenuData());
  };

  const _Dialog = () => {
    let component = <></>;
    switch (dialogData.visible) {
      case DialogSelected.ASSIGN_SYSTEM:
        component = (
          <DialogContent
            onDone={_assignRoleToUser}
            isEvent={false}
            isRevoke={false}
            buttonText={'Назначить роль'}
            {...dialogData.args}
          />
        );
        break;
      case DialogSelected.REVOKE_SYSTEM:
        component = (
          <DialogContent
            onDone={_revokeRoleFromUser}
            isEvent={false}
            isRevoke={true}
            buttonText={'Отозвать роль'}
            {...dialogData.args}
          />
        );
        break;
      case DialogSelected.ASSIGN_EVENT:
        component = (
          <DialogContent
            onDone={_assignRoleToUser}
            isEvent={true}
            isRevoke={false}
            buttonText={'Назначить роль'}
            {...dialogData.args}
          />
        );
        break;
      case DialogSelected.REVOKE_EVENT:
        component = (
          <DialogContent
            onDone={_revokeRoleFromUser}
            isEvent={true}
            isRevoke={true}
            buttonText={'Отозвать роль'}
            {...dialogData.args}
          />
        );
        break;
      case DialogSelected.MESSAGE:
        component = <MessageDialogContent onDone={_closeDialog} {...dialogData.args} />;
        break;
    }
    const saveOverflow = dialogData.visible === DialogSelected.REVOKE_EVENT;
    return (
      <Dialog
        className={appendClassName(saveOverflow ? styles.dialog_unoverflow : styles.dialog, dialogData.visible ? styles.visible : styles.hidden)}
        text={dialogData.heading}
        onClose={_closeDialog}
        saveOverflow={saveOverflow}
      >
        {component}
      </Dialog>
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

  const _onMenuClick = (user: UserModel, e: React.MouseEvent) => {
    const contextItems: ContextMenuItem[] = [
      new ContextMenuItem('Назначить системную роль', (e: React.MouseEvent) => {
        setCmData({ ...cmData, visible: false });
        setDialogData(new DialogData('Назначить системную роль', DialogSelected.ASSIGN_SYSTEM, { userId: user.id }));
        e.stopPropagation();
      }),
      new ContextMenuItem('Отозвать системную роль', () => {
        setCmData({ ...cmData, visible: false });
        setDialogData(new DialogData('Отозвать системную роль', DialogSelected.REVOKE_SYSTEM, { userId: user.id }));
        e.stopPropagation();
      }),
      new ContextMenuItem('Назначить организационную роль', (e: React.MouseEvent) => {
        setCmData({ ...cmData, visible: false });
        setDialogData(
          new DialogData('Назначить организационную роль', DialogSelected.ASSIGN_EVENT, { userId: user.id })
        );
        e.stopPropagation();
      }),
      new ContextMenuItem('Отозвать организационную роль', () => {
        setCmData({ ...cmData, visible: false });
        setDialogData(
          new DialogData('Отозвать организационную роль', DialogSelected.REVOKE_EVENT, { userId: user.id })
        );
        e.stopPropagation();
      }),
    ];

    const mine = privilegeContext.systemPrivileges;

    const filteredItems = contextItems.filter((item) => {
      switch (item.text) {
        case 'Назначить системную роль':
          return hasAnyPrivilege(mine, privilegeOthers.assign_system);
        case 'Отозвать системную роль':
          return hasAnyPrivilege(mine, privilegeOthers.revoke_system);
        case 'Назначить организационную роль':
          return true;
        case 'Отозвать организационную роль':
          return true;
      }
    });
    e.stopPropagation();
    setCmData(new ContextMenuData(e.clientX, e.clientY, true, filteredItems));
  };

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Пользователи" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.userList} />}
      bottomRight={
        <Content>
          <div className={styles.search}>
            <Search
              value={searchQuery}
              onChange={_onSearchChange}
              onSearch={_fetchUsers}
              placeholder="Поиск пользователей"
            />
          </div>
          <PagedList2
            page={page}
            setPage={setPage}
            page_size={size}
            setPageSize={setSize}
            page_step={5}
            total_pages={totalPages}
            total_elements={totalElements}
            items={userElementPage}
          />
          <_ContextMenu />
          <Fade className={appendClassName(styles.fade, dialogData.visible ? styles.visible : styles.hidden)}>
            <_Dialog />
          </Fade>
        </Content>
      }
    />
  );
}
