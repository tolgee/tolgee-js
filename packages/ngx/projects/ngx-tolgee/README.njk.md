{% import "../../../../readmeMacros/macros.njk.md" as macros %}
{{ macros.header('Tolgee for Angular', 'The Tolgee i18n SDK for Angular', packageName) }}

# What's Tolgee for Angular?
Angular integration library of Tolgee. With this package. It's super simple to add i18n to your Angular app!
For more information about using Tolgee with Angular, visit the [docs 📖](https://tolgee.io/integrations/angular).

{{ macros.integrationLinks('Tolgee for Angular docs', macros.v5link('integrations/angular/installation')) }}

{{ macros.installation('ngx') }}

Then use the library in your `app.module.ts`. You have to add `NgxTolgeeModule` to your imports section and
add factory provider for `TOLGEE_INSTANCE` token returning your Tolgee instance.

```typescript
...
import {
  DevTools,
  NgxTolgeeModule,
  Tolgee,
  TOLGEE_INSTANCE,
  FormatSimple
} from '@tolgee/ngx';
...
@NgModule({
  declarations: [
    ...
  ],
  imports: [
    NgxTolgeeModule,
    ...
  ],
  providers: [
    {
      provide: TOLGEE_INSTANCE,
      useFactory: () => {
        return Tolgee()
          .use(DevTools())
          .use(FormatSimple())
          .init({
            language: 'en'

            // for development
            apiUrl: environment.tolgeeApiUrl,
            apiKey: environment.tolgeeApiKey,

            // for production
            staticData: {
              ...
            }
          });
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Usage
Translating using pipe:
```html
<h1>{{'{{\'hello_world\' | translate}}'}}</h1>
```

Or using t attribute
```html
<h1 t key="providing_default_values"></h1>
```

{{ macros.prereq('Angular') }}

{{ macros.why() }}

## Development
{{ macros.developmentInstallation() }}
{{ macros.development('ngx') }}

{{ macros.developmentTesting('/packages/ngx') }}

{{ macros.e2eTesting('ngx') }}

{{ macros.contributors() }}
