import {
  ComponentRef,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  Injector,
  Type,
} from '@angular/core';
import { LoaderComponent } from "./loader.component";

export type View = string | TemplateRef<unknown> | Type<unknown>;

export class TemplateHandler {
  private injector: Injector;

  constructor(private view: View, private vcr: ViewContainerRef) {
    this.injector = this.vcr.injector;
  }

  attachView() {
    if (this.view instanceof TemplateRef) {
      this.vcr.createEmbeddedView(this.view);
    } else if (typeof this.view === 'string') {
      const componentRef = this.createComponent<LoaderComponent>(
        LoaderComponent
      );
      componentRef.instance.html = this.view;
      componentRef.hostView.detectChanges();
    } else {
      this.createComponent(this.view);
    }
  }

  detachView() {
    this.vcr.clear();
  }

  private createComponent<T>(cmp: Type<T>): ComponentRef<T> {
    const cfr = this.injector.get(ComponentFactoryResolver);
    const factory = cfr.resolveComponentFactory(cmp);

    return this.vcr.createComponent(factory);
  }
}
