// parent component of AddForm and TaskSelector
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddForm from './AddForm';
import TaskSelector from './TaskSelector';

class Forms extends Component {
  render() {
    const taskType = this.props.taskType === 'admin' ? 'Admin Task' : 'Course Task';
    return (
      <div className="form-list form-list--report">
        <TaskSelector selectTask={this.props.selectTask} />
        <h2 className="center heading-primary">{taskType}</h2>
        <AddForm
          addTask={this.props.addTask}
          sumHours={this.props.sumHours}
          taskType={this.props.taskType}
          nameList={this.props.nameList}
        />
      </div>
    );
  }
}

export default Forms;
Forms.propTypes = {
  sumHours: PropTypes.func.isRequired,
  addTask: PropTypes.func.isRequired,
  selectTask: PropTypes.func.isRequired,
  taskType: PropTypes.string.isRequired,
  nameList: PropTypes.array.isRequired,
};
