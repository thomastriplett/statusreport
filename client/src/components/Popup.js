/* eslint react/prop-types: 0 */

// Popup component that uses material-ul
// check https://material-ui.com/ to understand its API

import React from 'react';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import { prodUrl } from './helper/envHelper';
import App from './App';

const customContentStyle =
  window.screen.availWidth >= 900
    ? {
        width: '68%',
        borderRadius: '100px',
        wrapper: {
          padding: '0.2rem',
        },
      }
    : {
        width: '95%',
        wrapper: {
          padding: '0.2rem',
        },
      };

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */
export default class Popup extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    let actions = [];
    if (this.props.title === 'Request') {
      actions = [
        <button className="btn btn__guide  btn__request" onClick={() => {
          if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            this.props.history.push(`/editselect/`);
          } else {
            // production code
            this.props.history.push(`${prodUrl}/`);
          }
        }}>
          Request
        </button>,
        <button className="btn btn__guide  btn__request" onClick={this.handleClose}>
          Cancel
        </button>,
      ];
    } 
    else {
      actions = [
        <button className="btn btn__guide btn__guide--inPopup" onClick={this.handleClose}>
          OK
        </button>,
      ];
    }
    const { text } = this.props;

    if(this.props.title === 'VIEW REQUESTS'){
      return(<div style={customContentStyle.wrapper}>
        <button className="centered-element btn btn__submit btn__viewRequest login__form--submit" onClick={this.handleOpen} type="button">
          {this.props.title}
        </button>
        <Dialog
          title={this.props.title}
          autoScrollBodyContent
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          contentStyle={customContentStyle}
        >
          {text}
        </Dialog>
      </div>)
    }
    else{
    return (
      <div style={customContentStyle.wrapper}>
        <button className="btn btn__guide"  onClick={this.handleOpen}>
          {this.props.title}
        </button>
        <Dialog
          title={this.props.title}
          autoScrollBodyContent
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          contentStyle={customContentStyle}
        >
          {text}
        </Dialog>
      </div>
    )};
  }
}
this.propTypes = {
  history: PropTypes.object.isRequired,
};