import { PrivilegeModel, toPrivilegeModel } from "@entities/privilege";
import { api } from "@shared/api";
import { useEffect, useState } from "react";

import styles from './index.module.css'

import InputLabel from "@widgets/main/InputLabel";
import TextArea from "@widgets/main/TextArea";
import Input from "@widgets/main/Input";
import Dropdown from "@widgets/main/Dropdown";
import InputCheckboxList from "@widgets/main/InputCheckboxList";
import Button from "@widgets/main/Button";
import { displayPrivilege, dropdownOptionToText, dropdownOptions } from "./common";
import { RoleModel, RoleModelType } from "@entities/role";

type CreateProps = {
  privileges: PrivilegeModel[]
  setPrivileges: React.Dispatch<React.SetStateAction<PrivilegeModel[]>>,
  onDone: (role: RoleModel) => void
}

const CreateDialogContent = (props: CreateProps) => {

  const [name, setName] = useState("")
  const [description, setDescription] = useState("");
  const [type, setType] = useState(RoleModelType.SYSTEM);
  const [privileges, setPrivileges] = useState([]);


  const _onDoneWrapper = () => {
    const role = new RoleModel(
      0,
      name,
      type,
      privileges,
      description,
    )
    props.onDone(role);
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
          <InputCheckboxList items={privileges!} displayName={displayPrivilege} />
        </div>
      </div>
      <Button onClick={_onDoneWrapper}>Создать</Button>
    </div>
  );
}

export default CreateDialogContent;
