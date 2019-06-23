import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FormDataService } from '../../services/form-data.service';
import { IForm } from '../../interfaces/form.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class FormPageComponent implements OnInit, OnDestroy {
  form: FormGroup;

  dateSubscription: Subscription;
  genderSubscription: Subscription;

  maritalStatuses = [];

  submitIsLocked = false;

  lockSubmitCountdown;

  submitCounter = 1;

  successSubmittedCountdown;

  successSubmitted = false;

  /**
   * Возвращает статус семйного положения.
   * Возможные статусы:
   *   '' - значение по умолчанию.
   *   'divorced' - в разводе.
   *   'not-married' - нет семьи.
   *   'married' - женат/замужем, когда не знаем пола.
   *   'he-married' - женат.
   *   'she-married' - замужем.
   */
  getMaritalStatuses() {
    let statuses = [
      {value: 'divorced', text: 'В разводе'},
      {value: 'not-married', text: 'Нет'},
    ];

    if (!this.form) {
      statuses = [{value: 'married', text: 'Женат/Замужем'}, ...statuses];
      return statuses;
    }

    const gender = this.form.get('gender').value;

    if (gender === 'm') {
      statuses = [{value: 'he-married', text: 'Женат'}, ...statuses];
    } else if (gender === 'f') {
      statuses = [{value: 'she-married', text: 'Замужем'}, ...statuses];
    }

    return statuses;
  }

  constructor(
    private formBuilder: FormBuilder,
    private adapter: DateAdapter<any>,
    private router: Router,
    public formDataService: FormDataService
  ) {
    this.adapter.setLocale('ru');
    this.maritalStatuses = this.getMaritalStatuses();
  }

  ngOnInit() {
    const group: IForm = {
      fullname: ['', [
        Validators.required,
        Validators.pattern(/[а-яА-ЯёЁ\-]+[\s]{1}[а-яА-ЯёЁ]+$/)
      ]],
      gender: ['', [
        Validators.required
      ]],
      birthday: ['', [
        Validators.required
      ]],
      kids: ['0', [
        Validators.min(0),
        Validators.max(64)
      ]],
      email: ['', [
        Validators.required,
        // tslint:disable-next-line:max-line-length
        Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/)
      ]],
      comment: ['', [
        Validators.pattern(/^[?!,.а-яА-ЯёЁ0-9\s]+$/)
      ]],
      maritalStatus: ['', []]
    };

    this.form = this.formBuilder.group(group);

    this.subscribeToDateChanging();

    this.subscribeToGenderChanging();

    // this.form
    //   .valueChanges
    //   .subscribe((e) => {
    //     console.log(this.form.valid)
    //     console.log(e);
    //   });
  }

  ngOnDestroy() {
    this.dateSubscription.unsubscribe();
    this.genderSubscription.unsubscribe();
    clearTimeout(this.lockSubmitCountdown);
    clearTimeout(this.successSubmittedCountdown);
  }

  /**
   * Подписка на изменение даты рождения.
   */
  private subscribeToDateChanging() {
    this.dateSubscription = this.form.get('birthday')
      .valueChanges
      .subscribe((value) => {
        this.setRequiredValidatorToMaritalStatus(moment().diff(value, 'years') >= 18);
        // После выбора даты рождения принудительно сбрасываем семейное положение.
        this.form.get('maritalStatus').setValue('');
        // console.log('Лет', moment().diff(value, 'years'));
      });
  }

  /**
   * Подписка на изменение пола.
   * Чтобы когда надо поменять семейное положение
   * 'Женат/Замужем' на 'Женат' или 'Замужем'.
   */
  private subscribeToGenderChanging() {
    this.genderSubscription = this.form.get('gender')
      .valueChanges
      .subscribe(() => {
        const married = this.form.get('maritalStatus').value;
        if (!['', 'divorce', 'not-married'].includes(married)) {
          this.correctStatus();
        }
        this.maritalStatuses = this.getMaritalStatuses();
      });
  }

  /**
   * Устанавливаем дополнительный валидатор на поле "Семейное положение"
   * или убираем таковой, если ещё нет 18 лет.
   * @param set - установить или убрать валидатор.
   */
  private setRequiredValidatorToMaritalStatus(set: boolean = true) {
    const maritalStatus = this.form.get('maritalStatus');
    const validators: ValidatorFn[] = [ Validators.required ];

    if (set) {
      maritalStatus.setValidators(validators);
    } else {
      maritalStatus.clearValidators();
    }
    maritalStatus.updateValueAndValidity();
  }

  /**
   * Если у юзера не был выбран пол, но было установлено семейное положение
   * в значение "Женат/Замужем", то теперь, когда мы знаем пол, меняем
   * семейное положение на конкретное: или "женат", или "замужем".
   */
  correctStatus() {
    const gender = this.form.get('gender').value;
    const maritalStatus = this.form.get('maritalStatus');

    if (gender === 'm') {
      if (['she-married', 'married'].includes(maritalStatus.value)) {
        maritalStatus.setValue('he-married');
      }
    } else if (gender === 'f') {
      if (['he-married', 'married'].includes(maritalStatus.value)) {
        maritalStatus.setValue('she-married');
      }
    }
  }

  /**
   * Ставим ограничение на возможные даты рождения.
   * С 01.01.1930 по текущую дату.
   * @param d - дата
   */
  birthdayPickerFilter = (d: Date): boolean => {
    const checkingDate = moment(d);
    const minimumDate = moment('01.01.1930', 'MM.DD.YYYY');
    const today = moment();
    return !(checkingDate.isBefore(minimumDate) || checkingDate.isAfter(today));
  }

  /**
   * Чекаем все поля, чтобы отработал валидатор.
   * @param formGroup - форма
   */
  private markFormGroupTouched(formGroup: FormGroup | AbstractControl) {
    if (!('controls' in formGroup)) { return; }
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ('controls' in control) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Обрабатываем нажатия клавиш "+" и "-" на поле "Дети".
   * @param event - keyboardEvent
   */
  kidsNumberInput(event): boolean {
    const key = event.key;
    const kids = this.form.get('kids');
    if (/[%\/^*=.]/.test(key)) {
      return false;
    } else if (/[+-]/.test(key)) {
      if (isNaN(kids.value)) { return false; }
      kids.setValue(key === '+' ? parseInt(kids.value, 10) + 1 :  parseInt(kids.value, 10) - 1);
      return false;
    }
    return true;
  }

  /**
   * Лочим кнопку отправки на 10 сек.
   */
  private lockSubmit() {
    this.submitIsLocked = true;
    this.lockSubmitCountdown = setTimeout(() => {
      this.submitIsLocked = false;
    }, 10000);
  }

  submit() {
    this.markFormGroupTouched(this.form);
    if (this.form.invalid) {
      // Форма не валидна
      this.lockSubmit();
      if (this.submitCounter === 3) {
        this.submitCounter = 0;
        this.form.reset();
      }
      this.submitCounter++;
    } else {
      // Форма валидна
      this.submitCounter = 1;
      this.formDataService.sendData(this.form.value);
      this.formDataService.setShowResults(true);
      this.successSubmitted = true;
      this.successSubmittedCountdown = setTimeout(() => {
        this.successSubmitted = false;
        try {
          this.router.navigate(['/result']);
        } catch (err) {
          console.log('Router failed.');
        }
      }, 1500);
    }
  }
}
