/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// Form for submitting.
// It handles both course task form and admin task form
// Check https://github.com/moroshko/react-autosuggest for further infomration
// about react-autosuggest
import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import AlertPopup from 'react-popup';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Popup from '../Popup';
import { naminghelp } from '../helper/Message';
import infoIcon from '../../img/information.svg';

let courseData = [];
// Autosuggestion helpers start
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp(`^${escapedValue}`, 'i');
  return courseData.filter(course => regex.test(course.program) || regex.test(course.courseNumber));
}

function getSuggestionprogram(suggestion) {
  return suggestion.program;
}

function getSuggestionCourseNumber(suggestion) {
  return suggestion.courseNumber;
}
function renderSuggestion(suggestion) {
  return (
    <React.Fragment>
      {suggestion.program} - {suggestion.courseNumber}
    </React.Fragment>
  );
}
// Autosuggestion helpers end

class AddForm extends React.Component {
  // Course task
  programRef = React.createRef();

  hoursRef = React.createRef();

  courseTypeRef = React.createRef();

  dateRef = React.createRef();

  instructorRef = React.createRef();

  categoryRef = React.createRef();

  courseNumberRef = React.createRef();

  semesterRef = React.createRef();

  // admin task
  categoryAdminRef = React.createRef();

  constructor() {
    super();
    this.state = {
      programValue: '',
      programSuggestions: [],
      courseNumberValue: '',
      courseNumberSuggestions: [],
      noSuggestionsP: false,
      noSuggestionsC: false,
    };
  }

  componentDidMount() {
    // get user info from database for Autosugesstion
    fetch('/search/courseinfo')
      .then(res => res.json())
      .then(result => {
        courseData = result;
      })
      .catch(error => console.error('fetch error at componentDidMount', error)); // error
  }

  // Autosuggestion method start
  onprogramChange = (event, { newValue }) => {
    this.setState({
      programValue: newValue,
    });
  };

  onCourseNumberChange = (event, { newValue }) => {
    this.setState({
      courseNumberValue: newValue,
    });
  };

  onprogramSuggestionsFetchRequested = ({ value }) => {
    const suggestions = getSuggestions(value);
    const isInputBlank = value.trim() === '';
    const noSuggestionsP = !isInputBlank && suggestions.length === 0;
    this.setState({
      programSuggestions: getSuggestions(value),
      noSuggestionsP,
    });
  };

  onprogramSuggestionsClearRequested = () => {
    this.setState({
      programSuggestions: [],
    });
  };

  onprogramSuggestionSelected = (event, { suggestion }) => {
    this.setState({
      courseNumberValue: suggestion.courseNumber,
    });
  };

  onCourseNumberSuggestionsFetchRequested = ({ value }) => {
    const suggestions = getSuggestions(value);
    const isInputBlank = value.trim() === '';
    const noSuggestionsC = !isInputBlank && suggestions.length === 0;
    this.setState({
      courseNumberSuggestions: getSuggestions(value),
      noSuggestionsC,
    });
  };

  onCourseNumberSuggestionsClearRequested = () => {
    this.setState({
      courseNumberSuggestions: [],
    });
  };

  onCourseNumberSuggestionSelected = (event, { suggestion }) => {
    this.setState({
      programValue: suggestion.program,
    });
  };
  // Autosuggestion method end

