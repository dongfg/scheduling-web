export interface ScheduleTask {
  id?: number;
  name: string;
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
