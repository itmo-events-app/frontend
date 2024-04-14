import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar from '@widgets/main/SideBar';
import Search from '@widgets/main/Search';
import Dropdown from '@widgets/main/Dropdown';
import Button from '@widgets/main/Button';
import PagedList, { PageEntry } from '@widgets/main/PagedList';
import { RouteParams, RoutePaths } from '@shared/config/routes';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';
import { getImageUrl } from '@shared/lib/image.ts';
import { ReactLogo } from '@shared/ui/icons';
import Fade from '@widgets/main/Fade';
import EventCreationPage from '../EventCreation';
import Dialog from '@widgets/main/Dialog';
import { appendClassName } from '@shared/util.ts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiContext from '@features/api-context';
import { EventResponse } from '@shared/api/generated';

enum DisplayModes {
  LIST = 'Показать списком',
  MAP = 'Показать на карте',
}

enum EventStatusList {
  DRAFT = 'Черновик',
  ACTIVE = 'Активное',
  FINISHED = 'Проведенное',
  CANCELLED = 'Отмененное',
}

enum EventFormatList {
  OFFLINE = 'Очный',
  ONLINE = 'Онлайн',
  COMBINED = 'Смешанный',
}

enum EventAgeList {
  FIRST = '12+',
  SECOND = '16+',
  THIRD = '18+',
}

const displayModes = Object.values(DisplayModes);
const eventStatusList = Object.values(EventStatusList);
const eventFormatList = Object.values(EventFormatList);
const eventAgeList = Object.values(EventAgeList);

type InitialFilters = {
  title: string,
  startDate: string | null,
  registrationStartDate: string | null,
  registrationEndDate: string | null,
  endDate: string | null,
  status: string,
  format: string,
  eventAge: string
}

const initialFilters: InitialFilters = {
  title: '',
  startDate: null,
  registrationStartDate: null,
  registrationEndDate: null,
  endDate: null,
  status: '',
  format: '',
  eventAge: '',
  // page: 1,
  // size: 15,
};

// const buildApiUrl = (baseUrl: string, filters) => {
//   let url = baseUrl;
//   Object.entries(filters).forEach(([key, value]) => {
//     if (value !== '') {
//       url += url.includes('?') ? `&${key}=${encodeURIComponent(value)}` : `?${key}=${encodeURIComponent(value)}`;
//     }
//   });
//   return url;
// };

function getKeyByValue<T extends string>(enumObj: Record<string, T>, value: T): keyof typeof enumObj | undefined {
  return Object.keys(enumObj).find((key) => enumObj[key as keyof typeof enumObj] === value) as
    | keyof typeof enumObj
    | undefined;
}

const formatDate = (date: Date | null) => {
  if (date) {
    const selectedDate = new Date(date);
    return selectedDate.getFullYear() + '-' + selectedDate.getMonth() + '-' + selectedDate.getDate();
  }
  return null;
};

