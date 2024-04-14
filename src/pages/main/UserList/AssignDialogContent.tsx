import { useContext, useEffect, useState } from 'react';


import styles from './index.module.css'
import Button from "@widgets/main/Button";
import { toRoleModel } from "@entities/role";
import ApiContext from "@features/api-context";
import RoleListRadio, { RoleRadioElement } from "@widgets/main/RoleListRadio";
import { createRoleRadioElementList, getSelectedRoleId } from "@widgets/main/RoleListRadio/common";


type AssignProps = {
  userId: number;
  onDone: (userId: number, roleId: number | null) => void;
};

const AssignDialogContent = (props: AssignProps) => {
  const {api} = useContext(ApiContext);
  const [roles, setRoles] = useState([] as RoleRadioElement[]);

  const _onDoneWrapper = () => {
    props.onDone(props.userId, getSelectedRoleId(roles));
  };

  // load roles on dialog open
  useEffect(() => {
    api
      .withReauth(() => api.role.getSystemRoles())
      .then((r) => {
        const l = createRoleRadioElementList(r.data.map((role) => toRoleModel(role)));
        setRoles(l);
      });
  }, []);

  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          <RoleListRadio roles={roles} setRoles={setRoles} />
        </div>
      </div>
      {/*//todo make button disabled if none selected*/}
      <Button onClick={_onDoneWrapper}
              className={getSelectedRoleId === null ? styles.disabled_button : undefined}>Назначить роль</Button>
    </div>
  );
};

export default AssignDialogContent;
