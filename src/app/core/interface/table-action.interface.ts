import { Task } from "./task.interface";
import { TaskAction } from "../enum/task-action.enum";

export interface TableActionEvent {
  action: TaskAction;
  item: Task;
}
