import { PrivilegeModel, toPrivilegeModel } from "@entities/privilege";
import { useContext, useEffect, useState } from "react";

import styles from './index.module.css'

import InputLabel from "@widgets/main/InputLabel";
import TextArea from "@widgets/main/TextArea";
import Input from "@widgets/main/Input";
import Dropdown from "@widgets/main/Dropdown";
import InputCheckboxList, { ItemSelection, createItemSelectionList, itemSelectionGetSelected } from "@widgets/main/InputCheckboxList";
import Button from "@widgets/main/Button";
import { privilegeToText, dropdownOptionToText, dropdownOptions } from "./common";
import { RoleModel, RoleModelType, fromRoleModelType } from "@entities/role";
import ApiContext from "@features/api-context";

// privileges are ignored
type CreateProps = {
  onDone: (role: RoleModel) => void
}

const CreateDialogContent = (props: CreateProps) => {
  const { api } = useContext(ApiContext);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("");
  const [type, setType] = useState(RoleModelType.SYSTEM);
  const [privileges, setPrivileges] = useState(createItemSelectionList([] as PrivilegeModel[]));

  const [prevType, setPrevType] = useState(RoleModelType.EVENT);

  // NOTE: maybe cache privilege list results?
  useEffect(() => {
    if (prevType == type) {
      return;
    }

    const queryType = fromRoleModelType(type);

    if (type == RoleModelType.SYSTEM) {
      api.withReauth(() => api.role.getAllPrivileges(queryType))
        .then((r) => {
          const privs = r.data.map(p => toPrivilegeModel(p));
          setPrivileges(createItemSelectionList(privs));
        })
    }

    if (type == RoleModelType.EVENT) {
      api.withReauth(() => api.role.getAllPrivileges(queryType))
        .then((r) => {
          const privs = r.data.map(p => toPrivilegeModel(p));
          setPrivileges(createItemSelectionList(privs));
        })
    }

    setPrevType(type);
  }, [type]);

  const _onDoneWrapper = () => {
    const role = new RoleModel(
      0,
      name,
      type,
      itemSelectionGetSelected(privileges),
      description,
    )
    props.onDone(role);
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

export default CreateDialogContent;
