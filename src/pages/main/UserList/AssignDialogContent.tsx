import { useState } from "react";

import styles from './index.module.css'

import InputLabel from "@widgets/main/InputLabel";
import Button from "@widgets/main/Button";
import { UserRole } from "@pages/main/UserList/index";
import InputCheckboxList, {
  createItemSelectionList,
  ItemSelection,
  itemSelectionGetSelected
} from "@widgets/main/InputCheckboxList";
import {privilegeToText} from "@pages/main/RoleList/common";

// privileges are ignored
type CreateProps = {
  onDone: (userRole: UserRole) => void
}

const AssignDialogContent = (props: CreateProps) => {
  const [roles, setRoles] = useState(createItemSelectionList([] as UserRole[]));

  const _onRoleChange = (e: ItemSelection<UserRole>) => {
    e.selected = !e.selected;
    setRoles([...roles]);
  }

  const _onDoneWrapper = () => {
    console.log("save user roles")
  }

  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          <InputLabel value="Список Ролей" />
          <InputCheckboxList
            items={roles}
            toText={privilegeToText}
            onChange={_onRoleChange}
          />
        </div>
      </div>
      <Button onClick={_onDoneWrapper}>Сохранить изменения</Button>
    </div>
  );
}

export default AssignDialogContent;
