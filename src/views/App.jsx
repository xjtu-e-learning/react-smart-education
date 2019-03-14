import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import RecommendationList from './recommendation-list';
import TitleBar from './titlebar';
import FacetList from './facet-list';
import AssembleList from './assemble-list';
import { observer, inject } from 'mobx-react';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { post_log_of_visit } from '../log/post-log-SDK';

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

@inject('appState')
@observer
class App extends Component {
  
  resize = () => {
    this.props.appState.setClientHeight();
  };

  componentWillMount() {
    // 解析课程id
    if (queryString.parse(this.props.location.search).courseId !== undefined) {
      this.props.appState.setCourseId(
        queryString.parse(this.props.location.search).courseId
      );
    }

    // 解析学生id
    if (
      queryString.parse(this.props.location.search).studentCode !== undefined
    ) {
      this.props.appState.setStudentCode(
        queryString.parse(this.props.location.search).studentCode
      );
    }
    post_log_of_visit();
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  render() {
    return (
      <div className={this.props.classes.root} style={{ height: this.props.appState.clientHeight }}>
        <TitleBar/>
        <RecommendationList/>
        <FacetList/>
        <AssembleList/>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(App));
