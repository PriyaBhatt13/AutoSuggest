import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import { requestApiData } from './actions';

class Home extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            searchInputValue: '',
            hasSuggestions: false
        };

    }
    renderSearchBar() {


        return (
            <div className='searchbar-wrapper'>
                <form name='form-global-search'>
                    <div className='search-text-wrapper'>
                        <input type='text'
                            placeholder='search here'
                            autoComplete='off'
                            name='txtGlobalSearch'
                            id='txtGlobalSearch'
                            className='txt-global-search'
                            onChange= { this.handleOnChange }
                            value={ this.state.searchInputValue }
                            aria-autocomplete='both'
                            aria-owns='results'
                            ref={(input) => {
                                this.textInput = input;
                            }}
                        />
                        <div className='search-suggestions-wrapper'>
                            { this.state.hasSuggestions && this.showSearchSuggestions() }
                        </div>
                    </div>
                        <div className='search-button-wrapper'>
                            <input type='submit'
                                value='Search'
                                className='btn-global-search'
                            />
                        </div>
                </form>
            </div>
        );
    }

    handleOnChange = (event) => {

        this.setState({
            searchInputValue: event.target.value
        }, this.getSearchSuggestions );
    }

    getSearchSuggestions() {

        this.props.requestApiData(this.state.searchInputValue);
        this.setState({
            hasSuggestions: this.props.data.items ? this.props.data : { items: [] }
        });
    }

    handleSuggestionFocus = (event) => {
        this.setState({
            searchInputValue: event.target.getAttribute('data-suggestion-value')
        });
    }

    showSearchSuggestions() {
        const data = this.props.data.items ? this.props.data : { items: [] };

        return (
            <ul className='search-suggestions-list' role='listbox' id='results' ref='results'>
            {
               data.items.map(( dataItem, index ) => {
                   let matches = match( dataItem.snippet.title, this.state.searchInputValue );
                   let parts = parse(dataItem.snippet.title, matches);
                   let activedescendant = `suggestion-${index + 1}`;

                   return (
                        <li className='search-suggestions-list-item'
                            key={ dataItem.snippet.title + index }
                            id={activedescendant}
                            ref={activedescendant}
                            role='option'                            
                            aria-selected={false}
                            >
                            <button
                                type='button'
                                onClick={ this.handleSuggestionSelect }
                                onFocus = { this.handleSuggestionFocus }
                                data-suggestion-value={ dataItem.snippet.title }
                                value={ dataItem.snippet.title }
                            >
                            {parts.map((part, index) => {
                                const highlighter = part.highlight ? 'search-suggestion-match' : null;

                                return (
                                  <span className={highlighter}
                                    data-suggestion-value={ dataItem.snippet.title }
                                    key={ part.text + index }>
                                    {part.text}
                                  </span>
                                );
                            })}
                            </button>
                        </li>
                   );
               })
            }
            </ul>
        );
    }

    handleSuggestionSelect = (event) => {
        this.setState({
            searchInputValue: event.target.getAttribute('data-suggestion-value'),
            hasSuggestions: false
        }, this.textInput.focus());
    }


    getActiveElement = () => {
        let activeItem;
        const b = this.refs;

        for (var key in b) {
            if (b[key].getAttribute('aria-selected') === 'true') {
                activeItem = key;
            }
        }

        return activeItem ? this.refs[activeItem] : '';
    }


    /**
     * handleKeyDown - triggered on keypress
     *
     * @param { object } event element events
    */

    handleKeyDown = (event) => {
        const { keyCode } = event;
        const activeItem = this.getActiveElement();

        switch (keyCode) {
          /* Arrow down*/
            case 40:
                if (!activeItem) {
                    this.focusFirstElement();
                }
                else {
                    activeItem.nextSibling ? this.focusNextElement() : this.focusFirstElement();
                }
                break;

          /* Arrow up*/
            case 38:
                if (!activeItem) {
                    this.focusLastElement();
                }
                else {
                    activeItem.previousSibling ? this.focusPreviousElement() : this.focusLastElement();
                }
                break;
            /* Escape */
            case 27:
                this.setState({
                    hasSuggestions: false,
                    searchInputValue: ''
                });
                break;
            /* Tab */
            case 9:
                this.setState({
                    hasSuggestions: false
                });
                break;
            default:
                break;

        }
    }

    focusFirstElement = () => {
        const activeItem = this.getActiveElement();

        this.refs.results.firstElementChild.firstElementChild.focus();
        if (activeItem) {
            activeItem.setAttribute('aria-selected', 'false');
        }
        this.refs.results.firstElementChild.setAttribute('aria-selected', 'true');
    }

    focusLastElement = () => {
        this.refs.results.lastElementChild.firstElementChild.focus();
        this.refs.results.lastElementChild.setAttribute('aria-selected', 'true');
    }

    focusNextElement = () => {
        const activeItem = this.getActiveElement();

        activeItem.nextSibling.firstElementChild.focus();
        activeItem.setAttribute('aria-selected', 'false');
        activeItem.nextSibling.setAttribute('aria-selected', 'true');
    }

    focusPreviousElement = () => {
        const activeItem = this.getActiveElement();

        activeItem.previousSibling.firstElementChild.focus();
        activeItem.setAttribute('aria-selected', 'false');
        activeItem.previousSibling.setAttribute('aria-selected', 'true');
    }

    render() {
        return (
      <div className='global-search' onKeyDown={ this.handleKeyDown } role='group'>
          { this.renderSearchBar() }
      </div>
        );
    }
}

const mapStateToProps = state => ({ data: state.data });

const mapDispatchToProps = dispatch =>
  bindActionCreators({ requestApiData }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
