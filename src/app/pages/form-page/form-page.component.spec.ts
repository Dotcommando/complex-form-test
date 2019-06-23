import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FormDataService } from '../../services/form-data.service';
import * as moment from 'moment';

import { FormPageComponent } from './form-page.component';

class RouterStub {
  navigateByUrl = jasmine.createSpy('navigateByUrl');
}

describe('Юнит тест реактивной формы в FormPageComponent', () => {
  let component: FormPageComponent;
  let fixture: ComponentFixture<FormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatDatepickerModule,
        MatSelectModule,
        MatButtonModule
      ],
      declarations: [ FormPageComponent ],
      providers: [{ provide: Router, useClass: RouterStub }, FormDataService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('Проверка существования компонента', () => {
    expect(component).toBeTruthy();
  });

  it('При создании форма не валидна', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('Нелинейное заполнение формы: форма валидна', () => {
    const form = component.form;
    const fullname = form.controls.fullname;
    const gender = form.controls.gender;
    const email = form.controls.email;
    const birthday = form.controls.birthday;
    const maritalStatus = form.controls.maritalStatus;

    fullname.setValue('Иванов Иван');
    gender.setValue('m');
    email.setValue('ivanov.ivan@gmail.com');
    birthday.setValue(moment('28.07.1959', 'DD.MM.YYYY'));
    maritalStatus.setValue('he-married');
    birthday.setValue(moment('28.07.2017', 'DD.MM.YYYY'));

    expect(form.valid).toBeTruthy();
  });

  it('Нелинейное заполнение: кнопка отправки активна', () => {
    const form = component.form;
    const fullname = form.controls.fullname;
    const gender = form.controls.gender;
    const email = form.controls.email;
    const birthday = form.controls.birthday;
    const maritalStatus = form.controls.maritalStatus;
    const submitButton = fixture.debugElement.query(By.css('button[type=submit]'));

    fullname.setValue('Иванов Иван');
    gender.setValue('m');
    email.setValue('ivanov.ivan@gmail.com');
    birthday.setValue(moment('28.07.1959', 'DD.MM.YYYY'));
    maritalStatus.setValue('he-married');
    birthday.setValue(moment('28.07.2017', 'DD.MM.YYYY'));

    console.log(submitButton.nativeElement);

    expect(submitButton.nativeElement.disabled).toBeFalsy();
  });

  it('Нелинейное заполнение: нажатие кнопки срабатывает', () => {
    const form = component.form;
    const fullname = form.controls.fullname;
    const gender = form.controls.gender;
    const email = form.controls.email;
    const birthday = form.controls.birthday;
    const maritalStatus = form.controls.maritalStatus;
    const submitButton = fixture.debugElement.query(By.css('button[type=submit]'));
    const formDataService = component.formDataService;

    fullname.setValue('Иванов Иван');
    gender.setValue('m');
    email.setValue('ivanov.ivan@gmail.com');
    birthday.setValue(moment('28.07.1959', 'DD.MM.YYYY'));
    maritalStatus.setValue('he-married');
    birthday.setValue(moment('28.07.2017', 'DD.MM.YYYY'));

    submitButton.nativeElement.click();

    expect(formDataService.getData()).toBeTruthy();
  });

  it('Нелинейное заполнение: семейное положение в сервисе имеет значение по умолчанию', () => {
    const form = component.form;
    const fullname = form.controls.fullname;
    const gender = form.controls.gender;
    const email = form.controls.email;
    const birthday = form.controls.birthday;
    const maritalStatus = form.controls.maritalStatus;
    const submitButton = fixture.debugElement.query(By.css('button[type=submit]'));
    const formDataService = component.formDataService;

    fullname.setValue('Иванов Иван');
    gender.setValue('m');
    email.setValue('ivanov.ivan@gmail.com');
    birthday.setValue(moment('28.07.1959', 'DD.MM.YYYY'));
    maritalStatus.setValue('he-married');
    birthday.setValue(moment('28.07.2017', 'DD.MM.YYYY'));

    submitButton.nativeElement.click();

    const submittedData = formDataService.getData();

    expect(submittedData.maritalStatus === '').toBeTruthy();
  });
});
