import * as React from 'react';
import { TranslationDialog } from './TranslationDialog';
import { BodyEnd } from './BodyEnd';
import { CoreService } from '@tolgee/core/lib/services/CoreService';
import { TranslationService } from '@tolgee/core/lib/services/TranslationService';
import { Properties } from '@tolgee/core/lib/Properties';
import { EventService } from '@tolgee/core/lib/services/EventService';

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
    <BodyEnd>
      <TranslationDialog
        dependencies={this.props.dependencies}
        open={this.state.dialogOpened}
        input={this.state.translationInput}
        onClose={this.onClose}
      />
    </BodyEnd>
  );

  private onClose = () => {
    this.setState({ ...this.state, dialogOpened: false });
  };
}
