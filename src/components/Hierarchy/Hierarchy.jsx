import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Map } from 'immutable';

import { select } from 'd3-selection';
import { ThemeProvider } from '@rmwc/theme';
import { TextField } from '@rmwc/textfield';
import { Icon } from '@rmwc/icon';
import { Fab } from '@rmwc/fab';
import { CircularProgress } from '@rmwc/circular-progress';

import _d3 from './d3';

import './styles/styles.css';

class Hierarchy extends Component {
    static propTypes = {
        data: PropTypes.object,
        isPending: PropTypes.bool,
        minWidth: PropTypes.any,
        minHeight: PropTypes.any,
        searchQuery: PropTypes.string,
        onSelectionClear: PropTypes.func,
        onSearchSubmit: PropTypes.func,
        onItemClick: PropTypes.func.isRequired,
        formatLabelText: PropTypes.func
    };

    static defaultProps = {
        isPending: false,
        minWidth: 'auto',
        minHeight: 'auto',
        searchQuery: null
    };

    constructor(props) {
        super(props);

        this.handleFullscreen = this.handleFullscreen.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchClear = this.handleSearchClear.bind(this);
        this.handleSelectionClear = this.handleSelectionClear.bind(this);

        this.state = {
            isFullscreen: false,
            searchString: ''
        };
    }

    componentDidMount() {
        const {
            searchQuery,
            onItemClick,
            formatLabelText
        } = this.props;

        this._d3 = new _d3({
            root: this._root,
            searchQuery: searchQuery,
            onItemClick: onItemClick,
            onSelectionClear: this.handleSelectionClear,
            formatLabelText: formatLabelText
        });

        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("mousemove");
    }

    componentDidUpdate(prevProps) {
        const { data, searchQuery } = this.props;

        if (!Map.isMap(data)) {
            return;
        }

        if (!data.equals(prevProps.data)) {
            this._d3.updateData(data.toJS());
        }

        if (searchQuery !== prevProps.searchQuery) {
            if (searchQuery === null) {
                this._d3.resetSelection();
            } else {
                this._d3.setSelection(searchQuery);
            }
        }
    }

    handleSelectionClear() {
        const { onSelectionClear } = this.props;

        this.setState(() => ({ searchString: '' }), onSelectionClear);
    }

    handleResize() {
        this._d3.updateDimensions();
    }

    handleFullscreen() {
        this.setState(
            state => ({ isFullscreen: !state.isFullscreen }),
            this.handleResize
        );
    }

    handleSearchSubmit() {
        const { onSearchSubmit } = this.props;
        const { searchString } = this.state;

        onSearchSubmit(searchString);
    }

    handleSearchChange(ev) {
        ev.persist();
        this.setState(() => ({ searchString: ev.target.value }));
    }

    handleSearchClear() {
        this._d3.resetSelection();
        this.setState(() => ({ searchString: '' }));
    }

    render() {
        const { minWidth, minHeight, isPending, searchQuery } = this.props;
        const { isFullscreen, searchString } = this.state;

        return (
            <div
                className={cx([
                    'container',
                    {
                        'container--is-fullscreen': isFullscreen
                    }
                ])}
                style={{
                    minWidth,
                    minHeight
                }}
                ref={node => {
                    this._root = select(node);
                }}
            >
                {isPending ? (
                    <div className="loaderContainer">
                        <CircularProgress size="xlarge" />
                    </div>
                ) : null}
                <div className="toolbar--top-left">
                    <ThemeProvider
                        options={{
                            primary: 'rgba(0, 0, 0, 0.54)'
                        }}
                    >
                        {searchQuery ? (
                            <TextField
                                className="searchBar"
                                value={searchQuery}
                                readOnly
                                trailingIcon={{
                                    icon: 'close',
                                    tabIndex: 0,
                                    onClick: this.handleSearchClear
                                }}
                            />
                        ) : (
                            <TextField
                                className="searchBar"
                                value={searchString}
                                onChange={this.handleSearchChange}
                                trailingIcon={{
                                    icon: 'search',
                                    tabIndex: 0,
                                    onClick: this.handleSearchSubmit
                                }}
                            />
                        )}
                    </ThemeProvider>
                </div>
                <div className="toolbar--top-right">
                    <Fab
                        className="toolbarIcon"
                        onClick={() => this.handleFullscreen()}
                    >
                        <Icon
                            icon={{
                                icon: isFullscreen
                                    ? 'fullscreen_exit'
                                    : 'fullscreen',
                                size: 'medium'
                            }}
                        />
                    </Fab>
                    <Fab
                        className="toolbarIcon"
                        onClick={() => this._d3.reload()}
                    >
                        <Icon icon={{ icon: 'refresh', size: 'medium' }} />
                    </Fab>
                </div>
                <div className="toolbar--bottom">
                    <Fab
                        className="toolbarIcon"
                        onClick={() => this._d3.zoomIn()}
                    >
                        <Icon icon={{ icon: 'add', size: 'medium' }} />
                    </Fab>
                    <Fab
                        className="toolbarIcon"
                        onClick={() => this._d3.resetZoom()}
                    >
                        <Icon icon={{ icon: 'gps_fixed', size: 'small' }} />
                    </Fab>
                    <Fab
                        className="toolbarIcon"
                        onClick={() => this._d3.zoomOut()}
                    >
                        <Icon icon={{ icon: 'remove', size: 'medium' }} />
                    </Fab>
                </div>
            </div>
        );
    }
}

export default Hierarchy;