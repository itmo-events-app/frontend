import BrandLogo from "@widgets/main/BrandLogo";
import Layout from "@widgets/main/Layout";
import PageName from "@widgets/main/PageName";
import styles from "./index.module.css";
import SideBar from "@widgets/main/SideBar";
import { RoutePaths } from "@shared/config/routes.ts";
import Content from "@widgets/main/Content";
import { useContext, useEffect } from "react";
import ApiContext from "@features/api-context.ts";
import { useQuery } from "@tanstack/react-query";
import { placeService } from "@features/place-service.ts";
import { useNavigate, useParams } from "react-router-dom";

function PlaceDataPage() {
  const { api } = useContext(ApiContext);

  const { place_id: placeId } = useParams();
  const navigate = useNavigate();

  const { data: foundPlace, failureReason } = useQuery({
    queryFn: () => placeService.getPlace(api, Number(placeId)),
    enabled: placeId !== undefined,
    queryKey: ["getPlace"],

  });

  useEffect(() => {
    if(!failureReason) return;
    if ((failureReason as any)?.response.status === 404) {
      navigate(RoutePaths.notFound);
      return;
    }
  }, [failureReason])

  useEffect(() => {
    if (!foundPlace) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    document.getElementById("itmo-map-iframe").onload = () => {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        document.getElementById("itmo-map-iframe")?.contentWindow.postMessage({
          type: "showMarker", place: foundPlace,
        }, "*");
      }, 0);
    };
  }, [foundPlace]);

  const formatTranslation: Record<string, string> = {
    ONLINE: "Онлайн",
    OFFLINE: "Офлайн",
    HYBRID: "Гибрид",
  };

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={
        <div className={styles.header}>
          <PageName text={String(foundPlace?.name)} />
        </div>
      }
      bottomLeft={<SideBar currentPageURL={RoutePaths.placeData} />}
      bottomRight={
        <Content>
          <div className={styles.place_data}>
            <div className={styles.place_data_list}>
              <div className={styles.place_column}>
                <div className={styles.label}>Адрес:</div>
                <div className={styles.label}>Формат:</div>
                <div className={styles.label}>Аудитория:</div>
                <div className={styles.label}>Координаты:</div>
              </div>
              <div className={styles.place_column}>
                <div className={styles.data}>{foundPlace?.address ?? ""}</div>
                <div className={styles.data}>
                  {foundPlace == undefined ? "Неопределен" : formatTranslation[foundPlace!.format!]}
                </div>
                <div className={styles.data}>{foundPlace?.room}</div>
                <div className={styles.data}>{`${foundPlace?.latitude ?? 0}, ${foundPlace?.longitude ?? 0}`}</div>
              </div>
            </div>
            <div className={styles.place_description}>
              <div className={styles.label}>Описание:</div>
              <div className={styles.data}>{foundPlace?.description}</div>
            </div>
          </div>
          <div className={styles.label}>Карта:</div>
          <iframe id="itmo-map-iframe" src={(window as any).ENV_GEO_URL + "/map.html?fullscreen"} width="100%"
                  height="420px" allow="fullscreen"></iframe>
        </Content>
      }
    />
  );
}

export default PlaceDataPage;
