import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../component/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { TDirective, TranslatePipe } from '@tolgee/ngx';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  imports: [
    RouterLink,
    NavbarComponent,
    FormsModule,
    TDirective,
    TranslatePipe,
    NgOptimizedImage,
  ],
})
export class IndexComponent implements OnInit {
  newItemValue: string;
  items: string[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  getInitialItems() {
    let items: string[] | undefined = undefined;
    if (!isPlatformBrowser(this.platformId)) {
      return ['Passport', 'Maps and directions', 'Travel guide'];
    }
    try {
      items = JSON.parse(
        localStorage.getItem('tolgee-example-app-items') || ''
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        'Something went wrong while parsing stored items. Items are reset.'
      );
      localStorage.removeItem('tolgee-example-app-items');
    }
    return items?.length
      ? items
      : ['Passport', 'Maps and directions', 'Travel guide'];
  }

  ngOnInit(): void {
    this.items = this.getInitialItems();
  }

  onAdd(event: Event) {
    event.preventDefault();
    if (this.newItemValue) {
      this.items = [...this.items, this.newItemValue];
      this.updateLocalStorage();
      this.newItemValue = '';
    }
  }

  onDelete(index: number) {
    this.items.splice(index, 1);
    this.items = [...this.items];
    this.updateLocalStorage();
  }

  onAction(action: string) {
    alert('action: ' + action);
  }

  private updateLocalStorage = () => {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem(
      'tolgee-example-app-items',
      JSON.stringify(this.items)
    );
  };
}
