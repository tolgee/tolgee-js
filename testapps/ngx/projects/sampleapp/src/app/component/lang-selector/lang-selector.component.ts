import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@tolgee/ngx';

@Component({
  selector: 'app-lang-selector',
  templateUrl: './lang-selector.component.html',
})
export class LangSelectorComponent implements OnInit {
  constructor(public translateService: TranslateService) {}

  ngOnInit(): void {}
}
