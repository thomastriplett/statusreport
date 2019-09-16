// Auto suggestion for user name
// Check https://github.com/moroshko/react-autosuggest for further infomration
import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

// Autosugesstion
let userData = [{}];
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  return inputLength === 0
    ? []
    : userData.filter(user => user.name.toLowerCase().slice(0, inputLength) === inputValue);
};
const getSuggestionValue = suggestion => suggestion.name;
const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

class UserSuggestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [],
      noSuggestions: false,
    };
  }

  componentDidMount() {
    // get user info from database for Autosugesstion
    fetch('/users')
      .then(res => res.json())
      .then(users => {
        userData = users;
      })
      .catch(error => console.error('fetch error at componentDidMount', error)); // error
  }

  // Autosugesstion methods start
  onChange = (event, { newValue }) => {
    this.props.handleUserName(newValue);
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    const suggestions = getSuggestions(value);
    const isInputBlank = value.trim() === '';
    const noSuggestions = !isInputBlank && suggestions.length === 0;
    this.setState({
      suggestions: getSuggestions(value),
      noSuggestions,
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions, noSuggestions } = this.state;
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Type your name',
      value,
      onChange: this.onChange,
    };
    return (
      <React.Fragment>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
        {noSuggestions && <p className="no-suggestion">No name in the database</p>}
      </React.Fragment>
    );
  }
}
export default UserSuggestion;
UserSuggestion.propTypes = {
  handleUserName: PropTypes.func.isRequired,
};
