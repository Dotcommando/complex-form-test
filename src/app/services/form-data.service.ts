import { Injectable } from '@angular/core';
import { IFormData } from '../interfaces/form.interface';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  private showResults = false;

  private data: IFormData;

  public setShowResults(value: boolean) {
    this.showResults = value;
  }

  public getShowResults(): boolean {
    return this.showResults;
  }

  public sendData(data: IFormData) {
    this.data = data;
  }

  public getData(): IFormData {
    return this.data;
  }

  constructor() { }
}
