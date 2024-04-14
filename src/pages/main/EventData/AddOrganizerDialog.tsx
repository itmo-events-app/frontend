import Button from '@widgets/main/Button';
import InputLabel from '@widgets/main/InputLabel';
import styles from './index.module.css';
import { useContext, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ApiContext from '@features/api-context.ts';
import { RoleResponse, UserSystemRoleResponse } from '@shared/api/generated';

const AddOrganizerDialog = ({ eventId, onSubmit }: { eventId: number; onSubmit: () => void }) => {
  const [userList, setUserList] = useState([] as UserSystemRoleResponse[]);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [roleList, setRoleList] = useState([] as RoleResponse[]);
  const [roleId, setRoleId] = useState<number | undefined>(undefined);
  const [roleName, setRoleName] = useState<string | undefined>('');
  const [loaded, setLoaded] = useState(false);
  const { api } = useContext(ApiContext);

  const initDialog = async () => {
    const getUsersResponse = await api.profile.getAllUsers();
    const getAllRoles = await api.role.getAllRoles();
    if (getUsersResponse.status == 200 && getAllRoles.status == 200) {
      setUserList(getUsersResponse.data);
      setUserId(getUsersResponse.data[0].id);
      const eventRoles = getAllRoles.data.filter((r) => r.type == 'EVENT');
      setRoleList(eventRoles);
      setRoleId(eventRoles[0].id);
      setRoleName(eventRoles[0].name);
    } else {
      console.log(getUsersResponse.status);
    }
  };
  useEffect(() => {
    initDialog();
    setLoaded(true);
  }, []);

  const handleAddOrganizer = async () => {
    console.log(roleName);
    console.log(userId);
    if (roleName == 'Организатор') {
      const result = await api.role.assignOrganizerRole(userId!, eventId);
      if (result.status != 204) {
        console.log(result.status);
      } else {
        onSubmit();
      }
    } else if (roleName == 'Помощник') {
      const result = await api.role.assignAssistantRole(userId!, eventId);
      if (result.status != 204) {
        console.log(result.status);
      } else {
        onSubmit();
      }
    }
  };
  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_item}>
        <InputLabel value="Пользователь" />
        <select value={userId} onChange={(e) => setUserId(parseInt(e.target.value))}>
          {loaded ? (
            userList.map((u) => {
              return <option value={u.id}>{u.name}</option>;
            })
          ) : (
            <option value=""></option>
          )}
        </select>
        <InputLabel value="Роль" />
        <select
          value={roleId}
          onChange={(e) => {
            const roleIdString = e.target.value;
            console.log(roleIdString);
            setRoleId(parseInt(roleIdString));
            const foundRole = roleList.find((r) => r.id == parseInt(roleIdString));
            if (foundRole != undefined) {
              setRoleName(foundRole.name);
            }
          }}
        >
          {loaded ? (
            roleList.map((r) => {
              return <option value={r.id}>{r.name}</option>;
            })
          ) : (
            <option value=""></option>
          )}
        </select>
      </div>
      <Button onClick={handleAddOrganizer}>Добавить</Button>
    </div>
  );
};

export default AddOrganizerDialog;
