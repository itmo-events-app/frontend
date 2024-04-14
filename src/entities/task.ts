export type Task = {
  id: number;
  eventId: number;
  title: string;
  description: string;
  taskStatus: string;
  assignee: Assignee;
  place: Place;
  creationDate: string;
  deadline: string;
};

export type Assignee = {
  id: number;
  name: string;
  surname: string;
};

export type Place = {
  id: number;
  name: string;
  address: string;
};
