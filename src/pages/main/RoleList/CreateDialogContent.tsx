import { PrivilegeModel, toPrivilegeModel } from '@entities/privilege';
import { useContext, useEffect, useState } from 'react';

import styles from './index.module.css';

import InputLabel from '@widgets/main/InputLabel';
import TextArea from '@widgets/main/TextArea';
import Input from '@widgets/main/Input';
import Dropdown from '@widgets/main/Dropdown';
import InputCheckboxList, { ItemSelection } from '@widgets/main/InputCheckboxList';
import Button from '@widgets/main/Button';
import { privilegeToText, dropdownOptionToText, dropdownOptions } from './common';
import { RoleModel, RoleModelType, fromRoleModel, fromRoleModelType, toRoleModel } from '@entities/role';
import ApiContext from '@features/api-context';
import { createItemSelectionList, itemSelectionGetSelected } from '@widgets/main/InputCheckboxList/common';

// privileges are ignored
type CreateProps = {
  callback: (role: RoleModel) => void;
};

const CreateDialogContent = (props: CreateProps) => {
  const { api } = useContext(ApiContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState(RoleModelType.SYSTEM);
  const [privileges, setPrivileges] = useState(createItemSelectionList([] as PrivilegeModel[]));

  const [prevType, setPrevType] = useState(RoleModelType.EVENT);

  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const [errorMessageCreatingRole, setErrorMessageCreatingRole] = useState('');

  // NOTE: maybe cache privilege list results?
  useEffect(() => {
    if (prevType == type) {
      return;
    }

    const queryType = fromRoleModelType(type);

    if (type == RoleModelType.SYSTEM) {
      api
        .withReauth(() => api.role.getAllPrivileges(queryType))
        .then((r) => {
          const privs = r.data.map((p) => toPrivilegeModel(p));
          setPrivileges(createItemSelectionList(privs));
        });
    }

    if (type == RoleModelType.EVENT) {
      api
        .withReauth(() => api.role.getAllPrivileges(queryType))
        .then((r) => {
          const privs = r.data.map((p) => toPrivilegeModel(p));
          setPrivileges(createItemSelectionList(privs));
        });
    }

    setPrevType(type);
  }, [type]);

  const _onPrivilegeChange = (e: ItemSelection<PrivilegeModel>) => {
    e.selected = !e.selected;
    setPrivileges([...privileges]);
  };

  const _onDoneWrapper = () => {
    let ok = true;

    const role = new RoleModel(0, name, type, itemSelectionGetSelected(privileges), description);

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
        .withReauth(() => api.role.createRole(request))
        .then((res) => {
          const role = toRoleModel(res.data);
          props.callback(role);
        })
        .catch((error: any) => {
          const errorMessage = error.response.data;
          console.log(error.response.data);
          setErrorMessageCreatingRole(errorMessage);
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
        {errorMessageCreatingRole && <div className={styles.error}>{errorMessageCreatingRole}</div>}
        <div className={styles.dialog_item}>
          <InputLabel value="Описание" />
          <TextArea value={description} onChange={_descriptionOnChange} errorText={descriptionError} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Тип роли" />
          <Dropdown items={dropdownOptions} toText={dropdownOptionToText} value={type} onChange={(e) => setType(e)} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Список привилегий" />
          <InputCheckboxList items={privileges} toText={privilegeToText} onChange={_onPrivilegeChange} />
        </div>
      </div>
      <Button onClick={_onDoneWrapper}>Создать</Button>
    </div>
  );
};

export default CreateDialogContent;
