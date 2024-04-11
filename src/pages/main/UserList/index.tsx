import { useEffect, useState } from 'react';
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
import { ArrowDown } from "@shared/ui/icons";
import Search from "@widgets/main/Search";
import Dialog from "@widgets/main/Dialog";
import AssignDialogContent from "@pages/main/UserList/AssignDialogContent";
import Fade from "@widgets/main/Fade";

class DialogData {
  heading: string | undefined;
  visible: boolean;
  args: any;
  constructor(
    heading?: string,
    visible: boolean = false,
    args: any = {}
  ) {
    this.heading = heading;
    this.visible = visible;
    this.args = args;
  }
}

export class UserRole {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}

class User {
  id: string;
  name: string;
  surname: string;
  email: string;
  roles: UserRole[];

  constructor(name: string, surname: string, email: string, roles: UserRole[]) {
    this.id = uid();
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.roles = roles;
  }
}

const _userRoles: UserRole[] = [
  new UserRole("ADMIN", "администратор"),
  new UserRole("READER", "читатель"),
  new UserRole("REDACTOR", "редактор"),
]

const _users: User[] = [
  new User("Иван", "Иванов", "ivan@itmo.ru", _userRoles),
  new User("Сергей", "Сергеев", "sergey@itmo.ru", _userRoles),
  new User("Илья", "Ильин", "ilya@itmo.ru", _userRoles),
  new User("Иван", "Иванов", "ivan@itmo.ru", _userRoles),
  new User("Сергей", "Сергеев", "sergey@itmo.ru", _userRoles),
  new User("Илья", "Ильин", "ilya@itmo.ru", _userRoles),
  new User("Иван", "Иванов", "ivan@itmo.ru", _userRoles),
  new User("Сергей", "Сергеев", "sergey@itmo.ru", _userRoles),
  new User("Илья", "Ильин", "ilya@itmo.ru", _userRoles),
  new User("Иван", "Иванов", "ivan@itmo.ru", _userRoles),
  new User("Сергей", "Сергеев", "sergey@itmo.ru", _userRoles),
  new User("Илья", "Ильин", "ilya@itmo.ru", _userRoles),
  new User("Иван", "Иванов", "ivan@itmo.ru", _userRoles),
  new User("Сергей", "Сергеев", "sergey@itmo.ru", _userRoles),
  new User("Илья", "Ильин", "ilya@itmo.ru", _userRoles)
];

class UserEntry {
  data: User;
  expanded: boolean;

  constructor(data: User, expanded: boolean) {
    this.data = data;
    this.expanded = expanded;
  }
}

export default function UserListPage() {
  const [users, setUsers] = useState(_users);
  const [dialogData, setDialogData] = useState(new DialogData());
  const [userEntries, setUserEntries] = useState(
    users.map(u => new UserEntry(u, false))
  );

  useEffect(() => {
    setUserEntries(users.map(u => new UserEntry(u, false)));
  }, [users]);

  const _renderedUserEntries: any[] = userEntries.map(u => {
    return new PageEntry(() => { return _renderUserEntry(u) });
  });

  function _renderUserEntry(ue: UserEntry) {
    return (
      <div className={styles.user_entry} key={ue.data.id}>
        <div className={styles.user_info}>
          <span className={styles.user_text}>
            {ue.data.name} {ue.data.surname}
          </span>
          <span className={styles.user_email}>
            {ue.data.email}
          </span>
          <div>
            {ue.expanded && (
              <div className={styles.user_table}>
                <table>
                  <thead>
                  <tr>
                    <th>Роль</th>
                    <th>Описание</th>
                  </tr>
                  </thead>
                  <tbody>
                  {ue.data.roles.map(role => (
                    <tr key={role.name}>
                      <td>{role.name}</td>
                      <td>{role.description}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className={styles.entry_side_container}>
          <div className={styles.read_button_container}>
            <Button onClick={() => setDialogData(new DialogData('Назначение ролей', true, { roles: ue.data.roles }))}>
              Назначить роли
            </Button>
          </div>
          <div className={styles.arrow_container}>
            <ArrowDown
              onClick={() => _expandEntryClick(ue)}
              className={ue.expanded ? styles.arrow : appendClassName(styles.arrow, styles.arrow_up)}
            />
          </div>
        </div>
      </div>
    );
  }

  function _expandEntryClick(userEntry: UserEntry) {
    setUserEntries(userEntries.map(ue => {
      if (ue.data.id === userEntry.data.id) {
        ue.expanded = !ue.expanded;
      }
      return ue;
    }));
  }

  const _onSearch = () => {
    console.log('searching')
  }

  const _closeDialog = () => {
    setDialogData(new DialogData());
  }

  const _Dialog = () => {
    let component = <></>
    component = <AssignDialogContent
      onDone={() => console.log("assign roles")}
      roles={_userRoles}
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
