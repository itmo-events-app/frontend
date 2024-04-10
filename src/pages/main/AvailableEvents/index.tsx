import { ReactLogo } from '@shared/ui/icons';
import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar from '@widgets/main/SideBar';
import Search from "@widgets/main/Search";
import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";
import Button from "@widgets/main/Button";
import PagedList, { PageEntry } from "@widgets/main/PagedList";
import { RoutePaths } from '@shared/config/routes';
import Input from "@widgets/main/Input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

enum DisplayModes {
  LIST = "Показать списком",
  MAP = "Показать на карте",
}

enum EventStatusList {
  DRAFT = "Черновик",
  ACTIVE = "Активное",
  FINISHED = "Проведенное",
  CANCELLED = "Отмененное"
}

enum EventFormatList {
  OFFLINE = "Очный",
  ONLINE = "Онлайн",
  COMBINED = "Смешанный"
}

enum EventAgeList {
  FIRST = "12+",
  SECOND = "16+",
  THIRD = "18+"
}

const displayModes = Object.values(DisplayModes);
const eventStatusList = Object.values(EventStatusList);
const eventFormatList = Object.values(EventFormatList);
const eventAgeList = Object.values(EventAgeList);

function AvailableEventsPage() {

  const _onSearch = () => {
    console.log('searching')
  }

  const _onCreation = () => {
    console.log('creating')
  }
  const navigate = useNavigate();
  const _event = () => {
    navigate(RoutePaths.eventData);
  }
  const _events: any[] = [
    new PageEntry(() => { return _entryStub(1) }),
    new PageEntry(() => { return _entryStub(2) }),
    new PageEntry(() => { return _entryStub(3) }),
    new PageEntry(() => { return _entryStub(4) }),
    new PageEntry(() => { return _entryStub(5) }),
    new PageEntry(() => { return _entryStub(6) }),
    new PageEntry(() => { return _entryStub(7) }),
    new PageEntry(() => { return _entryStub(8) }),
    new PageEntry(() => { return _entryStub(9) }),
    new PageEntry(() => { return _entryStub(10) }),
    new PageEntry(() => { return _entryStub(11) }),
    new PageEntry(() => { return _entryStub(12) }),
    new PageEntry(() => { return _entryStub(13) }),
    new PageEntry(() => { return _entryStub(14) }),
    new PageEntry(() => { return _entryStub(15) }),
    new PageEntry(() => { return _entryStub(16) }),
    new PageEntry(() => { return _entryStub(17) }),
    new PageEntry(() => { return _entryStub(18) }),
    new PageEntry(() => { return _entryStub(19) }),
    new PageEntry(() => { return _entryStub(20) }),
    new PageEntry(() => { return _entryStub(21) }),
    new PageEntry(() => { return _entryStub(22) }),
    new PageEntry(() => { return _entryStub(23) }),
    new PageEntry(() => { return _entryStub(24) }),
    new PageEntry(() => { return _entryStub(25) }),
    new PageEntry(() => { return _entryStub(26) }),
    new PageEntry(() => { return _entryStub(27) }),
    new PageEntry(() => { return _entryStub(28) }),
    new PageEntry(() => { return _entryStub(29) }),
    new PageEntry(() => { return _entryStub(30) }),
    new PageEntry(() => { return _entryStub(31) }),
    new PageEntry(() => { return _entryStub(32) }),
    new PageEntry(() => { return _entryStub(33) })
  ]

  function _entryStub(index: number) {
    return (
      <a key={index} onClick={_event} className={styles.event_entry}>
        <ReactLogo className={styles.event_icon} />
        <div className={styles.event_info_column}>
          <div className={styles.event_name}>
            {"Event " + index}
          </div>
          <div className={styles.event_place}>
            Place
          </div>
        </div>
      </a>
    );
  }

  const [displayMode, setDisplayMode] = useState(DisplayModes.LIST);
  const [eventStatus, setEventStatus] = useState("");
  const [eventFormat, setEventFormat] = useState("");
  const [eventAge, setEventAge] = useState("");

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Доступные мероприятия" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.eventList} />}
      bottomRight=
      {
        <Content>
          <div className={styles.events_page}>
            <div className={styles.horizontal_bar}>
              <div className={styles.search}>
                <Search onSearch={_onSearch} placeholder="Поиск" />
              </div>
              <div className={styles.dropdown}>
                <Dropdown
                  placeholder="Режим отображения"
                  items={displayModes}
                  value={displayMode}
                  onChange={(mode) => {setDisplayMode(mode)}}
                  toText={(input: string) => {return input}} />
              </div>
              <div className={styles.button}>
                <Button onClick={_onCreation}>Создать</Button>
              </div>
            </div>
            <div className={styles.filters}>
              <div className={styles.filter_group}>
                <Input value="" onChange={() => {}} className={styles.filter_element} placeholder="Начало регистрации" />
                <Input value="" onChange={() => {}} className={styles.filter_element} placeholder="Конец регистрации" />
                <Input value="" onChange={() => {}} className={styles.filter_element} placeholder="Начало проведения" />
                <Input value="" onChange={() => {}} className={styles.filter_element} placeholder="Конец проведения" />
              </div>
              <div className={styles.filter_group}>
                <div className={styles.dropdown}>
                  <Dropdown
                    placeholder="Статус"
                    items={eventStatusList}
                    value={eventStatus}
                    onChange={(status) => {setEventStatus(status)}}
                    onClear={() => {setEventStatus("")}}
                    toText={(input: string) => {return input}} />
                </div>
                <div className={styles.dropdown}>
                  <Dropdown
                    placeholder="Формат"
                    items={eventFormatList}
                    value={eventFormat}
                    onChange={(format) => {setEventFormat(format)}}
                    onClear={() => {setEventFormat("")}}
                    toText={(input: string) => {return input}} />
                </div>
                <div className={styles.dropdown}>
                  <Dropdown
                    placeholder="Возрастное ограничение"
                    items={eventAgeList}
                    value={eventAge}
                    onChange={(age) => {setEventAge(age)}}
                    onClear={() => {setEventAge("")}}
                    toText={(input: string) => {return input}} />
                </div>
              </div>
            </div>
            <div className={styles.event_list_container}>
              <PagedList page={1} page_size={5} page_step={5} items={_events} />
            </div>
          </div>
        </Content>
      }
    />
  );
}

export default AvailableEventsPage;
