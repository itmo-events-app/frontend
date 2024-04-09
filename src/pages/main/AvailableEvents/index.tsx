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
import { useEffect, useState } from "react";
import { getImageUrl } from "@shared/lib/image.ts"
import { ReactLogo } from "@shared/ui/icons";
const _displayModes: DropdownOption[] = [
  new DropdownOption("Показать списком"),
  new DropdownOption("Показать на карте")
]



const filterStatus: DropdownOption[] = [
  new DropdownOption("Черновик"),
  new DropdownOption("Активное"),
  new DropdownOption("Проведенное"),
  new DropdownOption("Отмененное")
]

const filterFormat: DropdownOption[] = [
  new DropdownOption("Очный"),
  new DropdownOption("Онлайн"),
  new DropdownOption("Смешанный")
]

const filterAge: DropdownOption[] = [
  new DropdownOption("+0"),
  new DropdownOption("+12"),
  new DropdownOption("+16"),
  new DropdownOption("+18")
]

function AvailableEventsPage() {
  const [events,setEvents] = useState([])
  const [loading, setLoading] = useState(true);

  const getEventList = async () => {
    try {
      const response = await fetch('/api/events', {
        method: 'GET'
      });
      if (response.status === 200) {
        const data = await response.json();
        // console.log(data);
        const pagesPromises = data.map(async (e) => {
          let address = ''
          await fetch('/api/places/' + e.placeId, {
            method: 'GET'
          }).then(response => {
              if (response.status == 200) {
                const place = response.json();
                place.then(p => {
                  address = p.address;
                });
              } else {
                console.log(response.status);
              }
            }
          )
          return new PageEntry(() => {
            return _entryStub(parseInt(e.id), address, e.title)
          });
        });
        const pages = await Promise.all(pagesPromises);
        setEvents(pages.filter(page => page !== null));
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


  const _brandLogoClick = () => {
    console.log('brand logo!')
  }

  const _onSearch = () => {
    console.log('searching')
  }

  const _onCreation = () => {
    console.log('creating')
  }
  const navigate = useNavigate();
  const _event = (id:number) => {
    navigate("/events/event/"+id.toString());
  }


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
  return (
    <Layout
      topLeft={<BrandLogo onClick={_brandLogoClick} />}
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
                <Dropdown value="Показать списком" placeholder="Режим отображения" items={_displayModes} />
              </div>
              <div className={styles.button}>
                <Button onClick={_onCreation}>Создать</Button>
              </div>
            </div>
            <div className={styles.filters}>
              <div className={styles.filter_group}>
                <Input className={styles.filter_element} placeholder="Начало регистрации" />
                <Input className={styles.filter_element} placeholder="Конец регистрации" />
                <Input className={styles.filter_element} placeholder="Начало проведения" />
                <Input className={styles.filter_element} placeholder="Конец проведения" />
              </div>
              <div className={styles.filter_group}>
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
