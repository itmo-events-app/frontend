import { RoleModel } from "@entities/role";
import Button from "@widgets/main/Button";
import Input from "@widgets/main/Input";
import InputLabel from "@widgets/main/InputLabel";
import TextArea from "@widgets/main/TextArea";
import DatePicker from "react-datepicker";
import styles from './index.module.css';
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ApiContext from '@features/api-context.ts';


type UpdateProps = {
  role: RoleModel,
  onDone: (prev: RoleModel, cur: RoleModel) => void
}

const AddOrganizerDialog = ({props: UpdateProps,eventId, onSubmit}) => {
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState("");
  const [loaded,setLoaded] = useState(false);
  const {api} = useContext(ApiContext);

  const initDialog = async () => {
    const getUsersResponse = await api.profile.getAllUsers();
    if (getUsersResponse.status == 200) {
      setUserList(getUsersResponse.data);
    } else {
      console.log(getUsersResponse.status);
    }
  }
  useEffect( ()=> {
      initDialog();
      setLoaded(true);
    }
    , []);

  const handleAddOrganizer = async () =>{
    const result = await api.role.assignOrganizerRole(
      parseInt(userId),
      eventId
    );
    if(result.status!=204){
      console.log(result.status);
    }else{
      onSubmit();
    }
  }
  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_item}>
        <InputLabel value="Пользователь"/>
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          {
            loaded?(
              userList.map(u=>{
                return <option value={u.id}>{u.name}</option>
              })
            ):( <option value=""></option>)
          }
        </select>
      </div>
      <Button onClick={handleAddOrganizer}>Добавить</Button>
    </div>
  );
}

export default AddOrganizerDialog;
