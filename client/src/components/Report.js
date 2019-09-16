// This is a root of client side of a reporting page
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SearchType from './search/SearchType';
import SearchResult from './search/SearchResult';
import { isEmpty } from './helper/Helper';
import { search } from './helper/Message';
import Popup from './Popup';
import SearchSummary from './search/SearchSummary';

import AppProvider from './helper/AppProvider';
import { AppContext } from './helper/envHelper';

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchType: 'user', // or program
      searchOptions: {}, // search options from SearchType

      searchAdmin: [], // result of search by user
      searchCourse: [], // result search by user
      searchProgram: [], // result search by user
      programSearchType: 'Program', // flag for program search, program number serarch
      // keep tracking total hours from the result of search
      totalHours: {
        admin: 0, // for user search
        course: 0, // for user search
        program: 0, // for course search
      },
      summaryInfo: [], // summary info for searchSummary component
      // admintable: [], // consider to delete...
      // coursetable: [], // consider to delete...
      userList: [],
    };
  }

  componentDidMount() {
    // fetch admintable from database
    // consider to delete...
    // fetch('/admintable')
    //   .then(res => res.json())
    //   .then(admintable => {
    //     this.setState({ admintable });
    //   })
    //   .catch(error => console.error('fetch error at admintable', error)); // error
    // // fetch coursetable from database
    // fetch('/coursetable')
    //   .then(res => res.json())
    //   .then(coursetable => {
    //     this.setState({ coursetable });
    //   })
    //   .catch(error => console.error('fetch error at coursetable', error)); // error
    // // localStorage for admintable/coursetable
    // const localStorageRefAdmin = localStorage.getItem('admintable');
    // const localStorageRefCourse = localStorage.getItem('coursetable');
    // if (localStorageRefAdmin) {
    //   this.setState({ admintable: JSON.parse(localStorageRefAdmin) });
    // }
    // if (localStorageRefCourse) {
    //   this.setState({ coursetable: JSON.parse(localStorageRefCourse) });
    // }
    fetch('/users')
      .then(response => response.json())
      .then(userList => {
        this.setState({
          userList,
        });
      });
  }

  componentDidUpdate() {
    if (!isEmpty(this.state.searchOptions)) {
      this.handleSearch();
    }
  }

  selectSearch = searchType => {
    this.setState({ searchType });
  };

  addSearchOptions = searchOptions => {
    this.setState({
      searchOptions,
    });
  };

  programSearchType = programSearchType => {
    this.setState({ programSearchType });
  };

  handleSearch = () => {
    const {
      userID,
      startDate,
      endDate,
      courseProgram,
      courseNumber,
      courseTypeValue,
    } = this.state.searchOptions;

    // Search user
    if (this.state.searchType === 'user') {
      var realID = 0;
      for (const index of this.state.userList) {
        if(userID == index.name){
          realID = index.userID;
        }
      }
      const urlCourse = `/search/coursetable/${realID}/${startDate}/${endDate}`;
      const urlAdmin = `/search/admintable/${realID}/${startDate}/${endDate}`;
      fetch(urlCourse)
        .then(res => res.json())
        .then(json => {
          // console.info('Course result:', json);
          let totalHoursCourse = 0;
          json.forEach(course => {
            // date formatting
            const compDate = course.completionDate;
            const dateFormat = new Date(compDate);
            const formatted = `${dateFormat.getMonth() +
              1}/${dateFormat.getDate()}/${dateFormat.getFullYear()}`;
            course.completionDate = formatted;
            // calculate total hours for course task
            totalHoursCourse += course.hours;
          });
          // setState both searchCourse and totalHours
          json.userID = userID;
          this.setState({
            searchCourse: json,
            totalHours: { ...this.state.totalHours, course: totalHoursCourse },
          });
        })
        .catch(error => console.error('fetch error at search', error)); // error
      fetch(urlAdmin)
        .then(res => res.json())
        .then(json => {
          // console.info('Admin result:', json);
          let totalHoursAdmin = 0;
          json.forEach(course => {
            // date formatting
            const compDate = course.completionDate;
            const dateFormat = new Date(compDate);
            const formatted = `${dateFormat.getMonth() +
              1}/${dateFormat.getDate()}/${dateFormat.getFullYear()}`;
            course.completionDate = formatted;
            // calculate total hours for admin task
            totalHoursAdmin += course.hours;
          });

          json.userID = userID;
          this.setState({
            searchAdmin: json,
            searchProgram: [],
            totalHours: { ...this.state.totalHours, admin: totalHoursAdmin, program: 0 },
          });
        })
        .catch(error => console.error('fetch error at search', error)); // error
    } else {
      // Search program
      const idList1 = [];
      const nameList1 = [];
      for(const index of this.state.userList){
        idList1.push(index.userID);
        nameList1.push(index.name);
      }
      const urlProgram =
        this.state.programSearchType === 'Program'
          ? `/search/program/${courseProgram}/${startDate}/${endDate}/${courseTypeValue}/${idList1}/${nameList1}`
          : `/search/programNumber/${courseNumber}/${startDate}/${endDate}/${courseTypeValue}/${idList1}/${nameList1}`;
      fetch(urlProgram)
        .then(res => res.json())
        .then(json => {
          //  console.info('Program result:', json);
          if(courseProgram == 'All'){
            console.log(json);
            var last = (last=Object.keys(json))[last.length-1];
            console.log(json[last]['Sheets']['Weekly Report']);
            var XLSX = require('xlsx')
            XLSX.writeFile(json[last], 'weeklyreport.xlsx');
            delete json[last];
          }
          let totalHoursProgram = 0;
          json.forEach(course => {
            // date formatting
            const compDate = course.completionDate;
            const dateFormat = new Date(compDate);
            const formatted = `${dateFormat.getMonth() +
              1}/${dateFormat.getDate()}/${dateFormat.getFullYear()}`;
            course.completionDate = formatted;
            // calculate total hours for course task
            totalHoursProgram += course.hours;
          });
          // make sure to reset previous result of user search
          this.setState({
            searchProgram: json,
            searchAdmin: [],
            searchCourse: [],
            totalHours: {
              ...this.state.totalHours,
              program: totalHoursProgram,
              course: 0,
              admin: 0,
            },
          });
        })
        .catch(error => console.error('fetch error at search', error)); // error
    }
    this.setState({
      // update summary info
      summaryInfo: {
        userID,
        startDate,
        endDate,
        courseProgram,
        courseNumber,
      },
      // clear state
      searchOptions: {},
    });
  };

  render() {
    return (
      <AppProvider>
        <div className="wrapper">
          {/* <Popup closeBtn={false} /> */}

          <h1 className="App-title">Search Database</h1>
          <div className="guide">
            <MuiThemeProvider>
              <div className="guide__popup">
                <Popup title="Search Guide" text={search()} />
              </div>
            </MuiThemeProvider>
            <AppContext.Consumer>
              {context => {
                return (
                  <React.Fragment>
                    <button
                      className="btn btn__search"
                      onClick={() => {
                        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
                          this.props.history.push('/');
                        } else {
                          // production code
                          this.props.history.push(`${context.production}/`);
                        }
                      }}
                    >
                      BACK TO REPORT PAGE
                    </button>
                  </React.Fragment>
                );
              }}
            </AppContext.Consumer>

            {/* <button onClick={() => this.handlePop("search-guide")}>
            Search Guide
          </button> */}
          </div>
          <SearchType
            selectSearch={this.selectSearch}
            searchType={this.state.searchType}
            addSearchOptions={this.addSearchOptions}
            handleSearch={this.handleSearch}
            programSearchType={this.programSearchType}
          />

          <SearchResult
            searchCourse={this.state.searchCourse}
            searchAdmin={this.state.searchAdmin}
            searchProgram={this.state.searchProgram}
            searchType={this.state.searchType}
          />
          <SearchSummary
            searchType={this.state.searchType}
            totalHours={this.state.totalHours}
            summaryInfo={this.state.summaryInfo}
            searchProgram={this.state.searchProgram}
            searchCourse={this.state.searchCourse}
            searchAdmin={this.state.searchAdmin}
          />
        </div>
      </AppProvider>
    );
  }
}
export default Report;
Report.propTypes = {
  history: PropTypes.object.isRequired,
};
