import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormDataService } from '../../services/form-data.service';
import { IFormData } from '../../interfaces/form.interface';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.scss']
})
export class ResultPageComponent implements OnInit {

  data: IFormData;

  constructor(private formDataService: FormDataService) {}

  ngOnInit() {
    this.formDataService.setShowResults(false);
    this.data = this.formDataService.getData();
  }

  processMaritalStatus(status: string) {
    switch (status) {
      case 'married':
        return 'женат/замужем';
      case 'he-married':
        return 'женат';
      case 'she-married':
        return 'замужем';
      case 'divorced':
        return 'в разводе';
      case 'not-married':
        return 'нет семьи';
      default:
        return 'нет семьи';
    }
  }
}
