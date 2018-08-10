import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import RecommendationList from './recommendation-list';
import TitleBar from './titlebar';
import FacetList from './facet-list';
import AssembleList from './assemble-list';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  toolbar: theme.mixins.toolbar
});

class App extends Component {
  render() {
    return (
      <div className={this.props.classes.root}>
        <TitleBar />
        <RecommendationList />
        <FacetList />
        <AssembleList />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
