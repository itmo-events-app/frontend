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
  roleName: string;

  constructor(name: string, surname: string, email: string, roleName: string) {
    this.id = uid();
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.roleName = roleName;
  }
}

const _userRoles: UserRole[] = [
  new UserRole("ADMIN", "администратор"),
  new UserRole("READER", "читатель"),
  new UserRole("REDACTOR", "редактор"),
]

const _users: User[] = [
  new User("Иван", "Иванов", "ivan@itmo.ru", "читатель"),
  new User("Сергей", "Сергеев", "sergey@itmo.ru", "читатель"),
  new User("Илья", "Ильин", "ilya@itmo.ru", "читатель"),
  new User("Иван", "Иванов", "ivan@itmo.ru", "читатель"),
  new User("Сергей", "Сергеев", "sergey@itmo.ru", "читатель"),
  new User("Илья", "Ильин", "ilya@itmo.ru", "читатель"),
  new User("Иван", "Иванов", "ivan@itmo.ru", "читатель"),
  new User("Иван", "Иванов", "ivan@itmo.ru", "читатель"),
  new User("Сергей", "Сергеев", "sergey@itmo.ru", "читатель"),
  new User("Илья", "Ильин", "ilya@itmo.ru", "читатель"),
  new User("Иван", "Иванов", "ivan@itmo.ru", "читатель"),
  new User("Сергей", "Сергеев", "sergey@itmo.ru", "читатель"),
  new User("Илья", "Ильин", "ilya@itmo.ru", "читатель"),
  new User("Иван", "Иванов", "ivan@itmo.ru", "читатель"),
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
      <div key={uid()} className={styles.user}>
        <div className={styles.user_entry}>
          <div className={styles.user_left}>
            <div className={styles.user_heading}>
              <div className={styles.user_name}>
                {ue.data.name} {ue.data.surname}
              </div>
              <div className={styles.user_role}>
                {ue.data.roleName}
              </div>
            </div>
            <div className={styles.user_email}>
              {ue.data.email}
            </div>
          </div>
          <div className={styles.user_right}>
            {/*{Menu}*/}
            {/*{Arrow}*/}
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
