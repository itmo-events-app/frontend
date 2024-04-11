import { PrivilegeModel, toPrivilegeModel } from "@entities/privilege";
import { RoleModel, RoleModelType, fromRoleModelType } from "@entities/role";
import Button from "@widgets/main/Button";
import Dropdown from "@widgets/main/Dropdown";
import Input from "@widgets/main/Input";
import InputCheckboxList, { ItemSelection, createItemSelectionList, itemSelectionGetSelected } from "@widgets/main/InputCheckboxList";
import InputLabel from "@widgets/main/InputLabel";
import TextArea from "@widgets/main/TextArea";

import styles from './index.module.css'
import { privilegeToText, dropdownOptionToText, dropdownOptions } from "./common";
import { useContext, useEffect, useState } from "react";
import ApiContext from "@features/api-context";

type UpdateProps = {
  privileges: PrivilegeModel[]
  setPrivileges: React.Dispatch<React.SetStateAction<PrivilegeModel[]>>,
  role: RoleModel,
  onDone: (prev: RoleModel, cur: RoleModel) => void
}

const UpdateDialogContent = (props: UpdateProps) => {
  const { api } = useContext(ApiContext);
  const [name, setName] = useState(props.role.name ?? '');
  const [description, setDescription] = useState(props.role.description ?? '');
  const [type, setType] = useState(props.role.type ?? RoleModelType.SYSTEM);
  const [privileges, setPrivileges] = useState(createItemSelectionList(props.role.privileges ?? []));

  const [prevType, setPrevType] = useState<RoleModelType | undefined>(undefined);

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
          setPrivileges(createItemSelectionList(privs, _isItemSelected));
        })
    }

    if (type == RoleModelType.EVENT) {
      api.withReauth(() => api.role.getAllPrivileges(queryType))
        .then((r) => {
          const privs = r.data.map(p => toPrivilegeModel(p));
          setPrivileges(createItemSelectionList(privs, _isItemSelected));
        })
    }

    setPrevType(type);
  }, [type]);

  // select privileges that were on previous role
  const _isItemSelected = (item: PrivilegeModel) => {
    if (props.role.privileges) {
      return props.role.privileges.find(k => k.id == item.id) !== undefined;
    }
    return false;
  }

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
