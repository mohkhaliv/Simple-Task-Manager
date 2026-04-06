export interface Task {
  id?: number;
  title: string;
  description?: string;
  done: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskRequest {
  title: string;
  description?: string;
  done?: boolean;
}
