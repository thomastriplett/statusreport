/* eslint react/prop-types: 0 */
// Summary part of the report page
import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { dateFormat } from '../helper/Helper';
import UserSuggestion from '../helper/UserSuggestion';
import App from '../App';

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
    };
  }

  componentDidMount() {
    fetch('/users')
      .then(response => response.json())
      .then(userList => {
        this.setState({
          userList,
        });
      });
  }

  handleUserName = userName => {
    //console.log("before: " + this.props.userID);
    this.props.addUser(userName.trim());
    //this.props.addUserID(userName.trim());
  }; // props to App

  handleUserID = userID => {
    //console.log("hello world");
    for (const index of this.state.userList) {
      console.log(this.props.userName + " " + index.name);
      if (index.name == this.props.userName) {
        console.log(index.name + " " + index.userID);
        this.props.addUserID(index.userID);
        console.log(this.props.userID);
        break;
      }
    }
    this.props.handleSubmit();
  };

  renderTask = key => {
    const task = this.props.tasks[key];
    // loop through each task's category for the gap
    const renderItem = Object.keys(task).map(item => {
      if (task[item] === '') {
        return '';
      }
      if (item === 'taskType') {
        return (
          <span key={item} className="tasks-list-gap">
            {task[item]}
            {': '}
          </span>
        );
      }
      if (item === 'hours') {
        return (
          <span key={item} className="tasks-list-gap">
            {task[item]} hours
          </span>
        );
      }
      if (item === 'date') {
        return (
          <span key={item} className="tasks-list-gap">
            {dateFormat(task[item])}
          </span>
        );
      }
      return (
        <span key={item} className="tasks-list-gap">
          {task[item]}
        </span>
      );
    });
    return (
      <CSSTransition key={key} in classNames="summary" appear timeout={1000}>
        <li className="summary__list" key={key}>
          {renderItem}
          <button className="btn btn__remove" onClick={() => this.props.removeTask(key)}>
            Remove
          </button>
        </li>
      </CSSTransition>
    );
  };

  render() {
    const taskIds = Object.keys(this.props.tasks);
    const count = this.props.totalHours;
    return (
      <div className="summary summary--report">
        <h2 className="heading-primary">Summary</h2>
        <ol className="tasks-list">{taskIds.map(this.renderTask)}</ol>
        <div className="summary-info">
          <p style={{ display: 'inline' }}>Total Hours: </p>
          <TransitionGroup component="span" className="text-totalHours">
            <CSSTransition
              classNames="text-totalHours"
              timeout={{ enter: 1000, exit: 100 }}
              key={count}
            >
              <span className="text-totalHours">{this.props.totalHours}</span>
            </CSSTransition>
          </TransitionGroup>
          <p>{this.props.date.toString()}</p>

          <UserSuggestion
            handleUserName={this.handleUserName}
            userName={this.props.userName}
            required
          />
        </div>
        <button
          className="btn btn__summary"
          onClick={() => {
            window.print();
          }}
        >
          Print
        </button>
        <button className="btn btn__summary" onClick={this.props.updateUserID}>
          Submit
        </button>
      </div>
    );
  }
}
export default Tasks;
