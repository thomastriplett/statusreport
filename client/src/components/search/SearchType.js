// Parent component for SearchForm and SearchSelector
// Similar to Form component

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchSelector from './SearchSelector';
import SearchForm from './SearchForm';

class SearchType extends Component {
  render() {
    const searchType = this.props.searchType === 'user' ? 'Search by User' : 'Search by Course';
    return (
      <div className="form-list form-list--search">
        <SearchSelector selectSearch={this.props.selectSearch} />
        <h2 className="heading-primary center">{searchType}</h2>
        <SearchForm
          searchType={this.props.searchType}
          addSearchOptions={this.props.addSearchOptions}
          handleSearch={this.props.handleSearch}
          programSearchType={this.props.programSearchType}
        />
      </div>
    );
  }
}

export default SearchType;
SearchType.propTypes = {
  searchType: PropTypes.string.isRequired,
  selectSearch: PropTypes.func.isRequired,
  addSearchOptions: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  programSearchType: PropTypes.func.isRequired,
};
