import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  newItemValue: string;
  items: string[] = [];

  constructor() {}

  ngOnInit(): void {
    try {
      this.items = JSON.parse(
        localStorage.getItem('tolgee-example-app-items')
      ) || ['Flame-thrower', 'Horse', 'My favourite toothbrush'];
    } catch (e) {
      // when local storage is not set due to SSR, don't pring any error
      if (typeof localStorage !== 'undefined') {
        /* eslint-disable no-console */
        console.error(
          'Something went wrong while parsing stored items. Items are reset.'
        );
        localStorage.removeItem('tolgee-example-app-items');
      }
    }
  }

  onAdd() {
    if (this.newItemValue) {
      this.items = [...this.items, this.newItemValue];
      this.updateLocalStorage();
      this.newItemValue = '';
    }
  }

  onDelete(index) {
    this.items.splice(index, 1);
    this.items = [...this.items];
    this.updateLocalStorage();
  }

  onAction(action: string) {
    alert('action: ' + action);
  }

  private updateLocalStorage = () =>
    localStorage.setItem(
      'tolgee-example-app-items',
      JSON.stringify(this.items)
    );
}
