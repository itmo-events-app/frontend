import { useContext, useEffect, useState } from "react";
import ApiContext from "@features/api-context.ts";
import { DropdownOption } from "@widgets/main/Dropdown";
import { PlaceRequestFormatEnum } from "@shared/api/generated";
import { placeService } from "@features/place-service.ts";
import styles from "@pages/main/PlaceListPage/index.module.css";
import Dialog from "@widgets/main/Dialog";
import Label from "@widgets/auth/InputLabel";
import Input from "@widgets/main/Input";
import Button from "@widgets/main/Button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type EditPlaceFormValues = {
  format: DropdownOption<string>;
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  roomName: string;
};

const UpdatePlaceDialog = ({ onClose, id }: { onClose: () => void, id: number }) => {
  const { api } = useContext(ApiContext);
  const placeFormat: DropdownOption<string>[] = [
    new DropdownOption("Онлайн"),
    new DropdownOption("Офлайн"),
    new DropdownOption("Гибрид"),
  ];
  const formatEnum: Record<string, PlaceRequestFormatEnum> = {
    "Онлайн": PlaceRequestFormatEnum.Online,
    "Офлайн": PlaceRequestFormatEnum.Offline,
    "Гибрид": PlaceRequestFormatEnum.Hybrid,
  };

  const formatTranslate: Record<string, string> = {
    "ONLINE": "Онлайн",
    "OFFLINE": "Офлайн",
    "HYBRID": "Гибрид",
  };

  const { data: foundPlace } = useQuery({ queryFn: () => placeService.getPlace(api, id), queryKey: ["getPlace"] });

  const { mutate: updatePlace } = useMutation({
    mutationFn: placeService.updatePlace,
    onSuccess: () => {
      invalidatePlaces();
    },
  });

  const queryClient = useQueryClient();

  const invalidatePlaces = () => {
    queryClient.invalidateQueries({ queryKey: ["getPlaces"] });
  };

  const handleMapClick = (message: any) => {
    const childWindow = document.querySelector("iframe")?.contentWindow;
    if (message.source !== childWindow) return;
    setValue("address", message.data.address);
    setValue("roomName", message.data.properties["ref"]);
    setValue("latitude", message.data.coordinates[0]);
    setValue("longitude", message.data.coordinates[1]);
  };
  useEffect(() => {
    window.addEventListener("message", handleMapClick);
  });

  useEffect(() => {
    if (foundPlace) {
      const { name, address, longitude, latitude, description, format, room } = foundPlace;
      setValue("name", String(name));
      setValue("address", String(address));
      setValue("description", String(description));
      setValue("longitude", Number(longitude));
      setValue("latitude", Number(latitude));
      setValue("roomName", String(room));
      if (format) {
        console.log(format);
        const selectedDropdownOption = placeFormat.find(el => el.value === formatTranslate[format]);
        if (selectedDropdownOption) {
          setValue("format", selectedDropdownOption);
        }
      }
    }
  }, [foundPlace]);

  const { control, handleSubmit, setValue } = useForm<EditPlaceFormValues>();

  const [showEmptyFieldsMessage, setShowEmptyFieldsMessage] = useState(false);

  const onSubmit: SubmitHandler<EditPlaceFormValues> = async (values) => {
    const { name, address, roomName, format, longitude, latitude, description } = values;
    if (!name || !address || !roomName || !description) {
      setShowEmptyFieldsMessage(true);
      return;
    }

    updatePlace({
      api,
      id,
      name,
      description,
      latitude,
      longitude,
      format: formatEnum[format.value],
      address,
      room: roomName,
    });
    onClose();
  };

  return (
    <div className={styles.dialog} onClick={onClose}>
      <Dialog className={styles.dialog_content} text={"Редактирование площадки"}>
        <div onClick={e => e.stopPropagation()}>
          <form className={styles.place_form} onSubmit={handleSubmit(onSubmit)}>
            <Controller control={control} name={"name"}
              render={({ field: { value, onChange } }) => (
                <div className={styles.place_form_item}>
                  <Label value="Название" />
                  <Input type="text" placeholder={"Название"} value={value}
                    onChange={(event) => onChange(event.target.value)} />
                </div>
              )}>
            </Controller>

            <Controller control={control} name={"description"} render={({ field: { value, onChange } }) => (
              <div className={styles.place_form_item}>
                <Label value="Описание площадки" />
                <Input type="text" placeholder={"Описание"} value={value}
                  onChange={(event) => onChange(event.target.value)} />
              </div>
            )} />


            <div className={styles.form__row}>
              <Controller control={control} render={({ field: { value, onChange } }) => (
                <div className={styles.place_form_item}>
                  <Label value="Адрес" />
                  <Input type="text" placeholder={"Адрес"} value={value}
                    onChange={(event) => onChange(event.target.value)} />
                </div>
              )} name={"address"} />

              <Controller control={control} name={"roomName"} render={({ field: { value, onChange } }) => (
                <div className={styles.place_form_item}>
                  <Label value="Аудитория" />
                  <Input type="text" placeholder={"Можно выбрать на карте"} value={value}
                    onChange={
                      (event) => {
                        onChange(event.target.value);
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        document.getElementById("itmo-map-iframe")?.contentWindow.postMessage({
                          type: "roomHighlight",
                          room: event.target.value,
                        }, "*");
                      }
                    } />
                </div>
              )}
              />
            </div>
            <Controller control={control} name={"latitude"} render={({ field: { value, onChange } }) => (
              <div className={styles.place_form_item2}>
                {/*<Label value="Долгота" />*/}
                <Input hidden={true}
                  // type="number"
                  placeholder={"Долгота"}
                  value={String(value)}
                  onChange={(event) => {
                    onChange(Number(event.target.value));
                  }}
                  min={-180}
                  max={180}
                />
              </div>
            )} />

            <Controller control={control} name={"longitude"} render={({ field: { value, onChange } }) => (
              <div className={styles.place_form_item2}>
                {/*<Label value="Широта" />*/}
                <Input hidden={true}
                  // type="number"
                  placeholder={"Широта"}
                  value={String(value)}
                  onChange={
                    (event) => onChange(Number(event.target.value))
                  }
                  min={-90}
                  max={90}
                />
              </div>
            )} />
            <iframe id="itmo-map-iframe" src={(window as any).ENV_GEO_URL + "/map.html?noscroll&select_only_areas"}
              width="100%" height="420px"></iframe>
            <div className={styles.place_form_button}>
              <Button type="submit">Обновить</Button>
            </div>
            {showEmptyFieldsMessage &&
              <span className={styles.emptyFieldsMessage}>Пожалуйста, заполните все поля</span>}
          </form>
        </div>
      </Dialog>

    </div>
  );
};

export default UpdatePlaceDialog;
