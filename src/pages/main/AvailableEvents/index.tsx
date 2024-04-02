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
import { AppRoutes, RoutePaths } from '@shared/config/routes';
import Input from "@widgets/main/Input";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const _displayModes: DropdownOption[] = [
  new DropdownOption("Показать списком"),
  new DropdownOption("Показать на карте")
]

const filterStatus: DropdownOption[] = [
  new DropdownOption("Активное"),
  new DropdownOption("Проведенное")
]

const filterFormat: DropdownOption[] = [
  new DropdownOption("Офлайн"),
  new DropdownOption("Онлайн")
]

const filterAge: DropdownOption[] = [
  new DropdownOption("+0"),
  new DropdownOption("+12"),
  new DropdownOption("+16"),
  new DropdownOption("+18")
]

function AvailableEventsPage() {
  const navigate = useNavigate();

  const _onSearch = () => {
    console.log('searching')
  }

  const _onCreation = () => {
    navigate(RoutePaths.createEvent)
    console.log('creating')
  }
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
            {"Мероприятия " + index}
          </div>
          <div className={styles.event_place}>
            Площадка
          </div>
        </div>
        <div className={styles.button} style={{marginLeft: '950px'}}>
          <Button onClick={_onCreation}>Копировать</Button>
        </div>
      </a>
    );
  }
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
              <div className={styles.button}>
                <Button onClick={_onCreation}>Создать</Button>
              </div>
            </div>
            <div className={styles.filters}>
              <Input className={styles.filter_element} placeholder="Название мероприятия" />
              <Input className={styles.filter_element} placeholder="Сроки регистрации" />
              <Input className={styles.filter_element} placeholder="Сроки проведения" />
              <div className={styles.dropdown}>
                <Dropdown placeholder="Статус" items={filterStatus} clearable />
              </div>
              <div className={styles.dropdown}>
                <Dropdown placeholder="Формат" items={filterFormat} clearable />
              </div>
              <div className={styles.dropdown}>
                <Dropdown placeholder="Возрастное ограничение" items={filterAge} clearable />
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