function EventListPage() {
  const { api } = useContext(ApiContext);
  const [events, setEvents] = useState<PageEntry[]>([]);
  const [loading, setLoading] = useState(true); ////
  const [filters, setFilters] = useState(initialFilters);
  const [displayMode, setDisplayMode] = useState(DisplayModes.LIST);

  const [searchValue, setSearchValue] = useState('');

  const getEventList = async () => {
    try {
      //todo: url, fix page logic
      //registrationStartDate, registrationEndDate, eventAge not existed in swagger api api/events. page and size conflicted between local and api
      // const url = buildApiUrl('http://localhost:9000/events', filters);
      const response = await api.event.getAllOrFilteredEvents();
      if (response.status === 200) {
        // TODO: don't cast types
        const data = response.data.items as unknown as EventResponse[];
        const pagesPromises = data.map(async (e) => {
          let address: string | undefined = '';
          if (e.placeId) {
            const response = await api.place.placeGet(e.placeId);
            console.log(response);
            if (response.status == 200) {
              const place = response.data;
              address = place.address;
            } else {
              console.log(response.status);
            }
          }
          return new PageEntry(() => {
            return _entryStub(e.id!, address ?? '', e.title!);
          });
        });
        const pages = await Promise.all(pagesPromises);
        setEvents(pages);
        setLoading(false);
      } else {
        console.error('Error fetching event list:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching event list:', error);
    }
  };
  useEffect(() => {
    getEventList();
  }, [filters]);

  //dialog
  class DialogData {
    heading: string | undefined;
    visible: DialogSelected;
    args: any;
    constructor(heading?: string, visible: DialogSelected = DialogSelected.NONE, args: any = {}) {
      this.heading = heading;
      this.visible = visible;
      this.args = args;
    }
  }
  const [dialogData, setDialogData] = useState(new DialogData());
  // const [roles, setRoles] = useState([] as RoleElement[]);
  const dialogRef = useRef(null);
  enum DialogSelected {
    NONE,
    CREATEEVENT = 1,
  }

  const _Dialog = () => {
    let component = <></>;
    switch (dialogData.visible) {
      case DialogSelected.CREATEEVENT:
        component = <EventCreationPage contentOnly={true} {...dialogData.args} />;
        break;
    }
    return (
      <Dialog
        className={appendClassName(styles.dialog, dialogData.visible ? styles.visible : styles.hidden)}
        text={dialogData.heading}
        ref={dialogRef}
        onClose={_closeDialog}
      >
        {component}
      </Dialog>
    );
  };

  const _closeDialog = () => {
    setDialogData(new DialogData());
  };
  //

  const _onCreationPopUp = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setDialogData(new DialogData('Создание мероприятия', DialogSelected.CREATEEVENT));
    e.stopPropagation();
  };
  const navigate = useNavigate();
  const _event = (id: number) => {
    navigate(RoutePaths.eventData.replace(RouteParams.EVENT_ID, id.toString()));
  };

  function _entryStub(index: number, place: string, title: string) {
    const [imageUrl, setImageUrl] = useState('');
    useEffect(() => {
      getImageUrl(index.toString()).then((url) => {
        setImageUrl(url);
      });
    }, []);
    const handleClick = () => {
      _event(index);
    };
    return (
      <a key={index} onClick={handleClick} className={styles.event_entry}>
        {imageUrl == '' ? (
          <ReactLogo className={styles.event_icon} />
        ) : (
          <img src={imageUrl} className={styles.event_icon} />
        )}
        <div className={styles.event_info_column}>
          <div className={styles.event_name}>{'Event ' + index + ': ' + title}</div>
          <div className={styles.event_place}>{place}</div>
        </div>
      </a>
    );
  }

  //filters
  const _handleFilterChange = (value: string | null | undefined, name: string) => {
    console.log(value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Мероприятия" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.eventList} />}
      bottomRight={
        <Content>
          <div className={styles.events_page}>
            <div className={styles.horizontal_bar}>
              <div className={styles.search}>
                <Search
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onSearch={(value) => _handleFilterChange(value, 'title')}
                  placeholder="Поиск"
                />
              </div>
              <div className={styles.dropdown}>
                <Dropdown
                  placeholder="Режим отображения"
                  items={displayModes}
                  value={displayMode}
                  onChange={(mode) => {
                    setDisplayMode(mode);
                  }}
                  toText={(input: string) => {
                    return input;
                  }}
                />
              </div>
              <div className={styles.button}>
                <Button onClick={_onCreationPopUp}>Создать</Button>
              </div>
            </div>
            <div className={styles.filters}>
              <div className={styles.filter_group}>
                <DatePicker
                  placeholderText="Начало регистрации"
                  className={styles.filter_element}
                  onChange={(date) => _handleFilterChange(formatDate(date), 'registrationStartDate')}
                  selected={filters.registrationStartDate ? new Date(filters.registrationStartDate) : null}
                  dateFormat="yyyy-MM-dd"
                  popperPlacement="top-start"
                />
                <DatePicker
                  placeholderText="Конец регистрации"
                  className={styles.filter_element}
                  onChange={(date) => _handleFilterChange(formatDate(date), 'registrationEndDate')}
                  selected={filters.registrationEndDate ? new Date(filters.registrationEndDate) : null}
                  dateFormat="yyyy-MM-dd"
                  popperPlacement="top-start"
                />
                <DatePicker
                  placeholderText="Начало проведения"
                  className={styles.filter_element}
                  onChange={(date) => _handleFilterChange(formatDate(date), 'startDate')}
                  selected={filters.startDate ? new Date(filters.startDate) : null}
                  dateFormat="yyyy-MM-dd"
                  popperPlacement="top-start"
                />
                <DatePicker
                  placeholderText="Конец проведения"
                  className={styles.filter_element}
                  onChange={(date) => _handleFilterChange(formatDate(date), 'endDate')}
                  selected={filters.endDate ? new Date(filters.endDate) : null}
                  dateFormat="yyyy-MM-dd"
                  popperPlacement="top-start"
                />
              </div>
              <div className={styles.filter_group}>
                <div className={styles.dropdown}>
                  <Dropdown
                    placeholder="Статус"
                    items={eventStatusList}
                    value={EventStatusList[filters.status as keyof typeof EventStatusList]}
                    onChange={(status) => _handleFilterChange(getKeyByValue(EventStatusList, status), 'status')}
                    onClear={() => _handleFilterChange('', 'status')}
                    toText={(input: string) => {
                      return input;
                    }}
                  />
                </div>
                <div className={styles.dropdown}>
                  <Dropdown
                    placeholder="Формат"
                    items={eventFormatList}
                    value={EventFormatList[filters.format as keyof typeof EventFormatList]}
                    onChange={(format) => _handleFilterChange(getKeyByValue(EventFormatList, format), 'format')}
                    onClear={() => _handleFilterChange('', 'format')}
                    toText={(input: string) => {
                      return input;
                    }}
                  />
                </div>
                <div className={styles.dropdown}>
                  <Dropdown
                    placeholder="Возрастное ограничение"
                    items={eventAgeList}
                    value={EventAgeList[filters.eventAge as keyof typeof EventAgeList]}
                    onChange={(age) => _handleFilterChange(getKeyByValue(EventAgeList, age), 'eventAge')}
                    onClear={() => _handleFilterChange('', 'eventAge')}
                    toText={(input: string) => {
                      return input;
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.event_list_container}>
              {loading ? <p>Loading...</p> : <PagedList page={1} page_size={5} page_step={5} items={events} />}
            </div>
          </div>
          <Fade className={appendClassName(styles.fade, dialogData.visible ? styles.visible : styles.hidden)}>
            <_Dialog />
          </Fade>
        </Content>
      }
    />
  );
}

export default EventListPage;
