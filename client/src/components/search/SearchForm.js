// Form component for search page
import React from 'react';
import Autosuggest from 'react-autosuggest';
import PropTypes from 'prop-types';
import UserSuggestion from '../helper/UserSuggestion';

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
// Autosuggestion helpers end

class SearchForm extends React.Component {
  programRef = React.createRef();

  // userRef = React.createRef();
  startDateRef = React.createRef();

  endDateRef = React.createRef();

  constructor() {
    super();
    this.state = {
      selectValue: 'Program',
      courseTypeValue: 'All',
      // autosuggestion states
      programValue: '',
      programSuggestions: [],
      userName: '',
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

  onprogramSuggestionsFetchRequested = ({ value }) => {
    const suggestion = getSuggestions(value);
    // unique Program name to render in auto-suggestion container
    const flags = new Set();
    const newSuggestion = suggestion.filter(course => {
      if (flags.has(course.program)) {
        return false;
      }
      flags.add(course.program);
      return true;
    });

    this.setState({
      programSuggestions: newSuggestion,
    });
  };

  onprogramSuggestionsClearRequested = () => {
    this.setState({
      programSuggestions: [],
    });
  };

  getSuggestionprogram = suggestion =>
    this.state.selectValue === 'Program' ? suggestion.program : suggestion.courseNumber;
  // Autosuggestion method end

  handleChangeSearchType = e => {
    this.setState({ selectValue: e.target.value });
  };

  handleChangeCourseType = e => {
    this.setState({ courseTypeValue: e.target.value });
  };

  createSearchUser = event => {
    event.preventDefault();
    const options = {
      startDate: this.startDateRef.current.value,
      endDate: this.endDateRef.current.value,
      userID: this.state.userName,
    };
    this.props.addSearchOptions(options);
    event.currentTarget.reset();
  };

  createSearchProgram = event => {
    event.preventDefault();
    let options = {};
    if (this.state.selectValue === 'Program') {
      options = {
        startDate: this.startDateRef.current.value,
        endDate: this.endDateRef.current.value,
        selectValue: this.state.selectValue,
        courseProgram: this.state.programValue,
        courseTypeValue: this.state.courseTypeValue,
      };
      this.props.programSearchType('Program');
    } else {
      options = {
        startDate: this.startDateRef.current.value,
        endDate: this.endDateRef.current.value,
        selectValue: this.state.selectValue,
        courseNumber: this.state.programValue,
        courseTypeValue: this.state.courseTypeValue,
      };
      this.props.programSearchType('Program Number');
    }
    this.props.addSearchOptions(options);
    event.currentTarget.reset();
  };

  handleUserName = userName => this.setState({ userName });

  renderSuggestion = suggestion => {
    if (this.state.selectValue === 'Program') {
      return <React.Fragment>{suggestion.program}</React.Fragment>;
    }
    return <React.Fragment>{suggestion.courseNumber}</React.Fragment>;
  };

  render() {
    const { programValue, programSuggestions } = this.state;
    const programInputProps = {
      placeholder: this.state.selectValue === 'Program' ? 'Program' : 'Course Number',
      value: programValue,
      onChange: this.onprogramChange,
    };
    // program search
    if (this.props.searchType === 'program') {
      return (
        <form className="task-edit" onSubmit={this.createSearchProgram}>
          <span>Start Date </span>
          <input name="date" ref={this.startDateRef} type="date" required />
          <span>End Date </span>
          <input name="date" ref={this.endDateRef} type="date" required />

          <span>Search By</span>
          <div className="select-custom">
            <select
              name="type"
              value={this.state.selectValue}
              onChange={this.handleChangeSearchType}
            >
              <option value="Program">Program name</option>
              <option value="Program Number">Course number</option>
            </select>
          </div>

          <span>Course Type</span>
          <div className="select-custom">
            <select
              name="type"
              value={this.state.courseTypeValue}
              onChange={this.handleChangeCourseType}
            >
              <option value="All">All</option>
              <option value="New Course">New Course</option>
              <option value="Course Maintenance">Course Maintenance</option>
              <option value="Course Live Support">Course Live Support</option>
            </select>
          </div>

          <span>{this.state.selectValue === 'Program' ? 'Program' : 'Course Number'}</span>
          <Autosuggest
            id="program"
            suggestions={programSuggestions}
            onSuggestionsFetchRequested={this.onprogramSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onprogramSuggestionsClearRequested}
            onSuggestionSelected={this.onprogramSuggestionSelected}
            getSuggestionValue={this.getSuggestionprogram}
            renderSuggestion={this.renderSuggestion}
            inputProps={programInputProps}
            required
          />

          <div className="center">
            <button className="btn btn__summary">Search</button>
          </div>
        </form>
      );
    }

    // user search
    return (
      <form className="task-edit" onSubmit={this.createSearchUser}>
        <span>Start Date </span>
        <input name="date" ref={this.startDateRef} type="date" required />
        <span>End Date </span>
        <input name="date" ref={this.endDateRef} type="date" required />
        <span>User name</span>
        <UserSuggestion handleUserName={this.handleUserName} required />
        <div className="center">
          <button className="btn btn__summary">Search</button>
        </div>
      </form>
    );
  }
}

export default SearchForm;
SearchForm.propTypes = {
  addSearchOptions: PropTypes.func.isRequired,
  programSearchType: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
};
