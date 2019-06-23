import { Moment } from 'moment';

export interface IForm {
  fullname: { [key: string]: any };
  gender: { [key: string]: any };
  birthday: { [key: string]: any };
  maritalStatus: { [key: string]: any };
  kids: { [key: string]: any };
  email: { [key: string]: any };
  comment: { [key: string]: any };
}

export interface IFormData {
  fullname: string;
  gender: string;
  birthday: Moment;
  maritalStatus: string;
  kids: string | number;
  email: string;
  comment: string;
}

