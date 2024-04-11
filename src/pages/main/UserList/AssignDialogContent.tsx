import {useContext, useEffect, useState} from "react";

import styles from './index.module.css'

import Button from "@widgets/main/Button";
import InputCheckboxList, {
  createItemSelectionList,
  ItemSelection,
} from "@widgets/main/InputCheckboxList";
import RoleList, {createRoleElementList, RoleElement} from "@widgets/main/RoleList";
import {toRoleModel} from "@entities/role";
import ApiContext from "@features/api-context";
import {UserModel} from "@entities/user";
import RoleListRadio, {
  createRoleRadioElementList,
  getSelectedRoleId,
  RoleRadioElement
} from "@widgets/main/RoleListRadio";

type AssignProps = {
  userId: number,
  onDone: (userId: number, roleId: number | null) => void
}

const AssignDialogContent = (props: AssignProps) => {
  const { api } = useContext(ApiContext);
  const [roleId, setRoleId] = useState(null);
  const [roles, setRoles] = useState([] as RoleRadioElement[]);

  // const _onRoleChange = (e: ItemSelection<UserRole[]>) => {
  //   e.selected = !e.selected;
  //   setRoles([...roles]);
  // }

  const _onDoneWrapper = () => {
    props.onDone(props.userId, getSelectedRoleId(roles))
  }


  // load roles on page open
  useEffect(() => {
    //todo fetch only system roles
    api.withReauth(() => api.role.getAllRoles())
      .then(r => {
        const l = createRoleRadioElementList(r.data.map(role => toRoleModel(role)))
        setRoles(l);
      })
  }, [])


  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          {/*<InputLabel value="" />*/}
          <RoleListRadio roles={roles} setRoles={setRoles}  />
        </div>
      </div>
      <Button onClick={_onDoneWrapper}>Назначить роль</Button>
    </div>
  );
}

export default AssignDialogContent;
