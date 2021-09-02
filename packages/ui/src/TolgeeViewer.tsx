import * as React from 'react';
import { CoreService } from '@tolgee/core/lib/services/CoreService';
import { TranslationService } from '@tolgee/core/lib/services/TranslationService';
import { Properties } from '@tolgee/core/lib/Properties';
import { EventService } from '@tolgee/core/lib/services/EventService';
import { BodyEnd } from './common/BodyEnd';
import { TranslationDialogContextProvider } from './translationDialog/TranslationDialogContextProvider';
import { TranslationDialog } from './translationDialog/TranslationDialog';

export type ComponentDependencies = {
  coreService: CoreService;
  translationService: TranslationService;
  properties: Properties;
  eventService: EventService;
};

export type ViewerProps = {
  dependencies: ComponentDependencies;
};

export class TolgeeViewer extends React.Component<ViewerProps> {
  state = {
    translationInput: null,
    dialogOpened: false,
  };

  constructor(props: ViewerProps) {
    super(props);
  }

  public translationEdit(input) {
    this.setState({
      ...this.state,
      dialogOpened: true,
      translationInput: input,
    });
  }

  public render = () => (
    <>
      <BodyEnd>
        <TranslationDialogContextProvider
          dependencies={this.props.dependencies}
          open={this.state.dialogOpened}
          input={this.state.translationInput}
          onClose={this.onClose}
        >
          <TranslationDialog />
        </TranslationDialogContextProvider>
      </BodyEnd>
    </>
  );

  private onClose = () => {
    this.setState({ ...this.state, dialogOpened: false });
  };
}
