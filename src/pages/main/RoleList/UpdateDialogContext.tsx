import { PrivilegeModel } from "@entities/privilege";
import { RoleModel } from "@entities/role";
import Button from "@widgets/main/Button";
import Dropdown from "@widgets/main/Dropdown";
import Input from "@widgets/main/Input";
import InputCheckboxList from "@widgets/main/InputCheckboxList";
import InputLabel from "@widgets/main/InputLabel";
import TextArea from "@widgets/main/TextArea";

import styles from './index.module.css'
import { displayPrivilege, dropdownOptions } from "./common";

type UpdateProps = {
  privileges: PrivilegeModel[]
  setPrivileges: React.Dispatch<React.SetStateAction<PrivilegeModel[]>>,
  role: RoleModel,
  onDone: any
}

const UpdateDialogContent = (props: UpdateProps) => {
  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          <InputLabel value="Название роли" />
          <Input value={props.role.name} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Описание" />
          <TextArea value={props.role.description} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Тип роли" />
          <Dropdown items={dropdownOptions} value={props.role.type} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Список привилегий" />
          <InputCheckboxList items={props.privileges ?? []} displayName={displayPrivilege} />
        </div>
      </div>
      <Button onClick={props.onDone}>Изменить</Button>
    </div>
  );
}

export default UpdateDialogContent;
