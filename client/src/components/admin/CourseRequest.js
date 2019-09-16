import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AlertPopup from 'react-popup';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { request } from '../helper/Message';

import AuthService from '../AuthService';
import { prodUrl } from '../helper/envHelper';
import Popup from '../Popup';
import withWidth from 'material-ui/utils/withWidth';

class CourseRequest extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    //this.handleChangePassword = this.handleChangePassword.bind(this);
    this.Auth = new AuthService();

    this.state = {
      pageRender: 'default', // or 'newPassword'
      requestList: [],
    };
  }

  // Add redirection if we are already loggedIn
  componentWillMount() {
    if (this.Auth.loggedIn()) this.props.history.replace('/');
  }

  componentDidMount() {
    fetch('/request')
      .then(response => response.json())
      .then(requestList => {
        this.setState({
          requestList,
        });
      });
  }

  handleNewPassword() {
    this.setState({ pageRender: 'newPoassword' });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.Auth.login(this.state.username, this.state.password)
      .then(res => {
        /*if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          this.props.history.push('/editselect/');
        } else {
          production
          this.props.history.push(`${prodUrl}/editselect/`);
        }*/

        // success!!
    try {
      const success = AlertPopup.register({
        title: 'Status Report',
        content: 'Request submitted. Thank you.',
        buttons: {
          right: ['ok'],
        },
      });
      AlertPopup.queue(success);
    } catch (e) {
      const fail = AlertPopup.register({
        title: 'Status Report',
        content: 'Failed to submit. There might be a database connection issue.',
        buttons: {
          right: ['ok'],
        },
      });
      AlertPopup.queue(fail);
    }
    const data = this.state;
    // success
    // submit the tasks
    fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).catch(error => console.error('fetch error at submit', error)); // error
      })
      .catch(err => {
        AlertPopup.registerPlugin('prompt', function() {
          this.create({
            title: 'Failed to login',
            content: (
              <div className="errorPop">
                <p>
                  The username or password you entered is incorrect. Please contact
                  <a href="mailto:eipdstatusreporting@lists.wisc.edu">
                    {' '}
                    eipdstatusreporting@lists.wisc.edu.
                  </a>
                  to get login information.
                </p>
              </div>
            ),
            buttons: {
              right: ['ok'],
            },
          });
        });
        AlertPopup.plugins().prompt('', 'Type your name', value => {
          AlertPopup.alert(`You typed: ${value}`);
        });
      });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  renderHelper(status) {
    if (status === 'default') {
      return (
        <form className="task-edit" onSubmit={this.handleFormSubmit}>
          <h2 className="center login__form--title">Request New Course / Change Existing Course</h2>
          <span>Username</span>
          <input
            className="date"
            placeholder="Username"
            name="username"
            type="text"
            onChange={this.handleChange}
            required
          />
          <br />
          <span>Password</span>
          <input
            className="program"
            placeholder="Password"
            name="password"
            type="password"
            onChange={this.handleChange}
            required
          />
          <br />
          <span>Old Program Name</span>
          <input
            className="program"
            placeholder="Old program name"
            name="old program name"
            type="text"
            onChange={this.handleChange}
          />
          <br />
          <span>Old Course Number</span>
          <input
            className="courseNumber"
            placeholder="Old course number"
            name="old course number"
            type="text"
            onChange={this.handleChange}
          />
          <br />
          <span>Program Name</span>
          <input
            className="program"
            placeholder="Program name"
            name="program name"
            type="text"
            onChange={this.handleChange}
            required
          />
          <br />
          <span>Course Number</span>
          <input
            className="courseNumber"
            placeholder="Course number"
            name="course number"
            type="text"
            onChange={this.handleChange}
            required
          />
          <div class="container__summaryBtn">
          <button className="btn btn__submit" type="submit">
            SUBMIT REQUEST
          </button>
          <MuiThemeProvider>
            <Popup title="VIEW REQUESTS" text={request(this.state.requestList)} />
          </MuiThemeProvider>
          </div>
        </form>
      );
    }
    /*return (
      <div>
        <AlertPopup closeBtn={false} />
        <form className="login__form" onSubmit={this.handleChangePassword}>
          <h2 className="center login__form--title">New Password</h2>
          <input
            className="login__form--username"
            placeholder="Username"
            name="username"
            type="text"
            onChange={this.handleChange}
            required
          />

          <input
            className="login__form--password"
            placeholder="Old Password"
            name="password"
            type="password"
            onChange={this.handleChange}
            required
          />
          <input
            className="login__form--password"
            placeholder="New Password"
            name="newPassword"
            type="password"
            onChange={this.handleChange}
            required
          />
          <button className="btn btn__submit login__form--submit" type="submit">
            Change Password
          </button>
          <button
            onClick={() => this.setState({ pageRender: 'default' })}
            className="btn btn__submit login__form--submit"
            type="button"
          >
            Back to Login Page
          </button>
        </form>
      </div>
    );*/
  }

  render() {
    return (
      <div className="wrapper">
        <AlertPopup closeBtn={false} />
        <h1 className="App-title">Course Request</h1>

        <div className="form-list form-list--report">
          <button
            className="btn btn__login--back"
            onClick={() => {
              if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
                this.props.history.push('/');
              } else {
                // production code
                this.props.history.push(`${prodUrl}/`);
              }
            }}
          >
            BACK TO REPORT PAGE
          </button>
          {/* decide which page render */}
          {this.renderHelper(this.state.pageRender)}
        </div>
      </div>
    );
  }
}
export default CourseRequest;
CourseRequest.propTypes = {
  history: PropTypes.object.isRequired,
};
