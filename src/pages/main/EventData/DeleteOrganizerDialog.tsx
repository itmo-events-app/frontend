import Button from "@widgets/main/Button";
import InputLabel from "@widgets/main/InputLabel";
import styles from './index.module.css';
import { useContext, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ApiContext from '@features/api-context.ts';
import { RoleResponse, UserSystemRoleResponse } from '@shared/api/generated';

const DeleteOrganizerDialog = ({ eventId, organizerId, onSubmit }: { eventId: number; organizerId: number; onSubmit: () => void }) => {
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
      const items = getUsersResponse.data.items;
      setUserList(items ?? []);
      const organizer = items?.find(u => u.id === organizerId);
      if (organizer) {
        setUserId(organizer.id);
      } else {
        setUserId(undefined);
      }
      const eventRoles = getAllRoles.data.filter(r => r.type == "EVENT");
      setRoleList(eventRoles);
      const organizerRole = eventRoles.find(r => r.id === organizer?.roleId);
      if (organizerRole) {
        setRoleId(organizerRole.id);
        setRoleName(organizerRole.name);
      }
    } else {
      console.log(getUsersResponse.status);
    }
  };
  useEffect(() => {
    initDialog();
    setLoaded(true);
  }, []);

  const handleDeleteOrganizer = async () => {
    console.log(roleName);
    console.log(userId);
    if (roleName == 'Организатор') {
      const result = await api.role.removeOrganizerRole(userId!, eventId);
      if (result.status != 204) {
        console.log(result.status);
      } else {
        onSubmit();
      }
    } else if (roleName == 'Помощник') {
      const result = await api.role.removeAssistantRole(userId!, eventId);
      if (result.status != 204) {
        console.log(result.status);
      } else {
        onSubmit();
      }
    } else {
      const result = await api.role.removeOrganizationalRole(userId!, eventId, roleId!);
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
              return <option key={r.id} value={r.id}>{r.name}</option>;
            })
          ) : (
            <option value=""></option>
          )}
        </select>
      </div>
      <Button onClick={handleDeleteOrganizer}>Удалить</Button>
    </div>
  );
};

export default DeleteOrganizerDialog;