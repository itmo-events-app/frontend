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
import { RouteParams, RoutePaths } from "@shared/config/routes";
import Input from "@widgets/main/Input";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getImageUrl } from "@shared/lib/image.ts"
import { ReactLogo } from "@shared/ui/icons";
import { api } from "@shared/api";
const _displayModes: DropdownOption[] = [
  new DropdownOption("Показать списком"),
  new DropdownOption("Показать на карте")
]

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
  const [events,setEvents] = useState([])
  const [loading, setLoading] = useState(true);

  const getEventList = async () => {
    try {
     const response = await api.event.getAllOrFilteredEvents();
        if (response.status === 200) {
          const data = response.data;
          const pagesPromises = data.map(async (e) => {
            let address = ''
            const response = await fetch('/api/places/' + e.placeId, {
              method: 'GET'
            })
            if (response.status == 200) {
              const place = await response.json();
              address = place.address;
            } else {
              console.log(response.status);
            }
            return new PageEntry(() => {
              return _entryStub(parseInt(e.id), address, e.title)
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
  }, []);


  const _onSearch = () => {
    console.log('searching')
  }

  const _onCreation = () => {
    console.log('creating')
  }
  const navigate = useNavigate();
  const _event = (id:number) => {
    navigate(RoutePaths.eventData.replace(RouteParams.EVENT_ID,id.toString()));
  }
  const _events: any[] = [
    new PageEntry(() => {
      return _entryStub(1);
    }),
    new PageEntry(() => {
      return _entryStub(2);
    }),
    new PageEntry(() => {
      return _entryStub(3);
    }),
    new PageEntry(() => {
      return _entryStub(4);
    }),
    new PageEntry(() => {
      return _entryStub(5);
    }),
  ];

  function _entryStub(index: number, place: string, title: string) {
    const [imageUrl, setImageUrl] = useState('');
    useEffect(() => {
      getImageUrl(index.toString()).then(url => {
        setImageUrl(url);
      });
    }, []);
    const handleClick = () => {
      _event(index);
    };
    return (
      <a key={index} onClick={handleClick} className={styles.event_entry}>
        {imageUrl==''?(
          <ReactLogo className={styles.event_icon}/>
          ):(
          <img src={imageUrl}
               className={styles.event_icon}/>
        )}
        <div className={styles.event_info_column}>
          <div className={styles.event_name}>
            {"Event " + index + ": " + title}
          </div>
          <div className={styles.event_place}>
            {place}
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
              {loading ? (
                <p>Loading...</p>
              ) : (
                <PagedList page={1} page_size={5} page_step={5} items={events} />
              )}
            </div>
          </div>
        </Content>
      }
    />
  );
}

export default AvailableEventsPage;
