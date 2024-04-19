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
import Dialog from '@widgets/main/Dialog';
import { appendClassName } from "@shared/util.ts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ApiContext from '@features/api-context';
import Pagination, { PageEntry, PageProps } from '@widgets/main/PagedList/pagination';
import { GetAllOrFilteredEventsFormatEnum, GetAllOrFilteredEventsStatusEnum } from '@shared/api/generated';
import { EventResponse } from '@shared/api/generated';
import EventCreationPage from './EventCreationDialog';
import PrivilegeContext from '@features/privilege-context';
import { hasAnyPrivilege } from '@features/privileges';
import { PrivilegeData } from '@entities/privilege-context';
import { PrivilegeNames } from '@shared/config/privileges';
import ImagePreview from "@widgets/main/ImagePreview";
import { eventService } from '@features/event-service';
import { placeService } from '@features/place-service';

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

const initialFilters: FilterType = {
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
  const _event = (id: number) => {
    navigate(RoutePaths.eventData.replace(RouteParams.EVENT_ID, id.toString()));
  }
  const _handleClick = () => {
    _event(props.index);
  };
  return (
    <a key={props.index} onClick={_handleClick} className={styles.event_entry}>
      {imageUrl == '' ? (
        <ReactLogo className={styles.event_icon} />
      ) : (
        <ImagePreview className={styles.event_icon} src={imageUrl} alt="Event Icon" />
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
  const { api } = useContext(ApiContext);
  const { privilegeContext } = useContext(PrivilegeContext);
  const [filters, setFilters] = useState(initialFilters);
  const [displayMode, setDisplayMode] = useState(DisplayModes.LIST);
  const [searchValue, setSearchValue] = useState("");

  const [pageProps, setPageProps] = useState<PageProps>({ page: 1, size: 5, total: 0 });
  const [itemList, setItemList] = useState<PageEntry[]>([]);

<<<<<<< Updated upstream
=======
  const [privilegeCreateEvent, setPrivilegeCreateEvent] = useState(false);

  useEffect(() => {
    if (privilegeContext.isSystemPrivilegesLoaded()) {
      const privileges = privilegeContext.systemPrivileges!;
      setPrivilegeCreateEvent(hasAnyPrivilege(privileges, new Set([
        new PrivilegeData(PrivilegeNames.CREATE_EVENT)
      ])))
    } else {
      setPrivilegeCreateEvent(true);
    }
  }, [privilegeContext])

>>>>>>> Stashed changes
  const getEventList = async (page: number = 1, size: number = 5) => {
    try {
      const { total, items } = await eventService.getFilteredEvents(
        api,
        page - 1,
        size,
        undefined, //parentId
        !isBlank(filters.title) ? filters.title : undefined,
        !isBlank(filters.startDate) ? filters.startDate : undefined,
        !isBlank(filters.endDate) ? filters.endDate : undefined,
        filters.status,
        filters.format
      );
      if (total === undefined || items === undefined) throw new Error("Incomplete data received from the server");
      const data = items as unknown as EventResponse[];
      const pagesPromises = data.map(async (e) => {
        let address: string = '';
        if (e.placeId) {
          const place = await placeService.getPlace(api, e.placeId);
          if (place) address = place.address !== undefined ? place.address : "null";
        }
        return new PageEntry(() => {
          return (
            <PageItemStub
              key={e.id ? e.id : -1}
              index={e.id ? e.id : -1}
              title={(e.title !== undefined) ? e.title : 'null'}
              place={address}
            />);
        });
      });
      const pages = await Promise.all(pagesPromises);
      setPageProps({ page: page, size: size, total: total });
      setItemList(pages);
    } catch (error) {
      console.error("Error fetching event list:", error);
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
        component = <EventCreationPage onSubmit={() => {
          _closeDialog();
          getEventList(1, pageProps.size);
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
    if (value !== null && filters[name] !== value) {
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
                <Search onSearch={(value) => _handleFilterChange(value, "title")} placeholder="Поиск" onChange={(e) => setSearchValue(e.target.value)} value={searchValue} />
              </div>
              <div className={styles.dropdown}>
                <Dropdown
                  placeholder="Режим отображения"
                  items={displayModes}
                  value={displayMode}
                  onChange={(mode) => { setDisplayMode(mode) }}
                  toText={(input: string) => { return input }} />
              </div>
              {hasAnyPrivilege(privilegeContext.systemPrivileges, new Set([new PrivilegeData(PrivilegeNames.CREATE_EVENT)])) &&
                <div className={styles.button}>
                  <Button onClick={_onCreationPopUp}>Создать</Button>
                </div>
              }
            </div>
            <div className={styles.filters}>
              <div className={styles.filter_group}>
                <DatePicker
                  placeholderText="Начало проведения"
                  className={styles.filter_element}
                  onChange={(date) => _handleFilterChange(date ? date.toISOString() : "", "startDate")}
                  selected={!isBlank(filters.startDate) ? new Date(filters.startDate) : null}
                  dateFormat="yyyy-MM-dd"
                  popperPlacement="top-start"
                  enableTabLoop={false}
                />
                <DatePicker
                  placeholderText="Конец проведения"
                  className={styles.filter_element}
                  onChange={(date) => _handleFilterChange(date ? date.toISOString() : "", "endDate")}
                  selected={!isBlank(filters.endDate) ? new Date(filters.endDate) : null}
                  dateFormat="yyyy-MM-dd"
                  popperPlacement="top-start"
                  enableTabLoop={false}
                />
                <div className={styles.dropdownfilter}>
                  <Dropdown
                    placeholder="Статус"
                    items={eventStatusList}
                    value={filters.status !== undefined ? filters.status : ""}
                    onChange={(status) => _handleFilterChange(getEnumValueFromString(GetAllOrFilteredEventsStatusEnum, status), "status")}
                    onClear={() => _handleFilterChange("", "status")}
                    toText={(input: string) => { return input }} />
                </div>
                <div className={styles.dropdownfilter}>
                  <Dropdown
                    placeholder="Формат"
                    items={eventFormatList}
                    value={filters.format !== undefined ? filters.format : ""}
                    onChange={(format) => _handleFilterChange(getEnumValueFromString(GetAllOrFilteredEventsFormatEnum, format), "format")}
                    onClear={() => _handleFilterChange("", "format")}
                    toText={(input: string) => { return input }} />
                </div>
              </div>
            </div>
            <div hidden={displayMode == DisplayModes.MAP}>
              <div className={styles.event_list_container}>
                <Pagination pageProps={pageProps} onPageChange={(page, size) => getEventList(page, size)}
                  items={itemList} pageSpread={1} />
              </div>
            </div>
            <div hidden={displayMode == DisplayModes.LIST}>
              <iframe id="itmo-map-iframe" src="https://trickyfoxy.ru/practice/map.html?off_clickable"
                width="100%" height="420px"></iframe>
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
