import { PrivilegeModel, toPrivilegeModel } from '@entities/privilege';
import { RoleModel, RoleModelType, fromRoleModel, fromRoleModelType, toRoleModel } from '@entities/role';
import Button from '@widgets/main/Button';
import Dropdown from '@widgets/main/Dropdown';
import Input from '@widgets/main/Input';
import InputCheckboxList, { ItemSelection } from '@widgets/main/InputCheckboxList';
import InputLabel from '@widgets/main/InputLabel';
import TextArea from '@widgets/main/TextArea';

import styles from './index.module.css';
import { privilegeToText, dropdownOptionToText, dropdownOptions } from './common';
import { useContext, useEffect, useState } from 'react';
import ApiContext from '@features/api-context';
import { createItemSelectionList, itemSelectionGetSelected } from '@widgets/main/InputCheckboxList/common';

type UpdateProps = {
  privileges: PrivilegeModel[];
  setPrivileges: React.Dispatch<React.SetStateAction<PrivilegeModel[]>>;
  role: RoleModel;
  callback: (prev: RoleModel, cur: RoleModel) => void;
};

const UpdateDialogContent = (props: UpdateProps) => {
  const { api } = useContext(ApiContext);
  const [name, setName] = useState(props.role.name ?? '');
  const [description, setDescription] = useState(props.role.description ?? '');
  const [type, _] = useState(props.role.type ?? RoleModelType.SYSTEM);
  const [privileges, setPrivileges] = useState(createItemSelectionList(props.role.privileges ?? []));

  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  // NOTE: maybe cache privilege list results?
  useEffect(() => {
    const queryType = fromRoleModelType(type);

    if (type == RoleModelType.SYSTEM) {
      api
        .withReauth(() => api.role.getAllPrivileges(queryType))
        .then((r) => {
          const privs = r.data.map((p) => toPrivilegeModel(p));
          setPrivileges(createItemSelectionList(privs, _isItemSelected));
        });
    }

    if (type == RoleModelType.EVENT) {
      api
        .withReauth(() => api.role.getAllPrivileges(queryType))
        .then((r) => {
          const privs = r.data.map((p) => toPrivilegeModel(p));
          setPrivileges(createItemSelectionList(privs, _isItemSelected));
        });
    }
  }, [type]);

  // select privileges that were on previous role
  const _isItemSelected = (item: PrivilegeModel) => {
    if (props.role.privileges) {
      return props.role.privileges.find((k) => k.id == item.id) !== undefined;
    }
    return false;
  };

  const _onPrivilegeChange = (e: ItemSelection<PrivilegeModel>) => {
    e.selected = !e.selected;
    setPrivileges([...privileges]);
  };

  const _onDoneWrapper = () => {
    let ok = true;

    const role = new RoleModel(props.role.id, name, type, itemSelectionGetSelected(privileges), description);

    if (role.name == '') {
      setNameError('Имя роли не должно быть пустым');
      ok = false;
    }

    if (role.description == '') {
      setDescriptionError('Описание не должно быть пустым');
      ok = false;
    }

    if (ok) {
      const request = fromRoleModel(role);
      api
        .withReauth(() => api.role.editRole(role.id, request))
        .then((res) => {
          const role = toRoleModel(res.data);
          props.callback(props.role, role);
        });
    }
  };

  const _nameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError('');
  };

  const _descriptionOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setDescriptionError('');
  };

  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          <InputLabel value="Название роли" />
          <Input value={name} onChange={_nameOnChange} errorText={nameError} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Описание" />
          <TextArea value={description} onChange={_descriptionOnChange} errorText={descriptionError} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Тип роли" />
          <Dropdown items={dropdownOptions} toText={dropdownOptionToText} value={type} readonly />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Список привилегий" />
          <InputCheckboxList items={privileges} toText={privilegeToText} onChange={_onPrivilegeChange} />
        </div>
      </div>
      <Button onClick={_onDoneWrapper}>Изменить</Button>
    </div>
  );
};

export default UpdateDialogContent;
