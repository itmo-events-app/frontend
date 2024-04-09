import { PrivilegeModel } from "@entities/privilege";
import { RoleModel, RoleModelType } from "@entities/role";
import Button from "@widgets/main/Button";
import Dropdown from "@widgets/main/Dropdown";
import Input from "@widgets/main/Input";
import InputCheckboxList, { ItemSelection, createItemSelectionList, itemSelectionGetSelected } from "@widgets/main/InputCheckboxList";
import InputLabel from "@widgets/main/InputLabel";
import TextArea from "@widgets/main/TextArea";

import styles from './index.module.css'
import { privilegeToText, dropdownOptionToText, dropdownOptions } from "./common";
import { useState } from "react";

type UpdateProps = {
  privileges: PrivilegeModel[]
  setPrivileges: React.Dispatch<React.SetStateAction<PrivilegeModel[]>>,
  role: RoleModel,
  onDone: (prev: RoleModel, cur: RoleModel) => void
}

const UpdateDialogContent = (props: UpdateProps) => {

  const [name, setName] = useState(props.role.name ?? '');
  const [description, setDescription] = useState(props.role.description ?? '');
  const [type, setType] = useState(props.role.type ?? RoleModelType.SYSTEM);
  const [privileges, setPrivileges] = useState(createItemSelectionList(props.role.privileges ?? []));


  const _onDoneWrapper = () => {
    const role = new RoleModel(
      props.role.id,
      name,
      type,
      itemSelectionGetSelected(privileges),
      description,
    )
    props.onDone(props.role, role);
  }

  const _onPrivilegeChange = (e: ItemSelection<PrivilegeModel>) => {
    e.selected = !e.selected;
    setPrivileges([...privileges]);
  }

  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          <InputLabel value="Название роли" />
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Описание" />
          <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Тип роли" />
          <Dropdown items={dropdownOptions} toText={dropdownOptionToText} value={type} onChange={
            (e) => setType(e)
          }
          />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Список привилегий" />
          <InputCheckboxList
            items={privileges}
            toText={privilegeToText}
            onChange={_onPrivilegeChange}
          />
        </div>
      </div>
      <Button onClick={_onDoneWrapper}>Изменить</Button>
    </div>
  );
}

export default UpdateDialogContent;
