import {useContext, useEffect, useState} from 'react';


import styles from './index.module.css'
import Button from "@widgets/main/Button";
import ApiContext from "@features/api-context";
import RoleListRadio, {RoleRadioElement} from "@widgets/main/RoleListRadio";
import {createRoleRadioElementList, getSelectedRoleId} from "@widgets/main/RoleListRadio/common";
import {PrivilegeNames} from "@shared/config/privileges";
import {EventResponse} from "@shared/api/generated/model";
import Dropdown, {DropdownOption} from "@widgets/main/Dropdown";
import {toRoleModel} from "@entities/role";


type AssignProps = {
  userId: number;
  buttonText: string;
  isEvent: boolean;
  isRevoke: boolean;
  onDone: (userId: number, roleId: number | null, eventId: number | null) => void;
};

const DialogContent = (props: AssignProps) => {
  const {api} = useContext(ApiContext);
  const [roles, setRoles] = useState([] as RoleRadioElement[]);
  const [eventId, setEventId] = useState(0)
  const [dropdownValues, setDropdownValues] = useState<DropdownOption<string>[]>([]);
  const [dropdownValue, setDropdownValue] = useState<DropdownOption<string> | undefined>();
  const [showEmptyEventMessage, setShowEmptyEventMessage] = useState(false);

  const _onDoneWrapper = () => {
    if (props.isEvent && eventId < 1) {
      setShowEmptyEventMessage(true);
    } else {
      props.onDone(props.userId, getSelectedRoleId(roles), eventId);
    }
  };

  // load roles on dialog open
  useEffect(() => {
    if (props.isRevoke){
      if (!props.isEvent) {
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

  //load organizational roles on selected event change
  useEffect(() => {
    if (props.isRevoke && props.isEvent) {
      _fetchUserOrganizationalRoles();
    }
  }, [eventId]);

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
    setEventId( -1);
  }

  function _fetchSystemRoles() {
    api
      .withReauth(() => api.role.getSystemRoles())
      .then((r) => {
        const l = createRoleRadioElementList(r.data.map((role) => toRoleModel(role)));
        setRoles(l)
      });
    setEventId( -1);
  }

  function _fetchOrganizationalRoles() {
    api
      .withReauth(() => api.role.getOrganizationalRoles())
      .then((r) => {
        const l = createRoleRadioElementList(r.data.map((role) => toRoleModel(role)));
        setRoles(l);
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
          const eventList = eventsResponse.data.map((e: EventResponse) => ({
            id: String(e.id),
            value: e.title,
          })) as DropdownOption<string>[];
          setDropdownValues(eventList)
          setEventId( 0);
        })
    }
  }, []);

  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          {showEmptyEventMessage && (
            <span className={styles.emptyFieldsMessage}>Выберите мероприятие для назначения роли</span>
          )}
          {props.isEvent ? (
            <Dropdown
              placeholder={"Мероприятие"}
              items={dropdownValues}
              toText={(item) => item.value}
              value={dropdownValue}
              onChange={(sel) => {
                setEventId(Number(sel.id))
                setDropdownValue(sel)
              }}
            />
          ) : (
            <div></div>
          )}
        </div>
        <div className={styles.dialog_item}>
          <RoleListRadio roles={roles} setRoles={setRoles} />
        </div>
      </div>
      <Button onClick={_onDoneWrapper}>{props.buttonText}</Button>
    </div>
  );
};

export default DialogContent;
