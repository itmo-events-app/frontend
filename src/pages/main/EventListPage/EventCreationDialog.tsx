import Content from "@widgets/main/Content";
import Input from "@widgets/main/Input";
import Button from "@widgets/main/Button";
import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";
import { FC, useContext, useState } from "react";

import styles from "./dialog.module.css";
import { eventService } from "@features/event-service.ts";
import ApiContext from "@features/api-context.ts";
import { useQuery } from "@tanstack/react-query";

export type EventCreationDialogProps = {
  onCreateEvent?: () => void;
};

const EventCreationDialog: FC<EventCreationDialogProps> = ({ onCreateEvent }) => {
  const { api } = useContext(ApiContext);
  const [name, setName] = useState("");
  const [user, setUser] = useState<DropdownOption<string> | undefined>();

  const _createEvent = () => {
    eventService.createTask(api, name, Number(user!.id!)).then(() => {
      onCreateEvent?.();
    });
    location.reload()
  };

  const { data: allUsers = [] } = useQuery({
    queryFn: eventService.getUsers(api),
    queryKey: ["getAllUsers"],
  });

  return (
    <Content>
      <div className={styles.event_form}>
        <div className={styles.event_form_item}>
          <Input
            type="text"
            placeholder="Введите название мероприятия"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.event_form_item}>
          <Dropdown placeholder="Выберите главного организатора" items={allUsers} toText={(e) => e.value} value={user}
                    onChange={setUser} />
        </div>
        <div className={styles.event_form_button}>
          <Button onClick={_createEvent}>Создать</Button>
        </div>
      </div>
    </Content>
  );
};

export default EventCreationDialog;
