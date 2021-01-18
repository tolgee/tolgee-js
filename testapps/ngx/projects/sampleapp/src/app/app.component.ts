import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@polygloat/ngx";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private translateService: TranslateService) {

  }

  text1: string;

  async ngOnInit(): Promise<void> {
    this.translateService.get('sampleApp.this_is_translation_retrieved_by_service').subscribe(r => this.text1);
  }

  setLang(lang: string) {
    this.translateService.setLang(lang);
  }

  params = {name: "Honza", surname: "Cizmar"};

}
