export enum TaskStatus {
  PENDING = "PENDING",
  CANCEL = "CANCEL",
  COMPLETED = "COMPLETED",
}

export interface Task {
  id?: string;
  title: string;
  description: string;
  date: string;
  status: TaskStatus;
  userId?: string;
}

export interface TaskResponse {
  message: string;
  tasks?: Task[];
}
