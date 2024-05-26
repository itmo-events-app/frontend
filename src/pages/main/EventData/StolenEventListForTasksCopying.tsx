// Теперь это мой код

import styles from './../EventListPage/index.module.css';
import myStyles from './index.module.css';
import Content from '@widgets/main/Content';
import Search from '@widgets/main/Search';
import Dropdown from '@widgets/main/Dropdown';
import { useEffect, useState, useContext } from 'react';
import { getImageUrl } from '@shared/lib/image.ts';
import { ReactLogo } from '@shared/ui/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiContext from '@features/api-context';
import Pagination, { PageEntry, PageProps } from '@widgets/main/PagedList/pagination';
import {
  GetAllOrFilteredEventsFormatEnum,
  GetAllOrFilteredEventsStatusEnum,
  PlaceResponse,
} from '@shared/api/generated';
import { EventResponse } from '@shared/api/generated';
import PrivilegeContext from '@features/privilege-context';
import { hasAnyPrivilege } from '@features/privileges';
import { PrivilegeData } from '@entities/privilege-context';
import { PrivilegeNames } from '@shared/config/privileges';
import ImagePreview from '@widgets/main/ImagePreview';
import { eventService } from '@features/event-service';
import { placeService } from '@features/place-service';
import { appendClassName } from '@shared/util';

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
  excepted: boolean;
  onEntryClick: (id: number) => void;
};
const PageItemStub = (props: PageItemStubProps) => {
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    getImageUrl(props.index.toString()).then((url) => {
      setImageUrl(url);
    });
  }, []);
  const _event = (id: number) => {
    props.onEntryClick(id);
  };
  const _handleClick = () => {
    if (!props.excepted) _event(props.index);
  };
  return (
    <a
      key={props.index}
      onClick={_handleClick}
      className={appendClassName(styles.event_entry, props.excepted ? myStyles.excepted_event_on_copy : null)}
    >
      <p>{props.excepted ? 'E' : '_'}</p>
      {imageUrl == '' ? (
        <ReactLogo className={styles.event_icon} />
      ) : (
        <ImagePreview className={styles.event_icon} src={imageUrl} alt="Event Icon" />
      )}
      <div className={styles.event_info_column}>
        <div className={styles.event_name}>{'Event ' + props.index + ': ' + props.title}</div>
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

type StolenAndSimplifiedEventListProps = {
  onClick: (id: number) => void;
  exceptId: number;
};

function StolenEventListForTasksCopying(props: StolenAndSimplifiedEventListProps) {
  const { api } = useContext(ApiContext);
  const { privilegeContext } = useContext(PrivilegeContext);
  const [filters, setFilters] = useState(initialFilters);
  const [searchValue, setSearchValue] = useState('');

  const [pageProps, setPageProps] = useState<PageProps>({ page: 1, size: 5, total: 0 });
  const [itemList, setItemList] = useState<PageEntry[]>([]);

  const [_, setPrivilegeCreateEvent] = useState(false);

  useEffect(() => {
    if (privilegeContext.isSystemPrivilegesLoaded()) {
      const privileges = privilegeContext.systemPrivileges!;
      setPrivilegeCreateEvent(hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.CREATE_EVENT)])));
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
        filters.format
      );
      if (total === undefined || items === undefined) throw new Error('Incomplete data received from the server');
      const data = items as unknown as EventResponse[];
      const eventsWithPlaces: { event: EventResponse; place: PlaceResponse }[] = [];
      const pagesPromises = data.map(async (e) => {
        let address: string = '';
        if (e.placeId) {
          const place = await placeService.getPlace(api, e.placeId);
          eventsWithPlaces.push({ event: e, place: place });
          if (place)
            address = place.address !== undefined ? place.address + (place.room ? ', ауд. ' + place.room : '') : 'null';
        }
        return new PageEntry(() => {
          return (
            <PageItemStub
              key={e.id ? e.id : -1}
              index={e.id ? e.id : -1}
              title={e.title !== undefined ? e.title : 'null'}
              place={address}
              onEntryClick={props.onClick}
              excepted={!(e.id === undefined) && e.id! === props.exceptId}
            />
          );
        });
      });
      const pages = await Promise.all(pagesPromises);
      try {
        (document.getElementById('itmo-map-iframe') as HTMLIFrameElement)?.contentWindow?.postMessage(
          {
            type: 'eventsLists',
            events: eventsWithPlaces,
          },
          '*'
        );
        (document.getElementById('itmo-map-iframe') as HTMLIFrameElement).onload = () => {
          (document.getElementById('itmo-map-iframe') as HTMLIFrameElement)?.contentWindow?.postMessage(
            {
              type: 'eventsLists',
              events: eventsWithPlaces,
            },
            '*'
          );
        };
      } catch (_) {
        /* empty */
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
    <Content>
      <div className={styles.events_page}>
        <div className={styles.horizontal_bar}>
          <div className={styles.search}>
            <Search
              onSearch={(value) => _handleFilterChange(value, 'title')}
              placeholder="Поиск"
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
            />
          </div>
        </div>
        <div className={styles.filters}>
          <div className={styles.filter_group}>
            <DatePicker
              placeholderText="Начало проведения"
              className={styles.filter_element}
              onChange={(date) => _handleFilterChange(date ? date.toISOString() : '', 'startDate')}
              selected={!isBlank(filters.startDate) ? new Date(filters.startDate) : null}
              dateFormat="yyyy-MM-dd"
              popperPlacement="top-start"
              enableTabLoop={false}
            />
            <DatePicker
              placeholderText="Конец проведения"
              className={styles.filter_element}
              onChange={(date) => _handleFilterChange(date ? date.toISOString() : '', 'endDate')}
              selected={!isBlank(filters.endDate) ? new Date(filters.endDate) : null}
              dateFormat="yyyy-MM-dd"
              popperPlacement="top-start"
              enableTabLoop={false}
            />
            <div className={styles.dropdownfilter}>
              <Dropdown
                placeholder="Статус"
                items={eventStatusList}
                value={filters.status !== undefined ? filters.status : ''}
                onChange={(status) =>
                  _handleFilterChange(getEnumValueFromString(GetAllOrFilteredEventsStatusEnum, status), 'status')
                }
                onClear={() => _handleFilterChange('', 'status')}
                toText={(input: string) => {
                  return input;
                }}
              />
            </div>
            <div className={styles.dropdownfilter}>
              <Dropdown
                placeholder="Формат"
                items={eventFormatList}
                value={filters.format !== undefined ? filters.format : ''}
                onChange={(format) =>
                  _handleFilterChange(getEnumValueFromString(GetAllOrFilteredEventsFormatEnum, format), 'format')
                }
                onClear={() => _handleFilterChange('', 'format')}
                toText={(input: string) => {
                  return input;
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.event_list_container}>
          <Pagination
            pageProps={pageProps}
            onPageChange={(page, size) => getEventList(page, size)}
            items={itemList}
            pageSpread={1}
          />
        </div>
      </div>
    </Content>
  );
}

export default StolenEventListForTasksCopying;
