import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class BodyEnd extends React.PureComponent<React.ReactNode> {
  _popup = null;

  componentDidMount() {
    this._popup = document.createElement('div');
    document.body.appendChild(this._popup);
    this._render();
  }

  componentDidUpdate() {
    this._render();
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this._popup);
    document.body.removeChild(this._popup);
  }

  _render() {
    ReactDOM.render(<>{this.props.children}</>, this._popup);
  }

  render() {
    return null;
  }
}
