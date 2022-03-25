import * as React from 'react';
import { BodyEnd } from '../common/BodyEnd';
import { DialogProvider } from './TranslationDialogContextProvider';
import { TranslationDialog } from './TranslationDialog';
import type { DependencyService } from '@tolgee/core/lib/services/DependencyService';

export type ComponentDependencies = DependencyService;

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
        <DialogProvider
          dependencies={this.props.dependencies}
          defaultValue={this.state.defaultValue}
          open={this.state.dialogOpened}
          input={this.state.key}
          onClose={this.onClose}
        >
          <TranslationDialog />
        </DialogProvider>
      </BodyEnd>
    </>
  );

  private onClose = () => {
    this.setState({ ...this.state, dialogOpened: false });
  };
}
