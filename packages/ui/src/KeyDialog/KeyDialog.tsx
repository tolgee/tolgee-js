import * as React from 'react';
import { BodyEnd } from '../common/BodyEnd';
import { TranslationDialogContextProvider } from './TranslationDialogContextProvider';
import { TranslationDialog } from './TranslationDialog';
import { DependencyStore } from '@tolgee/core/lib/services/DependencyStore';

export type ComponentDependencies = DependencyStore;

export type Props = {
  dependencies: ComponentDependencies;
};

export class KeyDialog extends React.Component<Props> {
  state = {
    translationInput: null,
    dialogOpened: false,
  };

  constructor(props: Props) {
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
