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
    key: null,
    defaultValue: undefined,
    dialogOpened: false,
  };

  constructor(props: Props) {
    super(props);
  }

  public translationEdit(key: string, defaultValue?: string) {
    this.setState({
      ...this.state,
      dialogOpened: true,
      defaultValue: defaultValue,
      key: key,
    });
  }

  public render = () => (
    <>
      <BodyEnd>
        <TranslationDialogContextProvider
          dependencies={this.props.dependencies}
          defaultValue={this.state.defaultValue}
          open={this.state.dialogOpened}
          input={this.state.key}
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
