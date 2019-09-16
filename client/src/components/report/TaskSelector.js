// Task Selector to handle rendering for either course form or admin form

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TaskSelector extends Component {
  handleTaskSelector = (e, taskType) => {
    const taskSelector = document.getElementsByClassName('btn__taskSelector');
    for (let i = 0; i < taskSelector.length; i++) {
      taskSelector[i].className = taskSelector[i].className.replace(' selected', '');
    }
    // for (const task of taskSelector) {
    //   task.className = task.className.replace(' selected', '');
    // }
    e.currentTarget.className += ' selected';
    this.props.selectTask(taskType);
  };

  render() {
    return (
      <div className="taskSelector">
        <button
          className="btn btn__taskSelector"
          onClick={e => this.handleTaskSelector(e, 'course')}
        >
          Course
        </button>
        <button
          className="btn btn__taskSelector"
          onClick={e => this.handleTaskSelector(e, 'admin')}
        >
          Administration
        </button>
      </div>
    );
  }
}

export default TaskSelector;
TaskSelector.propTypes = {
  selectTask: PropTypes.func.isRequired,
};
