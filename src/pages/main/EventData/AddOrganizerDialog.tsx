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
import { AddActivityFormatEnum, AddActivityStatusEnum, GetAllOrFilteredEventsStatusEnum } from "@shared/api/generated";

type UpdateProps = {
  role: RoleModel,
  onDone: (prev: RoleModel, cur: RoleModel) => void
}

const AddOrganizerDialog = ({props: UpdateProps,parentId, onSubmit}) => {

  return (
    <div className={styles.dialog_content}>
      <Button>Добавить</Button>
    </div>
  );
}

export default AddOrganizerDialog;
