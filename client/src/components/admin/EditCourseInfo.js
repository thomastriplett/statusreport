import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import withAuth from '../withAuth';
import AuthService from '../AuthService';
import AppProvider from '../helper/AppProvider';
import { AppContext, prodUrl } from '../helper/envHelper';

const Auth = new AuthService();

class EditCourseInfo extends React.Component {
  programRef = React.createRef();

  courseRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      open: false, // popup open?
      curName: {}, // current program/course name
      type: '', // edit, remove or new
      success: false,
      courseinfo: [],
    };
  }

  componentDidMount() {
    fetch('/courseinfo')
      .then(response => response.json())
      .then(findresponse => {
        this.setState({
          courseinfo: [...findresponse],
        });
      })
      .catch(err => console.log(err));
  }

  handleLogout = () => {
    Auth.logout();
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      this.props.history.push('/login/');
    } else {
      // production
      this.props.history.push(`${prodUrl}/login/`);
    }
  };

  handleAddNewName = event => {
    event.preventDefault();
    const data = {
      program: this.programRef.current.value,
      course: this.courseRef.current.value,
    };

    fetch('/addnewcourseinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(body => {
        console.log('State: ', body);
        // refetch to rerender updated courseinfo
        return fetch('/courseinfo');
      })
      .then(response => response.json())
      .then(findresponse => {
        this.setState({
          courseinfo: [...findresponse],
        });
      })
      .catch(err => console.log(err));

    this.setState({
      success: true,
    });
  };

  handleDeleteName = () => {
    console.log(this.state.curName);
    const data = this.state.curName;
    const nameId = this.state.curName.ID;
    const urlName = `/deletecourseinfo/${nameId}`;
    fetch(urlName, {
      method: 'delete',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log('deleted');
        // refetch to rerender updated nameList
        return fetch('/courseinfo');
      })
      .then(response => response.json())
      .then(findresponse => {
        this.setState({
          courseinfo: [...findresponse],
        });
      })
      .catch(err => console.log(err));

    this.setState({
      success: true,
    });
  };

  handleEditName = event => {
    event.preventDefault();
    // it might not need to update state
    const data = {
      program: this.programRef.current.value,
      course: this.courseRef.current.value,
      curName: this.state.curName,
    };
    // updating new name
    const nameId = this.state.curName.ID;
    const urlName = `/editcourseinfo/${nameId}`;
    fetch(urlName, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log('updated');
        // refetch to rerender updated nameList
        return fetch('/courseinfo');
      })
      .then(response => response.json())
      .then(findresponse => {
        this.setState({
          courseinfo: [...findresponse],
        });
      })
      .catch(err => console.log(err));
    this.setState({
      success: true,
    });
  };

  handleOpen = (p, type) => {
    this.setState({ open: true, curName: p, type, success: false });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleEdit = () => {
    if (this.state.type.type === 'edit') {
      return (
        // edit course form
        <div className="message">
          <h2 className="message__heading">Current name</h2>
          <p>Program: {this.state.curName.program}</p>
          <p>Courses: {this.state.curName.course}</p>
          <h2 className="message__heading">New Name</h2>
          <form className="naming-edit" onSubmit={this.handleEditName}>
            <span>Program</span>
            <input name="Program" ref={this.programRef} type="text" placeholder="Program name" />
            <span>Course</span>
            <input name="Course" ref={this.courseRef} type="text" placeholder="Course name" />
            <div className="center">
              <button className="btn btn__summary" type="submit">
                Change Name
              </button>
              {this.state.success ? <p className="message__warning--success">Success!</p> : ''}
            </div>
          </form>
        </div>
      );
    }
    if (this.state.type.type === 'delete') {
      return (
        <div className="message">
          <h2 className="message__heading">Current name</h2>
          <p>Program: {this.state.curName.program}</p>
          <p>Courses: {this.state.curName.courseNumber}</p>
          <p className="message__warning">
            Are you sure you want to remove this name from courseinfo table?
          </p>

          <div className="popupbtn--container">
            <button
              className="btn btn__summary popupbtn--delete"
              onClick={() => this.handleDeleteName()}
            >
              Delete Name
            </button>
            <button
              className="btn btn__summary popupbtn--cancle"
              onClick={() => this.handleClose()}
            >
              Cancle
            </button>
          </div>
          {this.state.success ? <p className="message__warning--success">Success!</p> : ''}
        </div>
      );
    }
    // add new program/course form
    return (
      <div className="message">
        <h2 className="message__heading">New Name</h2>
        <form className="naming-edit" onSubmit={this.handleAddNewName}>
          <span>Program</span>
          <input
            name="Program"
            ref={this.programRef}
            type="text"
            placeholder="Program name. eg.ENVST"
            required
          />

          <span>Course Number</span>
          <input
            name="Course"
            ref={this.courseRef}
            type="text"
            placeholder="Course number. eg.ENVST978"
            required
          />
          <div className="center">
            <button className="btn btn__summary" type="submit">
              Add New Program/Course
            </button>
            {this.state.success ? <p className="message__warning--success">Success!</p> : ''}
          </div>
        </form>
      </div>
    );
  };

  render() {
    const actions = [
      <button className="btn btn__summary" onClick={this.handleClose}>
        Close
      </button>,
    ];
    return (
      <AppProvider>
        <div className="wrapper">
          <MuiThemeProvider>
            <Dialog
              title="Edit Course List"
              autoScrollBodyContent
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
              {this.handleEdit()}
            </Dialog>
          </MuiThemeProvider>
          <h1 className="App-title">Edit Course Info for DB</h1>
          <div className="guide">
            <div className="guide__popup">
              <button
                type="button"
                className="btn btn__logout btn--marginRight"
                onClick={() => this.handleLogout()}
              >
                Logout
              </button>
              <AppContext.Consumer>
                {context => {
                  return (
                    <React.Fragment>
                      <button
                        className="btn btn__guide"
                        onClick={() => {
                          if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
                            this.props.history.push('/editname');
                          } else {
                            // production code
                            this.props.history.push(`${context.production}/editname/`);
                          }
                        }}
                      >
                        Edit naming guide
                      </button>
                    </React.Fragment>
                  );
                }}
              </AppContext.Consumer>
            </div>
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
                          this.props.history.push(`${context.production}`);
                        }
                      }}
                    >
                      BACK TO REPORT PAGE
                    </button>
                  </React.Fragment>
                );
              }}
            </AppContext.Consumer>
          </div>
          <div className="form-list form-list--report">
            <div className="message__text--body">
              <p className="heading-primary center">
                This is the table that is used in program/course number search.
              </p>
              <p className="heading-secondary center">
                The change of this will impact auto-suggestion for program names and course numbers
              </p>
              <div className="center">
                <button
                  className="btn btn__guide btn--margin"
                  onClick={() => this.handleOpen({ program: '', course: '' }, { type: 'new' })}
                >
                  Add New Course
                </button>
              </div>

              <ul>
                {this.state.courseinfo.map((p, i) => {
                  return (
                    <li key={i} style={{ wordSpacing: '3px' }}>
                      {p.program}: {p.courseNumber} {p.semesterTerm}{' '}
                      <button
                        className="btn btn__remove"
                        onClick={() => this.handleOpen(p, { type: 'edit' })}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn__remove"
                        onClick={() => this.handleOpen(p, { type: 'delete' })}
                      >
                        remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </AppProvider>
    );
  }
}
export default withAuth(EditCourseInfo);
EditCourseInfo.propTypes = {
  history: PropTypes.object.isRequired,
};
