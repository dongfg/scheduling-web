export interface ScheduleTask {
  id?: number;
  name: string;
  group: string;
  status: string;
  cron: string;
  startTime: string;
  endTime: string;
  httpMethod: string;
  httpURL: string;
  httpRequest: string;
  request: HttpRequest;
  createTime: string;
  updateTime: string;
}

export interface HttpRequest {
  url: string;
  method: string;
  headers: any;
  parameters: any;
  body: string;
}

export interface ScheduleTaskLog {
  id?: number;
  taskId: number;
  name: string;
  timeCost: number;
  httpRequest: string;
  responseStatus?: string;
  responseHeaders?: string;
  responseBody?: string;
  errorMessage?: string;
  createTime: string;
}
