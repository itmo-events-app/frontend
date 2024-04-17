import {useContext, useEffect, useState} from 'react';


import styles from './index.module.css'
import Button from "@widgets/main/Button";
import {RoleModelType, toRoleModel} from "@entities/role";
import ApiContext from "@features/api-context";
import RoleListRadio, {RoleRadioElement} from "@widgets/main/RoleListRadio";
import {createRoleRadioElementList, getSelectedRoleId} from "@widgets/main/RoleListRadio/common";
import InputLabel from "@widgets/main/InputLabel";
import {PrivilegeNames} from "@shared/config/privileges";


type AssignProps = {
  userId: number;
  buttonText: string;
  isEvent: boolean;
  isRevoke: boolean;
  onDone: (userId: number, roleId: number | null, eventId: number | null) => void;
};

class EventSelectElement {
  id: number;
  title: string;

  constructor(id: number, title: string) {
    this.id = id;
    this.title = title;
  }
}

const DialogContent = (props: AssignProps) => {
  const {api} = useContext(ApiContext);
  const [roles, setRoles] = useState([] as RoleRadioElement[]);
  const [events, setEvents] = useState([] as EventSelectElement[])
  const [eventId, setEventId] = useState(0)

  const _onDoneWrapper = () => {
    props.onDone(props.userId, getSelectedRoleId(roles), eventId);
  };

  // load roles on dialog open
  useEffect(() => {
    if (props.isRevoke){
      if (props.isEvent) {
        _fetchUserOrganizationalRoles()
      } else {
        _fetchUserSystemRoles()
      }
    } else {
      if (props.isEvent) {
        _fetchOrganizationalRoles()
      } else {
        _fetchSystemRoles()
      }
    }
  }, []);

  function _fetchUserOrganizationalRoles() {
    api
      .withReauth(() => api.role.getUserEventRoles(props.userId, eventId))
      .then((r) => {
        const l = createRoleRadioElementList(r.data.map((role) => toRoleModel(role)));
        setRoles(l);
      });
  }

  function _fetchUserSystemRoles() {
    api
      .withReauth(() => api.role.getUserSystemRoles(props.userId))
      .then((r) => {
        const l = createRoleRadioElementList(r.data.map((role) => toRoleModel(role)));
        setRoles(l);
      });
  }

  function _fetchSystemRoles() {
    api
      .withReauth(() => api.role.getSystemRoles())
      .then((r) => {
        const l = createRoleRadioElementList(r.data.map((role) => toRoleModel(role)));
        setRoles(l)
      });
  }

  function _fetchOrganizationalRoles() {
    api
      .withReauth(() => api.role.getAllRoles())
      .then((r) => {
        const l = createRoleRadioElementList(r.data.map((role) => toRoleModel(role)));
        setRoles(l.filter(r => r.entry.type == RoleModelType.EVENT));

      });
  }

  //load events on dialog open
  useEffect(() => {
    if (props.isEvent) {
      const privilege = props.isRevoke ? PrivilegeNames.REVOKE_ORGANIZATIONAL_ROLE : PrivilegeNames.ASSIGN_ORGANIZATIONAL_ROLE;
      api
        .withReauth(() => api.profile.getUserInfo())
        .then((userInfoResponse) => {
          return userInfoResponse.data.userId;
          //fetch current user's ID
        })
        .then((currentUserId) => {
          //fetch events with user containing certain privilege
          return api.withReauth(() => api.role.getEventsByPrivilige(privilege, Number(currentUserId)));
        })
        .then((eventsResponse) => {
          //map the events
          const eventList = eventsResponse.data.map((e: EventSelectElement) => ({
            id: e.id,
            title: e.title,
          })) as EventSelectElement[];
          setEvents(eventList);
          setEventId(eventList[0].id || 0);
        })
    } else {
      setEvents([])
    }
  }, []);

  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          {props.isEvent ? (
            <>
              <InputLabel value="Мероприятие" />
              <select value={eventId} onChange={(e) => {
                setEventId(Number(e.target.value));
                if (props.isRevoke) _fetchUserOrganizationalRoles();
              }}>
                {events.length ? (
                  events.map((e) => {
                    return <option key={e.id} value={e.id}>{e.title}</option>;
                  })
                ) : (
                  <option value="">Нет доступных мероприятий</option>
                )}
              </select>
            </>
          ) : (
            <div></div>
          )}
        </div>
        <div className={styles.dialog_item}>
          <RoleListRadio roles={roles} setRoles={setRoles} />
        </div>
      </div>
      {/*//todo make button disabled if none selected*/}
      <Button onClick={_onDoneWrapper}>{props.buttonText}</Button>
    </div>
  );
};

export default DialogContent;
