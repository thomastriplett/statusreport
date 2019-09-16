// React context to handle production route
import React from 'react';
import { AppContext } from './envHelper';

class AppProvider extends React.Component {
  state = {
    production: '/statusreport',
  };

  render() {
    return <AppContext.Provider value={this.state}>{this.props.children}</AppContext.Provider>;
  }
}
export default AppProvider;
