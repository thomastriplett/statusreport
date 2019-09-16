import React from 'react';
import PropTypes from 'prop-types';
import ReactTable, { ReactTableDefaults } from 'react-table';
import 'react-table/react-table.css';

// default react table setting
Object.assign(ReactTableDefaults, {
  noDataText: 'No task...',
});

class SearchResult extends React.Component {
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
  // custome sorting for react table
  sortDate = (a, b) => {
    const aDate = new Date(a);
    const bDate = new Date(b);
    return aDate > bDate ? 1 : -1;
  };

  getName = (name) => {
    for (const index of this.state.userList) {
      if (index.name == name) {
        return(index.userID);
      }
    }
  } 

  render() {
    const courseData = this.props.searchCourse;
    const adminData = this.props.searchAdmin;
    const programData = this.props.searchProgram;
    // User table for user search
    const courseColumns = [
      { Header: 'Name', Cell: courseData.userID },
      { Header: 'Program', accessor: 'courseProgram' },
      { Header: 'Course number', accessor: 'courseNumber' },
      { Header: 'Course task', accessor: 'courseTask' },
      { Header: 'Semester', accessor: 'semester' },
      { Header: 'Instructor', accessor: 'courseInst' },
      { Header: 'Course category', accessor: 'courseCat' },
      { Header: 'Report date', accessor: 'subDate', sortMethod: (a, b) => this.sortDate(a, b) },
      {
        Header: 'Completion date',
        accessor: 'completionDate',
        sortMethod: (a, b) => this.sortDate(a, b),
      },
      { Header: 'Hours', accessor: 'hours' },
    ];
    const adminColumns = [
      { Header: 'Name', Cell: adminData.userID },
      { Header: 'Report date', accessor: 'subDate', sortMethod: (a, b) => this.sortDate(a, b) },
      {
        Header: 'Completion date',
        accessor: 'completionDate',
        sortMethod: (a, b) => this.sortDate(a, b),
      },
      { Header: 'Admin category', accessor: 'adminCat' },
      { Header: 'Hours', accessor: 'hours' },
    ];

    // Course table for course search
    const programColumns = [
      { Header: 'Program', accessor: 'courseProgram' },
      { Header: 'Course Number', accessor: 'courseNumber' },
      { Header: 'Course task', accessor: 'courseTask' },
      { Header: 'Name', accessor: 'userID' },
      { Header: 'Semester', accessor: 'semester' },
      { Header: 'Instructor', accessor: 'courseInst' },
      { Header: 'Course category', accessor: 'courseCat' },
      { Header: 'Report date', accessor: 'subDate', sortMethod: (a, b) => this.sortDate(a, b) },
      {
        Header: 'Completion date',
        accessor: 'completionDate',
        sortMethod: (a, b) => this.sortDate(a, b),
      },
      { Header: 'Hours', accessor: 'hours' },
    ];

    if (this.props.searchType === 'user') {
      return (
        <div className="summary summary--search">
          <h2 className="heading-primary">Search Result</h2>
          <p className="table__p">Course task</p>
          <ReactTable data={courseData} columns={courseColumns} defaultPageSize={10} />
          <p className="table__p">Admin task</p>
          <ReactTable data={adminData} columns={adminColumns} defaultPageSize={10} />
        </div>
      );
    }
    return (
      <div className="summary summary--search">
        <h2 className="heading-primary">Search Result</h2>
        <p className="table__p">Course</p>
        <ReactTable data={programData} columns={programColumns} defaultPageSize={10} />
      </div>
    );
  }
}

export default SearchResult;
SearchResult.propTypes = {
  searchCourse: PropTypes.array.isRequired,
  searchAdmin: PropTypes.array.isRequired,
  searchProgram: PropTypes.array.isRequired,
  searchType: PropTypes.string.isRequired,
};
