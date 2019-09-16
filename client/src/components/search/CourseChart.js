// chart that is used in course Search

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';

// chart for user search summary
class CourseChart extends Component {
  render() {
    const courseData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#ff9063',
            '#64d2ff',
            '#6384ff',
            '#367700',
            '#d2ff63',
            '#a40a3c',
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#ff9063',
            '#64d2ff',
            '#6384ff',
            '#367700',
            '#d2ff63',
            '#a40a3c',
          ],
        },
      ],
    };
    const { programList } = this.props;
    // case where we have one course from search result
    // in this case, we show detail a chart of the course.
    if (Object.keys(this.props.programList).length === 1) {
      const listTask = programList[Object.keys(programList)[0]].list; // course information
      // iterate object
      for (const task in listTask) {
        if (Object.prototype.hasOwnProperty.call(listTask, task)) {
          courseData.labels.push(listTask[task].name);
          courseData.datasets[0].data.push(listTask[task].total);
        }
      }
      // case where we have several courses from search result
    } else {
      for (const program in programList) {
        if (Object.prototype.hasOwnProperty.call(programList, program)) {
          courseData.labels.push(program); // name of the program
          courseData.datasets[0].data.push(programList[program].total); // total hours for the program
        }
      }
    }

    return (
      <div>
        <Pie data={courseData} />
      </div>
    );
  }
}

export default CourseChart;

CourseChart.propTypes = {
  programList: PropTypes.object.isRequired,
};
