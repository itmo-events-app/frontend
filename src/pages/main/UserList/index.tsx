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
import Button from "@widgets/main/Button";
import { appendClassName } from "@shared/util.ts";
import Search from "@widgets/main/Search";
import Dialog from "@widgets/main/Dialog";
import AssignDialogContent from "@pages/main/UserList/AssignDialogContent";
import Fade from "@widgets/main/Fade";
import {createRoleElementList, roleElementListGetElements} from "@widgets/main/RoleList";
import {fromRoleModel, RoleModel, toRoleModel} from "@entities/role";
import ApiContext from "@features/api-context";
import {toUserModel, UserModel} from "@entities/user";
import {PrivilegeData} from "@entities/privilege-context";
import {PrivilegeNames} from "@shared/config/privileges";
import {ContextMenuItem} from "@widgets/main/ContextMenu";

enum DialogSelected {
  NONE,
  UPDATE,
  DELETE
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
  create: new Set([
    new PrivilegeData(PrivilegeNames.CREATE_ROLE)
  ]),
  edit: new Set([
    new PrivilegeData(PrivilegeNames.EDIT_ROLE)
  ]),
  delete: new Set([
    new PrivilegeData(PrivilegeNames.DELETE_ROLE)
  ]),

}

export default function UserListPage() {
  const { api } = useContext(ApiContext);
  const [users, setUsers] = useState([] as UserModel[]);

  const [dialogData, setDialogData] = useState(new DialogData());


  // fill users on startup
  useEffect(() => {
    api.withReauth(() => api.profile.getAllUsers())
      .then(r => {
        const l = r.data.map(user => toUserModel(user))
        setUsers(l);
      })
  }, [])

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
              <Button onClick={() => setDialogData(new DialogData('Назначение ролей',
                                                    DialogSelected.UPDATE, { userId: ue.id }))}>
                Назначить роль
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const _onSearch = () => {
    console.log('searching')
  }

  const _closeDialog = () => {
    setDialogData(new DialogData());
  }

  const _assignRoleToUser = (userId: number, roleId: number) => {
    //todo show error on null
    alert(userId + " " + roleId)
    if (roleId == null) return;
    alert("here")
    api.withReauth(() => api.role.assignSystemRole(userId, roleId))
      .then(_ => {
        // const prevRoles = roleElementListGetElements(roles);
        // setRoles(createRoleElementList([...prevRoles, role]));
        setDialogData(new DialogData());
      })
  }

  const _Dialog = () => {
    let component = <></>
    component = <AssignDialogContent
      onDone={_assignRoleToUser}
      {...dialogData.args}
    />
    return (
      <Dialog
        className={appendClassName(styles.dialog,
          (dialogData.visible ? styles.visible : styles.hidden))}
        text={dialogData.heading}
        onClose={_closeDialog}
      >
        {component}
      </Dialog>
    )
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
