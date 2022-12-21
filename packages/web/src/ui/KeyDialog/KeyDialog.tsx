import * as React from 'react';
import { BodyEnd } from '../common/BodyEnd';
import { DialogProvider } from './dialogContext';
import { TranslationDialog } from './TranslationDialog';
import type { UiProps } from '@tolgee/core';
import { QueryProvider } from '../../ui/client/QueryProvider';

export type ComponentDependencies = UiProps;

export type Props = UiProps;

type State = {
  key: null | string;
  defaultValue: undefined | string;
  dialogOpened: boolean;
  ns: string[];
};

export class KeyDialog extends React.Component<Props, State> {
  state = {
    key: null,
    defaultValue: undefined,
    dialogOpened: false,
    ns: [],
  };

  constructor(props: Props) {
    super(props);
  }

  public translationEdit(
    key: string,
    defaultValue: string | undefined,
    ns: string[]
  ) {
    this.setState({
      ...this.state,
      dialogOpened: true,
      defaultValue: defaultValue,
      key,
      ns,
    });
  }

  public render = () => (
    <BodyEnd>
      <QueryProvider
        apiUrl={this.props.apiUrl}
        apiKey={this.props.apiKey}
        projectId={this.props.projectId}
      >
        {this.state.dialogOpened && (
          <DialogProvider
            uiProps={this.props}
            defaultValue={this.state.defaultValue || ''}
            open={this.state.dialogOpened}
            keyName={this.state.key!}
            ns={this.state.ns || []}
            onClose={this.onClose}
          >
            <TranslationDialog />
          </DialogProvider>
        )}
      </QueryProvider>
    </BodyEnd>
  );

  private onClose = () => {
    this.setState({ ...this.state, dialogOpened: false });
  };
}
