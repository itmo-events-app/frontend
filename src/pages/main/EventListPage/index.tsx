import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar from '@widgets/main/SideBar';
import Search from "@widgets/main/Search";
import Dropdown from "@widgets/main/Dropdown";
import Button from "@widgets/main/Button";
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
import Pagination, { PageEntry } from '@widgets/main/PagedList/pagination';

import { GetAllOrFilteredEventsFormatEnum, GetAllOrFilteredEventsStatusEnum } from '@shared/api/generated';

enum DisplayModes {
  LIST = "Показать списком",
  MAP = "Показать на карте",
}

const displayModes = Object.values(DisplayModes);
const eventStatusList = Object.values(GetAllOrFilteredEventsStatusEnum);
const eventFormatList = Object.values(GetAllOrFilteredEventsFormatEnum);

type FilterType = {
  title: string,
  startDate: string, //either isostring or blank
  endDate: string,
  status: GetAllOrFilteredEventsStatusEnum | undefined,
  format: GetAllOrFilteredEventsFormatEnum | undefined,
  [key: string]: number | string | GetAllOrFilteredEventsStatusEnum | GetAllOrFilteredEventsFormatEnum | undefined;
}


const initialFilters : FilterType = {
  title: "",
  startDate: "",
  endDate: "",
  status: undefined,
  format: undefined
};

type PageItemStubProps = {
  index: number,
  title: string,
  place: string,
}
const PageItemStub = (props: PageItemStubProps) => {
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    getImageUrl(props.index.toString()).then(url => {
      setImageUrl(url);
    });
  }, []);
  const navigate = useNavigate();
  const _event = (id:number) => {
    navigate(RoutePaths.eventData.replace(RouteParams.EVENT_ID,id.toString()));
  }
  const _handleClick = () => {
    _event(props.index);
  };
  return (
    <a key={props.index} onClick={_handleClick} className={styles.event_entry}>
      {imageUrl==''?(
        <ReactLogo className={styles.event_icon}/>
        ):(
        <img src={imageUrl}
             className={styles.event_icon}/>
      )}
      <div className={styles.event_info_column}>
        <div className={styles.event_name}>
          {"Event " + props.index + ": " + props.title}
        </div>
        <div className={styles.event_place}>
          {props.place}
        </div>
      </div>
    </a>
  );
}


function getEnumValueFromString<T>(enumObject: T, value: string): T[keyof T] | undefined {
    for (const key in enumObject) {
      if (enumObject[key] === value) {
          return enumObject[key];
      }
    }
    return undefined;
}

const isBlank = (str: string): boolean => {
  return str.trim().length === 0;
}

function EventListPage() {
  const {api} = useContext(ApiContext);
  const [loading, setLoading] = useState(true);////
  const [filters, setFilters] = useState(initialFilters);
  const [displayMode, setDisplayMode] = useState(DisplayModes.LIST);
  const [searchValue, setSearchValue] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSize, setCurrentSize] = useState(15);
  const [totalItem, setTotalItem] = useState(0);
  const [itemList, setItemList] = useState<PageEntry[]>([]);
  const getEventList = async (page: number = 1, size: number = 5) => {
    try {
      const response = await api.event.getAllOrFilteredEvents(
        page-1,
        size,
        undefined, //parentId
        !isBlank(filters.title)?filters.title:undefined,
        !isBlank(filters.startDate)?filters.startDate:undefined,
        !isBlank(filters.endDate)?filters.endDate:undefined,
        filters.status,
        filters.format
      );
      interface EventType {
        id: string,
        placeId?: string,
        title: string        
      }
      if (response.status === 200) {
        const {total, items} = response.data;
        if (total===undefined||items===undefined) throw new Error("Incomplete data received from the server");
        const pagesPromises = items.map(async (value) => {
          const e = value as EventType;
          let address = "null";
          if (e.placeId !== undefined) {
            const response = await api.place.placeGet(parseInt(e.placeId));
            if (response.status == 200) {
              const place = response.data;
              address = place.address!==undefined?place.address:"null";
            } else {
              console.error(response.status);
            }
          }
          return new PageEntry(() => {
            return (
              <PageItemStub
                key={parseInt(e.id)}
                index={parseInt(e.id)}
                title={(e.title!==undefined)?e.title:'null'}
                place={address}
              />);
          });
        });
        const pages = await Promise.all(pagesPromises);
        setCurrentPage(page);
        setCurrentSize(size);
        setTotalItem(total);
        setItemList(pages);
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
  //const [roles, setRoles] = useState([] as RoleElement[]);
  const dialogRef = useRef(null);
  enum DialogSelected {
    NONE,
    CREATEEVENT = 1,
  }

  const _Dialog = () => {
    let component = <></>
    switch (dialogData.visible) {
      case DialogSelected.CREATEEVENT:
        component = <EventCreationPage onSubmit={()=>{
          _closeDialog();
          getEventList(1,currentSize);
          }} 
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

  const _onCreationPopUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    setDialogData(new DialogData('Создание мероприятия', DialogSelected.CREATEEVENT));
    e.stopPropagation();
  }

  //filters
  const _handleFilterChange = (value: string | GetAllOrFilteredEventsStatusEnum | GetAllOrFilteredEventsFormatEnum | undefined, name: string) => {
    if (value!==null && filters[name] !== value) {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: value,
      }));
    }
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
                <Search onSearch={(value)=>_handleFilterChange(value,"title")} placeholder="Поиск" onChange={(e) => setSearchValue(e.target.value)} value={searchValue}/>
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
                  onChange={(date)=>_handleFilterChange(date?date.toISOString():"","startDate")}
                  selected={!isBlank(filters.startDate)?new Date(filters.startDate):null}
                  dateFormat="yyyy-MM-dd"
                  popperPlacement="top-start"
                  enableTabLoop={false}
                />
                <DatePicker
                  placeholderText="Конец проведения"
                  className={styles.filter_element}
                  onChange={(date)=>_handleFilterChange(date?date.toISOString():"","endDate")}
                  selected={!isBlank(filters.endDate)?new Date(filters.endDate):null}
                  dateFormat="yyyy-MM-dd"
                  popperPlacement="top-start"
                  enableTabLoop={false}
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
                    value={filters.format!==undefined?filters.format:""}
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
                //<PagedList page={1} page_size={5} page_step={5} items={events} />
                <Pagination page={currentPage} size={currentSize} total={totalItem} onPageChange={(page,size)=>getEventList(page,size)} items={itemList}/>
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

export default EventListPage;
