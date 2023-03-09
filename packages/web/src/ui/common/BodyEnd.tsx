import { DEVTOOLS_ID } from '../../constants';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class BodyEnd extends React.PureComponent<{
  document?: Document;
  children: React.ReactNode;
}> {
  _popup = null as HTMLElement | null;

  get document() {
    return this.props.document || document;
  }

  get devTools() {
    return (
      this.document.getElementById(DEVTOOLS_ID)?.shadowRoot ||
      this.document.body
    );
  }

  componentDidMount() {
    this._popup = this.document.createElement('div')!;

    this.devTools.appendChild(this._popup);
    this._render();
  }

  componentDidUpdate() {
    this._render();
  }

  componentWillUnmount() {
    if (this._popup) {
      ReactDOM.unmountComponentAtNode(this._popup);
      this.devTools.removeChild(this._popup);
    }
  }

  _render() {
    ReactDOM.render(<>{this.props.children}</>, this._popup);
  }

  render() {
    return null;
  }
}
