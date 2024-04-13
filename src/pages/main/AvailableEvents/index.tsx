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
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import { getImageUrl } from "@shared/lib/image.ts"
import { ReactLogo } from "@shared/ui/icons";
import Fade from '@widgets/main/Fade';
import EventCreationPage from '../EventCreation';
import Dialog from '@widgets/main/Dialog';
import { appendClassName } from "@shared/util.ts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ApiContext from '@features/api-context';
import { GetAllOrFilteredEventsFormatEnum, GetAllOrFilteredEventsStatusEnum } from '@shared/api/generated';

enum DisplayModes {
  LIST = "Показать списком",
  MAP = "Показать на карте",
}

const displayModes = Object.values(DisplayModes);
const eventStatusList = Object.values(GetAllOrFilteredEventsStatusEnum);
const eventFormatList = Object.values(GetAllOrFilteredEventsFormatEnum);

type filterType = {
  page: number,
  size: number,
  title: string,
  startDate: string,
  endDate: string,
  status: GetAllOrFilteredEventsStatusEnum | undefined,
  format: GetAllOrFilteredEventsFormatEnum | undefined
}

const initialFilters : filterType = {
  page: 0,
  size: 15,
  title:'',
  startDate: '',
  endDate: '',
  status: undefined,
  format: undefined
};

function getEnumValueFromString<T>(enumObject: T, value: string): T[keyof T] | undefined {
    for (const key in enumObject) {
        if (enumObject[key] === value) {
            return enumObject[key];
        }
    }
    return undefined;
}

const formatDate = (date) => {
  const selectedDate = new Date(date)
  return selectedDate.getFullYear() + "-"+ selectedDate.getMonth() +"-"+ selectedDate.getDate();
};

const isBlank = (str: string): boolean => {
  return str.trim().length === 0;
}

function AvailableEventsPage() {
  const {api} = useContext(ApiContext);
  const [events,setEvents] = useState([])
  const [loading, setLoading] = useState(true);////
  const [filters, setFilters] = useState(initialFilters);
  const [displayMode, setDisplayMode] = useState(DisplayModes.LIST);

  const getEventList = async () => {
    try {
      const response = await api.event.getAllOrFilteredEvents(
        filters.page,
        filters.size,
        undefined, //parentId
        !isBlank(filters.title)?filters.title:undefined,
        !isBlank(filters.startDate)?new Date(filters.startDate).toISOString():undefined,
        !isBlank(filters.endDate)?new Date(filters.endDate).toISOString():undefined,
        filters.status,
        filters.format
      );
      if (response.status === 200) {
        console.log(response);
        const data = response.data;
        const pagesPromises = data.map(async (e) => {
          let address = 'null';
          if (e.placeId !== undefined) {
            const response = await api.place.placeGet(parseInt(e.placeId));
            if (response.status == 200) {
              const place = response.data;
              address = place.address;
            } else {
              console.log(response.status);
            }
          }
          return new PageEntry(() => {
            return _entryStub(parseInt(e.id), address, (e.title!==undefined)?e.title:'null')
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
    constructor(
      heading?: string,
      visible: DialogSelected = DialogSelected.NONE,
      args: any = {}
    ) {
      this.heading = heading;
      this.visible = visible;
      this.args = args;
    }
  }
  const [dialogData, setDialogData] = useState(new DialogData());
  const [roles, setRoles] = useState([] as RoleElement[]);
  const dialogRef = useRef(null);
  enum DialogSelected {
    NONE,
    CREATEEVENT = 1,
  }

  const _Dialog = () => {
    let component = <></>
    switch (dialogData.visible) {
      case DialogSelected.CREATEEVENT:
        component = <EventCreationPage contentOnly={true} onSubmit={()=>{
          _closeDialog();
          getEventList()}} 
          {...dialogData.args}
        />;
        break;
    }
    return (
      <Dialog
        className={appendClassName(styles.dialog,
          (dialogData.visible ? styles.visible : styles.hidden))}
        text={dialogData.heading}
        ref={dialogRef}
        onClose={_closeDialog}
      >
        {component}
      </Dialog>
    )
  }

  const _closeDialog = () => {
    setDialogData(new DialogData());
  }
  //

  const _onCreationPopUp = (e: MouseEvent) => {
    setDialogData(new DialogData('Создание мероприятия', DialogSelected.CREATEEVENT));
    e.stopPropagation();
  }
  const navigate = useNavigate();
  const _event = (id:number) => {
    navigate(RoutePaths.eventData.replace(RouteParams.EVENT_ID,id.toString()));
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


  //filters
  const _handleFilterChange = (value, name) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };


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
                <Search onSearch={(value)=>_handleFilterChange(value,"title")} placeholder="Поиск" />
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
                <Button onClick={_onCreationPopUp}>Создать</Button>
              </div>
            </div>
            <div className={styles.filters}>
              <div className={styles.filter_group}>
                <DatePicker
                  placeholderText="Начало проведения"
                  className={styles.filter_element}
                  onChange={(date)=>_handleFilterChange(formatDate(date),"startDate")}
                  selected={filters.startDate}
                  dateFormat="yyyy-MM-dd"
                  popperPlacement="top-start"
                />
                <DatePicker
                  placeholderText="Конец проведения"
                  className={styles.filter_element}
                  onChange={(date)=>_handleFilterChange(formatDate(date),"endDate")}
                  selected={filters.endDate}
                  dateFormat="yyyy-MM-dd"
                  popperPlacement="top-start"
                />
                <div className={styles.dropdownfilter}>
                  <Dropdown
                    placeholder="Статус"
                    items={eventStatusList}
                    value={filters.status!==undefined?filters.status:""}
                    onChange={(status) => _handleFilterChange(getEnumValueFromString(GetAllOrFilteredEventsStatusEnum,status),"status")}
                    onClear={() => _handleFilterChange("","status")}
                    toText={(input: string) => {return input}} />
                </div>
                <div className={styles.dropdownfilter}>
                  <Dropdown
                    placeholder="Формат"
                    items={eventFormatList}
                    value={GetAllOrFilteredEventsFormatEnum[filters.format as keyof typeof GetAllOrFilteredEventsFormatEnum]}
                    onChange={(format) => _handleFilterChange(getEnumValueFromString(GetAllOrFilteredEventsFormatEnum,format),"format")}
                    onClear={() => _handleFilterChange("","format")}
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
          <Fade
              className={appendClassName(styles.fade,
                (dialogData.visible) ? styles.visible : styles.hidden)}>
              <_Dialog />
          </Fade>
        </Content>
      }
    />
  );
}

export default AvailableEventsPage;
