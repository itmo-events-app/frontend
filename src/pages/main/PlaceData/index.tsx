
import styles from './index.module.css'
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import SideBar from '@widgets/main/SideBar';
import Content from "@widgets/main/Content";
import { RoutePaths } from '@shared/config/routes';
import Button from "@widgets/main/Button";


class PlaceInfo {

  name: string
  address: string
  format: string
  auditory?: string
  coordinates: string
  description: string

  constructor(
    name: string,
    address: string,
    format: string,
    auditory: string,
    coordinates: string,
    description: string
  ) {
    this.name = name;
    this.address = address;
    this.format = format;
    this.auditory = auditory;
    this.coordinates= coordinates;
    this.description = description;
  }
}

const _placeInfo: PlaceInfo = new PlaceInfo(
  "Площадка корпус ИТМО Ломоноссова",
  "улица Ломоноссова, д. 9",
  "Очная",
  "3210",
  "59.927209,30.338281",
  "Корпус на Ломоносова 9 - это современное здание, сочетающее в себе функциональность и эстетику. Его стильный дизайн и удобная планировка делают его идеальным местом для учебы и научной работы. Внутри корпуса есть современно оборудованные аудитории, лаборатории, офисы преподавателей и администрации, а также уютные зоны отдыха для студентов. Благодаря своему удобному расположению и хорошей инфраструктуре, корпус на Ломоносова 9 стал центром академической жизни университета ИТМО.",
);

const edit_privilege: boolean = false;


function PlaceDataPage() {


  const _editPlace = () => {
    console.log('editing place')
  }

  function _createInfoPage(placeInfo: PlaceInfo) {
    return (
      <div className={styles.root}>
        
        {edit_privilege ? (
          <div className={styles.button_container}>
            <Button className={styles.button} onClick={_editPlace}>Редактировать</Button>
          </div>
        ) : <></>}
        <div className={styles.info_page}>
          <table className={styles.table}>
            <tbody>
            <tr>
              <td>Адрес:</td>
              <td>{placeInfo.address}</td>
            </tr>
            <tr>
              <td>Формат:</td>
              <td>{placeInfo.format}</td>
            </tr>
            <tr>
              <td>Аудитория:</td>
              <td>{placeInfo.auditory}</td>
            </tr>
            <tr>
              <td>Координаты:</td>
              <td>{placeInfo.coordinates}</td>
            </tr>
            </tbody>
          </table>
          <div className={styles.info_column}>
              <div className={styles.field_title}>
                Описание:
              </div>
              {placeInfo.description}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={
        <div className={styles.header}>
          <PageName text={_placeInfo.name} />
        </div>
      }
      bottomLeft={<SideBar currentPageURL={RoutePaths.placeData} />}
      bottomRight=
      {
        <Content>
          <div className={styles.content}>
            { _createInfoPage(_placeInfo)}
          </div>
        </Content>
      }
    />
  );
}
export default PlaceDataPage;
