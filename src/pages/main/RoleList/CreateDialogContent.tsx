import { PrivilegeModel, toPrivilegeModel } from "@entities/privilege";
import { api } from "@shared/api";
import { useEffect } from "react";

import styles from './index.module.css'

import InputLabel from "@widgets/main/InputLabel";
import TextArea from "@widgets/main/TextArea";
import Input from "@widgets/main/Input";
import Dropdown from "@widgets/main/Dropdown";
import InputCheckboxList from "@widgets/main/InputCheckboxList";
import Button from "@widgets/main/Button";
import { displayPrivilege, dropdownOptions } from "./common";

type CreateProps = {
  privileges: PrivilegeModel[]
  setPrivileges: React.Dispatch<React.SetStateAction<PrivilegeModel[]>>,
  onDone: any
}

const CreateDialogContent = (props: CreateProps) => {
  useEffect(() => {
    if (props.privileges === undefined) {
      api.withReauth(() => api.role.getAllPrivileges())
        .then(r => {
          const list = r.data.map(p => toPrivilegeModel(p));
          props.setPrivileges(list);
        })
    }
  }, []);

  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          <InputLabel value="Название роли" />
          <Input value="РОЛЬ" />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Описание" />
          <TextArea />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Тип роли" />
          <Dropdown items={dropdownOptions} value={dropdownOptions[0].text} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Список привилегий" />
          <InputCheckboxList items={props.privileges ?? []} displayName={displayPrivilege} />
        </div>
      </div>
      <Button onClick={props.onDone}>Создать</Button>
    </div>
  );
}

export default CreateDialogContent;
