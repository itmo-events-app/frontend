import Button from "@widgets/main/Button";
import InputLabel from "@widgets/main/InputLabel";
import styles from './index.module.css';
import { useContext, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ApiContext from '@features/api-context.ts';
import { RoleResponse, UserResponse } from '@shared/api/generated';

const EditOrganizerDialog = ({ eventId, onEdit }: { eventId: number; onEdit: () => void }) => {
  const [userList, setUserList] = useState([] as UserResponse[]);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [roleList, setRoleList] = useState([] as RoleResponse[]);
  const [roleId, setRoleId] = useState<number | undefined>(undefined);
  const [roleName, setRoleName] = useState<string | undefined>('');
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { api } = useContext(ApiContext);

  const initDialog = async () => {
    const getUsersResponse = await api.profile.getAllUsers();
    const getAllRoles = await api.role.getOrganizationalRoles();
    if (getUsersResponse.status == 200 && getAllRoles.status == 200) {
      const items = getUsersResponse.data.items;
      setUserList(items?? []);
      if (items!= null && items.length > 0) {
        setUserId(items[0].id)
      } else {
        setUserId(undefined);
      }
      const eventRoles = getAllRoles.data.filter(r => r.type == "EVENT");
      setRoleList(eventRoles);
      setRoleId(eventRoles[0].id);
      setRoleName(eventRoles[0].name);
    } else {
      console.log(getUsersResponse.status);
    }
  };
  const getCurrentUserId = async () => {
    const userInfoResponse = await api.profile.getUserInfo();
    if (userInfoResponse.status == 200) {
      const userInfo = userInfoResponse.data;
      return userInfo.userId;
    } else {
      console.log(userInfoResponse.status);
      return null;
    }
  };

  const handleEditOrganizer = async () => {
    console.log(roleName);
    console.log(userId);
    if (userId && eventId) {
      const userEventRoles = await api.role.getUserEventRoles(userId!, eventId);
      if (userEventRoles.status == 200) {
        const hasRole = userEventRoles.data.some(r => r.name == roleName);
        if (hasRole) {
          setErrorMessage("У этого пользователя уже есть эта роль!");
          return;
        }else{
          setErrorMessage("У этого пользователя нет (такой) роли!");
          return;
        }
      }
    }
    const currentUserId = await getCurrentUserId();
    if (userId) {
      //const revokeRole = async () => {
      // First, revoke the current role
      if (roleName == 'Организатор') {
         await api.role.revokeAssistantRole(userId, eventId);
      }else if (userId === currentUserId  && roleName === 'Помощник') {
        setErrorMessage('Вы не можете отозвать свою собственную роль организатора!');
        return;
      }
      else{await api.role.revokeOrganizerRole(userId, eventId);}
      //const revokeResponse = await api.role.revokeOrganizationalRole(userId, eventId, roleId!);
      //  if (revokeRole.status!= 204) {
      //    console.log(revokeRole.status);
      //  } else {
        // Then, assign the new role
        if (roleName == 'Организатор') {
          const result = await api.role.assignOrganizerRole(userId, eventId);
          if (result.status!= 204) {
            console.log(result.status);
          } else {
            onEdit();
          }
        } else if (roleName == 'Помощник') {
          const result = await api.role.assignAssistantRole(userId, eventId);
          if (result.status!= 204) {
            console.log(result.status);
          } else {
            onEdit();
          }
        } else {
          const result = await api.role.assignOrganizationalRole(userId, eventId, roleId!);
          if (result.status!= 204) {
            console.log(result.status);
          } else {
            onEdit();
          }
        }
      //}
    }
  };

  useEffect(() => {
    initDialog();
    getCurrentUserId();
    setLoaded(true);
  }, []);

  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_item}>
        <InputLabel value="Пользователь" />
        <select value={userId} onChange={(e) => setUserId(parseInt(e.target.value))}>
          {loaded? (
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
            if (foundRole!= undefined) {
              setRoleName(foundRole.name);
            }
          }}
        >
          {loaded? (
            roleList.map((r) => {
              return <option key={r.id} value={r.id}>{r.name}</option>;
            })
          ) : (
            <option value=""></option>
          )}
        </select>
      </div>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <Button onClick={handleEditOrganizer}>Редактировать</Button>
    </div>
  );
};

export default EditOrganizerDialog;