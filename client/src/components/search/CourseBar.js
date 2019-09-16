// chart that is used in course Search

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

// chart for user search summary
class CourseBar extends Component {
  render() {
    const { courseTypeResult } = this.props;
    const courseData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: 'rgba(75, 144, 179, 0.40)',
          borderColor: 'rgba(75, 144, 179, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75, 144, 179, 0.69)',
          hoverBorderColor: 'rgba(75, 144, 179, 1)',
          label: 'Couse Types',
        },
      ],
    };

    // iterate object
    for (const program in courseTypeResult) {
      if (Object.prototype.hasOwnProperty.call(courseTypeResult, program)) {
        courseData.labels.push(program); // name of the program
        courseData.datasets[0].data.push(courseTypeResult[program].total); // total hours for the program
      }
    }

    return (
      <div>
        <Bar data={courseData} />
      </div>
    );
  }
}

export default CourseBar;

CourseBar.propTypes = {
  courseTypeResult: PropTypes.array.isRequired,
};