  // create course task
  createTask = event => {
    event.preventDefault();
    const that = this;
    // error
    if (this.state.noSuggestionsC || this.state.noSuggestionsP) {
      AlertPopup.registerPlugin('prompt', function() {
        this.create({
          title: 'Failed to add a task',
          content: (
            <div className="errorPop">
              <p>
                To add task, please select valid program name or course number from naming guide. If
                you want to add new course or program that is not in the database, contact
                <a href="mailto:eipdstatusreporting@lists.wisc.edu">
                  {' '}
                  eipdstatusreporting@lists.wisc.edu.
                </a>
              </p>
              <div className="errorPop--namingguide">
                <MuiThemeProvider>
                  <Popup title="Naming Guide" text={naminghelp(that.props.nameList)} />
                </MuiThemeProvider>
              </div>
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
      return;
    }
    if (this.state.courseNumberValue === '') {
      const errorSubmitPopup = AlertPopup.register({
        title: 'Failed to add a task',
        content: 'Check the required fields of the form. Required field has red *.',
        buttons: {
          right: ['ok'],
        },
      });
      AlertPopup.queue(errorSubmitPopup);
      return;
    }
    const task = {
      // course form
      taskType: 'Course Task', // type of course
      date: this.dateRef.current.value,
      courseType: this.courseTypeRef.current.value,
      program: this.state.programValue, // this.programRef.current.value,
      courseNumber: this.state.courseNumberValue, // this.courseNumberRef.current.value,
      semester: this.semesterRef.current.value,
      instructor: this.instructorRef.current.value,
      category: this.categoryRef.current.value,
      hours: parseFloat(this.hoursRef.current.value),
    };
    this.props.sumHours(this.hoursRef.current.value);
    this.props.addTask(task);
    // event.currentTarget.reset();
  };

  // create admin task
  createTaskAdmin = event => {
    event.preventDefault();
    const task = {
      // admin form
      taskType: 'Adminstration Task',
      date: this.dateRef.current.value,
      category: this.categoryAdminRef.current.value,
      hours: parseFloat(this.hoursRef.current.value),
    };
    this.props.sumHours(this.hoursRef.current.value);
    this.props.addTask(task);
    // event.currentTarget.reset();
  };

  // method for clear form. button triggers this.
  clearForm = type => {
    if (type === 'course') {
      this.setState({
        programValue: '',
        courseNumberValue: '',
      });
      this.hoursRef.current.value = '';
      this.dateRef.current.value = '';
      this.semesterRef.current.value = '';
      this.instructorRef.current.value = '';
    } else {
      this.hoursRef.current.value = '';
      this.dateRef.current.value = '';
    }
  };

  render() {
    const {
      programValue,
      programSuggestions,
      courseNumberValue,
      courseNumberSuggestions,
      noSuggestionsP,
      noSuggestionsC,
    } = this.state;
    const programInputProps = {
      placeholder: 'Program name',
      value: programValue,
      onChange: this.onprogramChange,
    };
    const courseNumberInputProps = {
      placeholder: 'Course number',
      value: courseNumberValue,
      onChange: this.onCourseNumberChange,
    };
    // admin form
    if (this.props.taskType === 'admin') {
      return (
        <form className="task-edit" onSubmit={this.createTaskAdmin}>
          <span className="requiredField">Date </span>
          <input
            type="date"
            name="date"
            id="date"
            ref={this.dateRef}
            required
            // min={
            //   new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            // }
            // max={new Date().toISOString().split('T')[0]}
          />
          <span className="requiredField">Task Type</span>
          <div className="select-custom">
            <select name="type" ref={this.categoryAdminRef}>
              <option value="Internal Admin">Internal Admin</option>
              <option value="Leave">Leave</option>
              <option value="Meeting">Meeting</option>
              <option value="Professional Development">Professional Development</option>
              <option value="Project Management">Project Management</option>
              <option value="Purchasing">Purchasing</option>
              <option value="Reporting">Reporting</option>
              <option value="Students">Students</option>
              <option value="Support">Support</option>
              <option value="Special Projects">Special Projects</option>
            </select>
          </div>

          <span className="requiredField">Hours for This Task</span>
          <input
            name="hours"
            ref={this.hoursRef}
            type="number"
            step="0.25"
            min="0.25"
            placeholder="hours"
            required
          />
          <div className="container__summaryBtn">
            <button
              className="btn btn__summary btn__clearForm"
              type="button"
              onClick={() => this.clearForm('admin')}
            >
              Clear form
            </button>
            <button className="btn btn__summary" type="submit">
              Add Task
            </button>
          </div>
        </form>
      );
    }

    // course form
    return (
      <form className="task-edit" onSubmit={this.createTask}>
        <span className="requiredField">Date </span>
        <input
          name="date"
          ref={this.dateRef}
          type="date"
          // min={
          //   new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          // }
          // max={new Date().toISOString().split('T')[0]}
          required
        />

        <span className="requiredField">Course Type</span>
        <div className="select-custom">
          <select name="type" ref={this.courseTypeRef}>
            <option value="New Course">New Course</option>
            <option value="Course Maintenance">Course Maintenance</option>
            <option value="Course Live Support">Course Live Support</option>
          </select>
        </div>

        <span>Program</span>
        <Autosuggest
          id="program"
          suggestions={programSuggestions}
          onSuggestionsFetchRequested={this.onprogramSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onprogramSuggestionsClearRequested}
          onSuggestionSelected={this.onprogramSuggestionSelected}
          getSuggestionValue={getSuggestionprogram}
          renderSuggestion={renderSuggestion}
          inputProps={programInputProps}
        />

        {noSuggestionsP && (
          <div>
            <p className="no-suggestion--form">The program name is not in the database</p>
          </div>
        )}

        <span className="requiredField">Course Number</span>
        <Autosuggest
          id="courseNumber"
          suggestions={courseNumberSuggestions}
          onSuggestionsFetchRequested={this.onCourseNumberSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onCourseNumberSuggestionsClearRequested}
          onSuggestionSelected={this.onCourseNumberSuggestionSelected}
          getSuggestionValue={getSuggestionCourseNumber}
          renderSuggestion={renderSuggestion}
          inputProps={courseNumberInputProps}
        />
        {noSuggestionsC && (
          <p className="no-suggestion--form">The course name is not in the database</p>
        )}

        <span>Semester</span>
        <input name="semester" ref={this.semesterRef} type="text" placeholder="e.g. Spring 2018" />

        <span>Instructor</span>
        <input
          name="instructor"
          ref={this.instructorRef}
          type="text"
          placeholder="Instructor name"
        />

        <span className="requiredField">
          Task Type{' '}
          <a
            onClick={() => {
              const taskTypeHelp = AlertPopup.register({
                title: 'Task Type',
                content:
                  'To learn more about task type, please check Course Guide on top of the menu bar',
                buttons: {
                  right: ['ok'],
                },
              });
              AlertPopup.queue(taskTypeHelp);
            }}
          >
            <img className="help-icon" src={infoIcon} alt="help icon" />
          </a>
        </span>

        <div className="select-custom">
          <select name="type" ref={this.categoryRef}>
            <option value="Content Development">Content Development</option>
            <option value="Faculty Consultation">Faculty Consultation</option>
            <option value="CMS Layout">CMS Layout</option>
            <option value="ISD Time">ISD Time</option>
            <option value="Media Production">Media Production</option>
            <option value="Quality Control">Quality Control</option>
            <option value="Transcription">Transcription</option>
          </select>
        </div>

        <span className="requiredField">Hours for This Task</span>
        <input
          name="hours"
          ref={this.hoursRef}
          type="number"
          placeholder="Hours"
          step="0.25"
          min="0.25"
          required
        />

        <div className="container__summaryBtn">
          <button
            className="btn btn__summary btn__clearForm"
            type="button"
            onClick={() => this.clearForm('course')}
          >
            Clear form
          </button>
          <button type="submit" className="btn btn__summary">
            Add task
          </button>
        </div>
      </form>
    );
  }
}

export default AddForm;
AddForm.propTypes = {
  sumHours: PropTypes.func.isRequired,
  addTask: PropTypes.func.isRequired,
  taskType: PropTypes.string.isRequired,
};
