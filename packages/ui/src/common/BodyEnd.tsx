import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class BodyEnd extends React.PureComponent<{ document?: Document }> {
  _popup = null;

  get document() {
    return this.props.document || document;
  }

  componentDidMount() {
    this._popup = this.document.createElement('div');
    this.document.body.appendChild(this._popup);
    this._render();
  }

  componentDidUpdate() {
    this._render();
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this._popup);
    this.document.body.removeChild(this._popup);
  }

  _render() {
    ReactDOM.render(<>{this.props.children}</>, this._popup);
  }

  render() {
    return null;
  }
}
