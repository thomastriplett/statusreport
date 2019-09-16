// Simiar to TaskSelector.
// It gives options to choose either user or program

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SearchSelector extends Component {
  handleSearchSelector = (e, searchType) => {
    const taskSelector = document.getElementsByClassName('btn__taskSelector');
    for (let i = 0; i < taskSelector.length; i++) {
      taskSelector[i].className = taskSelector[i].className.replace(' selected', '');
    }
    // for (const task of taskSelector) {
    //   task.className = task.className.replace(' selected', '');
    // }
    e.currentTarget.className += ' selected';
    this.props.selectSearch(searchType);
  };

  render() {
    return (
      <div className="taskSelector">
        <button
          className="btn btn__taskSelector"
          onClick={e => this.handleSearchSelector(e, 'user')}
        >
          User
        </button>
        <button
          className="btn btn__taskSelector"
          onClick={e => this.handleSearchSelector(e, 'program')}
        >
          Course
        </button>
      </div>
    );
  }
}

export default SearchSelector;
SearchSelector.propTypes = {
  selectSearch: PropTypes.func.isRequired,
};
