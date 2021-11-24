import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@tolgee/ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-translation-methods',
  templateUrl: './translation-methods.component.html',
})
export class TranslationMethodsComponent implements OnInit, OnDestroy {
  translatedWithoutParamsValue: string;
  translatedWithDefaultValue: string;
  translatedWithParamsValue: string;

  translatedWithoutParamsValueSubscription: Subscription;
  translatedWithDefaultValueSubscription: Subscription;
  translatedWithParamsValueSubscription: Subscription;

  translatedSafeWithoutParamsValue: string;
  translatedSafeWithDefaultValue: string;
  translatedSafeWithParamsValue: string;

  translatedSafeWithoutParamsValueSubscription: Subscription;
  translatedSafeWithDefaultValueSubscription: Subscription;
  translatedSafeWithParamsValueSubscription: Subscription;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translatedWithoutParamsValueSubscription = this.translateService
      .get('this_is_a_key')
      .subscribe((val) => (this.translatedWithoutParamsValue = val));

    this.translatedWithDefaultValueSubscription = this.translateService
      .get('this_key_does_not_exist', undefined, 'This is default')
      .subscribe((val) => (this.translatedWithDefaultValue = val));

    this.translatedWithParamsValueSubscription = this.translateService
      .get('this_is_a_key_with_params', { key: 'value', key2: 'value2' })
      .subscribe((val) => (this.translatedWithParamsValue = val));

    this.translatedSafeWithoutParamsValueSubscription = this.translateService
      .getSafe('this_is_a_key')
      .subscribe((val) => (this.translatedSafeWithoutParamsValue = val));

    this.translatedSafeWithDefaultValueSubscription = this.translateService
      .getSafe('this_key_does_not_exist', undefined, 'This is default')
      .subscribe((val) => (this.translatedSafeWithDefaultValue = val));

    this.translatedSafeWithParamsValueSubscription = this.translateService
      .getSafe('this_is_a_key_with_params', { key: 'value', key2: 'value2' })
      .subscribe((val) => (this.translatedSafeWithParamsValue = val));
  }

  ngOnDestroy(): void {
    this.translatedWithoutParamsValueSubscription.unsubscribe();
    this.translatedWithDefaultValueSubscription.unsubscribe();
    this.translatedWithParamsValueSubscription.unsubscribe();
    this.translatedSafeWithoutParamsValueSubscription.unsubscribe();
    this.translatedSafeWithDefaultValueSubscription.unsubscribe();
    this.translatedSafeWithParamsValueSubscription.unsubscribe();
  }
}
