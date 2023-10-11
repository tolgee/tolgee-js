import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  newItemValue: string;
  items: string[] = [];

  constructor() {}

  getInitialItems() {
    let items: string[] | undefined = undefined;
    try {
      items = JSON.parse(
        localStorage.getItem('tolgee-example-app-items') || ''
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        'Something went wrong while parsing stored items. Items are reset.'
      );
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('tolgee-example-app-items');
      }
    }
    return items?.length
      ? items
      : ['Passport', 'Maps and directions', 'Travel guide'];
  }

  ngOnInit(): void {
    try {
      this.items = this.getInitialItems();
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

  onAdd(event: Event) {
    event.preventDefault();
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
