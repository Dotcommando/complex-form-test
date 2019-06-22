import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  private showResults = false;

  public setShowResults(value: boolean) {
    this.showResults = value;
  }

  public getShowResults(): boolean {
    return this.showResults;
  }

  constructor() { }
}
