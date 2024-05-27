import styles from "./index.module.css";
import BrandLogo from "@widgets/main/BrandLogo";
import Layout from "@widgets/main/Layout";
import PageName from "@widgets/main/PageName";
import Content from "@widgets/main/Content";
import SideBar from "@widgets/main/SideBar";
import Search from "@widgets/main/Search";
import Dropdown from "@widgets/main/Dropdown";
import Button from "@widgets/main/Button";
import { RouteParams, RoutePaths } from "@shared/config/routes";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import { getImageUrl } from "@shared/lib/image.ts";
import { ReactLogo } from "@shared/ui/icons";
import Fade from "@widgets/main/Fade";
import Dialog from "@widgets/main/Dialog";
import { appendClassName } from "@shared/util.ts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ApiContext from "@features/api-context";
import Pagination, { PageEntry, PageProps } from "@widgets/main/PagedList/pagination";import {
  GetAllOrFilteredEventsFormatEnum,
  GetAllOrFilteredEventsStatusEnum,
  PlaceResponse,
} from "@shared/api/generated";
import { EventResponse } from "@shared/api/generated";
import EventCreationPage from "./EventCreationDialog";
import EventCreationPage2 from "./EventCreationDialog2";
import PrivilegeContext from "@features/privilege-context";
import { hasAnyPrivilege } from "@features/privileges";
import { PrivilegeData } from "@entities/privilege-context";
import { PrivilegeNames } from "@shared/config/privileges";
import ImagePreview from "@widgets/main/ImagePreview";
import { eventService } from "@features/event-service";
import { placeService } from "@features/place-service";

enum DisplayModes {
  LIST = 'Показать списком',
  MAP = 'Показать на карте',
}

const displayModes = Object.values(DisplayModes);
const eventStatusList = Object.values(GetAllOrFilteredEventsStatusEnum);
const eventFormatList = Object.values(GetAllOrFilteredEventsFormatEnum);

type FilterType = {
  title: string;
  startDate: string; //either isostring or blank
  endDate: string;
  status: GetAllOrFilteredEventsStatusEnum | undefined;
  format: GetAllOrFilteredEventsFormatEnum | undefined;
  [key: string]: number | string | GetAllOrFilteredEventsStatusEnum | GetAllOrFilteredEventsFormatEnum | undefined;
};

const initialFilters: FilterType = {
  title: '',
  startDate: '',
  endDate: '',
  status: undefined,
  format: undefined,
};

type PageItemStubProps = {
  index: number;
  title: string;
  place: string;
};
const PageItemStub = (props: PageItemStubProps) => {
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    getImageUrl(props.index.toString()).then((url) => {
      setImageUrl(url);
    });
  }, []);
  const navigate = useNavigate();
  const _event = (id: number) => {
    navigate(RoutePaths.eventData.replace(RouteParams.EVENT_ID, id.toString()));
  };
  const _handleClick = () => {
    _event(props.index);
  };
  return (
    <a key={props.index} onClick={_handleClick} className={styles.event_entry}>
      {imageUrl == "" ? (
        <ReactLogo className={styles.event_icon} />
      ) : (
        <ImagePreview className={styles.event_icon} src={imageUrl} alt="Event Icon" />
      )}
      <div className={styles.event_info_column}>
        <div className={styles.event_name}>{props.title}</div>
        <div className={styles.event_place}>{props.place}</div>
      </div>
    </a>
  );
};

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
};

