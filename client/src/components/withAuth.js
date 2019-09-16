// Wrapper/higher order component for components use authentication.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthService from './AuthService';
import { prodUrl } from './helper/envHelper';

export default function withAuth(AuthComponent) {
  const Auth = new AuthService('http://localhost:8080');
  return class AuthWrapped extends Component {
    constructor() {
      super();
      this.state = {
        user: null,
      };
    }

    componentWillMount() {
      if (!Auth.loggedIn()) {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          this.props.history.push('/login/');
        } else {
          // production
          this.props.history.push(`${prodUrl}/login/`);
        }
      } else {
        try {
          const profile = Auth.getProfile();
          this.setState({
            user: profile,
          });
        } catch (err) {
          Auth.logout();
          if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            this.props.history.push('/login/');
          } else {
            // production
            this.props.history.push(`${prodUrl}/login/`);
          }
        }
      }
    }

    render() {
      if (this.state.user) {
        return <AuthComponent history={this.props.history} user={this.state.user} />;
      }

      return null;
    }
  };
}

withAuth.propTypes = {
  history: PropTypes.object.isRequired,
};
