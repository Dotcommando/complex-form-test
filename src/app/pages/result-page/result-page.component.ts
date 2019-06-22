import { Component, OnInit } from '@angular/core';
import { FormDataService } from '../../services/form-data.service';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.scss']
})
export class ResultPageComponent implements OnInit {

  constructor(private formDataService: FormDataService) {}

  ngOnInit() {
    this.formDataService.setShowResults(false);
  }
}
