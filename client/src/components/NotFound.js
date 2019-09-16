// for invalid URL route

import React from 'react';

const NotFound = () => (
  <div className="notFound">
    <h1 className="notFound__title">Sorry, page not found</h1>
    <p className="notFound__message">
      The link you followed may be broken, outdated or there might be a database connection issue.
    </p>
    <p className="notFound__message">
      <p>To resolve the issue, please contact</p>
      <a href="mailto:eipdstatusreporting@lists.wisc.edu"> eipdstatusreporting@lists.wisc.edu.</a>
    </p>

    <button
      className="btn btn__notFound"
      onClick={() => {
        window.history.back();
      }}
    >
      Go Back
    </button>
  </div>
);

export default NotFound;
