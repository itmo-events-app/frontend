import Dialog from "@widgets/main/Dialog";
import styles from "@pages/main/EventData/index.module.css";
import {useContext, useEffect, useState} from "react";
import ApiContext from "@features/api-context.ts";
import {
  TaskResponse
} from "@shared/api/generated";
import StolenEventListForTasksCopying from "@pages/main/EventData/StolenEventListForTasksCopying.tsx";
import {appendClassName} from "@shared/util.ts";
import Button from "@widgets/main/Button";

enum DialogTextVariants {
  EVENT_CHOOSING = "Копирование задач: выбор мероприятия",
  TASKS_CHOOSING = "Копирование задач: выбор задач",
}

class TaskEntry {
  task: TaskResponse;
  selected: boolean;

  constructor(task: TaskResponse, selected: boolean) {
    this.task = task;
    this.selected = selected;
  }
}

const TasksList = ({items, onClose, idInt} : {items: TaskResponse[], onClose: () => void, idInt: number}) => {
  const {api} = useContext(ApiContext);

  const [taskEntries, setTaskEntries] = useState<TaskEntry[]>(items.map(task => {
    return new TaskEntry(task, false);
  }))

  function _entryClick(entry: TaskEntry) {
    const newTaskEntries = taskEntries.map(e => {
      if (e === entry) e.selected = !e.selected;
      return e;
    })

    setTaskEntries(newTaskEntries)
  }

  function _renderTaskEntry(taskEntry: TaskEntry) {
    return(
      <div key={taskEntry.task.id}
           className={taskEntry.selected ? appendClassName(styles.copy_tasks_entry, styles.selected_task_for_copy) : styles.copy_tasks_entry}
           onClick={() => _entryClick(taskEntry)}>
        {taskEntry.task.title}
      </div>
    )
  }

  function _selectAll() {
    const newTaskEntries = taskEntries.map(te => {
      te.selected = true;
      return te;
    })
    setTaskEntries(newTaskEntries)
  }

  function _unselectAll() {
    const newTaskEntries = taskEntries.map(te => {
      te.selected = false;
      return te;
    })
    setTaskEntries(newTaskEntries)
  }

  function copyTasksAndClose() {
    const ids = taskEntries
      .filter(te => te.selected)
      .map(te => te.task.id!)

    console.log(idInt, ids)
    api.task.taskListCopy(idInt, ids)

    onClose();
    // location.reload()
  }

  return(
    <div>
      {taskEntries.map(entry => _renderTaskEntry(entry))}

      <Button style={{marginRight: "10px"}} onClick={_selectAll}>Выделить все</Button>
      <Button style={{marginRight: "10px"}} onClick={_unselectAll}>Очистить</Button>
      <Button style={{marginRight: "10px"}} onClick={copyTasksAndClose}>Скопировать выбранные</Button>
    </div>
  )
}

const CopyTasksDialog = ({onClose, idInt}: { onClose: () => void, idInt: number | null }) => {
  const {api} = useContext(ApiContext);
  const [chosenEventId, setChosenEventId] = useState<number | undefined>(undefined)
  const [dialogText, setDialogText] = useState(DialogTextVariants.EVENT_CHOOSING)
  const [tasksToChooseFrom, setTasksToChooseFrom] = useState<TaskResponse[] | undefined>(undefined)

  useEffect(() => {
    if (chosenEventId === undefined) {
      setDialogText(DialogTextVariants.EVENT_CHOOSING);
      return;
    }

    setDialogText(DialogTextVariants.TASKS_CHOOSING)
    api.task.taskListShowInEvent(chosenEventId)
      .then(result => {
        setTasksToChooseFrom(result.data)
      })
  }, [chosenEventId]);

  return (
    <div className={styles.dialog_task} onClick={onClose}>
      <Dialog className={styles.dialog_content_task} text={dialogText}>
        <div onClick={e => e.stopPropagation()}>

          {chosenEventId === undefined &&
          <StolenEventListForTasksCopying onClick={(id:number) => {
            if(id == idInt) {
              alert("Нельзя скопировать с текущего мероприятия!")
              return;
            }

            setChosenEventId(id)
          }}/>
          }

          {chosenEventId !== undefined && tasksToChooseFrom !== undefined &&
          <TasksList items={tasksToChooseFrom} onClose={onClose} idInt={idInt!}/>
          }

        </div>
      </Dialog>
    </div>
  )
};

export default CopyTasksDialog;