function EventListPage() {
  const { api } = useContext(ApiContext);
  const { privilegeContext } = useContext(PrivilegeContext);
  const [filters, setFilters] = useState(initialFilters);
  const [displayMode, setDisplayMode] = useState(DisplayModes.LIST);
  const [searchValue, setSearchValue] = useState('');

  const [pageProps, setPageProps] = useState<PageProps>({ page: 1, size: 5, total: 0 });
  const [itemList, setItemList] = useState<PageEntry[]>([]);

  const [_, setPrivilegeCreateEvent] = useState(false);

  useEffect(() => {
    if (privilegeContext.isSystemPrivilegesLoaded()) {
      const privileges = privilegeContext.systemPrivileges!;
      setPrivilegeCreateEvent(hasAnyPrivilege(privileges, new Set([
        new PrivilegeData(PrivilegeNames.CREATE_EVENT),
      ])));
    } else {
      setPrivilegeCreateEvent(true);
    }
  }, [privilegeContext]);

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
        filters.format,
      );
      if (total === undefined || items === undefined) throw new Error('Incomplete data received from the server');
      const data = items as unknown as EventResponse[];
      const eventsWithPlaces: { event: EventResponse; place: PlaceResponse }[] = [];
      const pagesPromises = data.map(async (e) => {
        let address: string = "";
        if (e.placesIds && e.placesIds.length > 0) {
          const place = await placeService.getPlace(api, e.placesIds[0]);
          eventsWithPlaces.push({ event: e, place: place });
          if (place)
            address = place.address !== undefined ? place.address + (place.room ? ', ауд. ' + place.room : '') : 'null';
        }
        return new PageEntry(() => {
          return (
            <PageItemStub
              key={e.id ? e.id : -1}
              index={e.id ? e.id : -1}
              title={(e.title !== undefined) ? e.title : "null"}
              place={address}
            />
          );
        });
      });
      const pages = await Promise.all(pagesPromises);
      try {
        (document.getElementById("itmo-map-iframe") as HTMLIFrameElement)?.contentWindow?.postMessage({
          type: "eventsLists",
          events: eventsWithPlaces,
        }, "*");
        (document.getElementById("itmo-map-iframe") as HTMLIFrameElement).onload = () => {
          (document.getElementById("itmo-map-iframe") as HTMLIFrameElement)?.contentWindow?.postMessage({
            type: "eventsLists",
            events: eventsWithPlaces,
          }, "*");
        };
      } catch (_) { /* empty */
      }
      setPageProps({ page: page, size: size, total: total });
      setItemList(pages);
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
      args: any = {},
    ) {
      this.heading = heading;
      this.visible = visible;
      this.args = args;
    }
  }

  const [dialogData, setDialogData] = useState(new DialogData());
  const [dialogData2, setDialogData2] = useState(new DialogData());
  //const [roles, setRoles] = useState([] as RoleElement[]);
  const dialogRef = useRef(null);
  const dialogRef2 = useRef(null);

  enum DialogSelected {
    NONE,
    CREATEEVENT = 1,
  }

  const _Dialog = () => {
    let component = <></>;
    switch (dialogData.visible) {
      case DialogSelected.CREATEEVENT:
        component = (
          <EventCreationPage
            onSubmit={() => {
              _closeDialog();
              getEventList(1, pageProps.size);
            }}
            {...dialogData.args}
          />
        );
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
  const _Dialog2 = () => {
    let component = <></>;
    switch (dialogData2.visible) {
      case DialogSelected.CREATEEVENT:
        component = (
          <EventCreationPage2
            onSubmit={() => {
              _closeDialog2();
              getEventList(1, pageProps.size);
            }}
            {...dialogData2.args}
          />
        );
        break;
    }
    return (

      <Dialog
        className={appendClassName(styles.dialog,
          (dialogData2.visible ? styles.visible : styles.hidden))}
        text={dialogData2.heading}
        ref={dialogRef2}
        onClose={_closeDialog2}
      >
        {component}
      </Dialog>
    );
  };

  const _closeDialog = () => {
    setDialogData(new DialogData());
  };
  const _closeDialog2 = () => {
    setDialogData2(new DialogData());
  };
  //

  const _onCreationPopUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    setDialogData(new DialogData("Создание мероприятия", DialogSelected.CREATEEVENT));
    e.stopPropagation();
  };

  const _onCreationPopUp2 = (e: React.MouseEvent<HTMLButtonElement>) => {
    setDialogData2(new DialogData("Создание мероприятия", DialogSelected.CREATEEVENT));
    e.stopPropagation();
  };

  //filters
  const _handleFilterChange = (
    value: string | GetAllOrFilteredEventsStatusEnum | GetAllOrFilteredEventsFormatEnum | undefined,
    name: string
  ) => {
    if (value !== null && filters[name] !== value) {
      setFilters((prevFilters) => ({
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
                  <Search onSearch={(value) => _handleFilterChange(value, "title")} placeholder="Поиск"
                          onChange={(e) => setSearchValue(e.target.value)} value={searchValue} />
                </div>
                <div className={styles.dropdown}>
                  <Dropdown
                    placeholder="Режим отображения"
                    items={displayModes}
                    value={displayMode}
                    onChange={(mode) => {
                      setDisplayMode(mode);
                      (document.getElementById("itmo-map-iframe") as HTMLIFrameElement)?.contentWindow?.postMessage({ type: "resize" }, "*");
                    }}
                    toText={(input: string) => {
                      return input;
                    }} />
                </div>
                {hasAnyPrivilege(privilegeContext.systemPrivileges, new Set([new PrivilegeData(PrivilegeNames.CREATE_EVENT)])) &&
                  <div className={styles.button}>
                    <Button onClick={_onCreationPopUp}>Создать</Button>
                  </div>
                }
                {hasAnyPrivilege(privilegeContext.systemPrivileges, new Set([new PrivilegeData(PrivilegeNames.CREATE_EVENT)])) &&
                  <div className={styles.button}>
                    <Button onClick={_onCreationPopUp2}>Создать на основе мероприятия</Button>
                  </div>
                }
              </div>
              <div className={styles.filters}>
                <div className={styles.filter_group}>
                  <div className={styles.dialog__date}>
                    <DatePicker
                      placeholderText="Начало проведения"
                      className={styles.filter_element}
                      onChange={(date) => _handleFilterChange(date ? date.toISOString() : "", "startDate")}
                      selected={!isBlank(filters.startDate) ? new Date(filters.startDate) : null}
                      dateFormat="yyyy-MM-dd"
                      popperPlacement="top-start"
                      enableTabLoop={false}
                    />
                    <span>
                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 9H21M12 18V12M15 15.001L9 15M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
                        stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  </div>
                  <div className={styles.dialog__date}>
                    <DatePicker
                      placeholderText="Конец проведения"
                      className={styles.filter_element}
                      onChange={(date) => _handleFilterChange(date ? date.toISOString() : "", "endDate")}
                      selected={!isBlank(filters.endDate) ? new Date(filters.endDate) : null}
                      dateFormat="yyyy-MM-dd"
                      popperPlacement="top-start"
                      enableTabLoop={false}
                    />
                    <span>
                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 9H21M12 18V12M15 15.001L9 15M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
                        stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  </div>
                  <div className={styles.dropdownfilter}>
                    <Dropdown
                      placeholder="Статус"
                      items={eventStatusList}
                      value={filters.status !== undefined ? filters.status : ""}
                      onChange={(status) => _handleFilterChange(getEnumValueFromString(GetAllOrFilteredEventsStatusEnum, status), "status")}
                      onClear={() => _handleFilterChange("", "status")}
                      toText={(input: string) => {
                        return input;
                      }} />
                  </div>
                  <div className={styles.dropdownfilter}>
                    <Dropdown
                      placeholder="Формат"
                      items={eventFormatList}
                      value={filters.format !== undefined ? filters.format : ""}
                      onChange={(format) => _handleFilterChange(getEnumValueFromString(GetAllOrFilteredEventsFormatEnum, format), "format")}
                      onClear={() => _handleFilterChange("", "format")}
                      toText={(input: string) => {
                        return input;
                      }} />
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
                <iframe id="itmo-map-iframe" src={(window as any).ENV_GEO_URL + "/map.html?off_clickable"}
                        width="100%" height="420px"></iframe>
              </div>
            </div>
            <Fade
              className={appendClassName(styles.fade,
                (dialogData.visible) ? styles.visible : styles.hidden)}>
              <_Dialog />
            </Fade>
            <Fade
              className={appendClassName(styles.fade,
                (dialogData2.visible) ? styles.visible : styles.hidden)}>
              <_Dialog2 />
            </Fade>
          </Content>
        }
    />
  );
}

export default EventListPage;
