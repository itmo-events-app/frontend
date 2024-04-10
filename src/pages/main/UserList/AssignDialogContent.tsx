import {useEffect, useState} from "react";

import styles from './index.module.css'

import Button from "@widgets/main/Button";
import { UserRole } from "@pages/main/UserList/index";
import InputCheckboxList, {
  createItemSelectionList,
  ItemSelection,
} from "@widgets/main/InputCheckboxList";

// privileges are ignored
type CreateProps = {
  onDone: (userRole: UserRole) => void
}

const AssignDialogContent = (props: CreateProps) => {
  const [roles, setRoles] = useState(createItemSelectionList([] as UserRole[]));

  const _onRoleChange = (e: ItemSelection<UserRole[]>) => {
    e.selected = !e.selected;
    setRoles([...roles]);
  }

  const _onDoneWrapper = () => {
    console.log("save user roles")
  }

  const exampleRoles: UserRole[] = [
    new UserRole("ADMIN", "администратор"),
    new UserRole("READER", "читатель"),
    new UserRole("REDACTOR", "редактор"),
    new UserRole("ADMIN", "администратор"),
    new UserRole("READER", "читатель"),
    new UserRole("REDACTOR", "редактор"),
    new UserRole("ADMIN", "администратор"),
    new UserRole("READER", "читатель"),
    new UserRole("REDACTOR", "редактор")
  ]

  useEffect(() => {
    setRoles(createItemSelectionList(exampleRoles))
  })

  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          {/*<InputLabel value="" />*/}
          <InputCheckboxList
            items={roles}
            toText={userRoleToText}
            onChange={_onRoleChange}
          />
        </div>
      </div>
      <Button onClick={_onDoneWrapper}>Сохранить изменения</Button>
    </div>
  );
}

function userRoleToText(item: UserRole){
  return item.name + " - " + item.description;
}

export default AssignDialogContent;
