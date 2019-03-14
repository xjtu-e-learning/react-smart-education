import React from 'react';
import { Breadcrumb } from 'antd';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { post_log_of_mouseclick_facet, post_log_of_mouseover_topic } from '../../../log/post-log-SDK';

const styles = theme => ({
  breadcrumb: {
    paddingLeft: 16,
    flexGrow: 1
  },
  mouse: {
    cursor: 'pointer'
  }
});

@inject('appState')
@observer
class Navigation extends React.Component {
  handleClickDelFacet = (studentCode, courseId, domainName, topicName, topicId) => {
    this.props.appState.setCurrentPage(0);
    this.props.appState.setCurrentFacet('', '', -1, -1);
    if (studentCode !== -1 && courseId !== -1 && domainName !== undefined && topicName !== '' && topicId !== -1) {
      post_log_of_mouseover_topic('学习页面', topicName, topicId, studentCode, courseId, domainName);
    }
  };

  handleClickDelSecondFacet = (firstLayerFacetName, topicName, topicId, firstLayerFacetId, studentCode, courseId, domainName) => {
    this.props.appState.setCurrentPage(0);
    this.props.appState.setCurrentSecondFacet('', -1);
    if (studentCode !== -1 && courseId !== -1 && domainName !== undefined) {
      post_log_of_mouseclick_facet('学习页面', '点击-1级分面', topicName, topicId
        , firstLayerFacetName, firstLayerFacetId, null, null, studentCode, courseId, domainName);
    }
  };

  render() {
    const { appState, classes } = this.props;
    const studentCode = appState.studentCode;
    const courseId = appState.courseId;
    const domainName = appState.domainName.get();
    const topicName = appState.currentTopic.topicName;
    const topicId = appState.currentTopic.topicId;
    const firstLayerFacetName = appState.currentFacet.firstLayer;
    const firstLayerFacetId = appState.currentFacet.firstLayerId;

    return (
      <Breadcrumb className={classes.breadcrumb}>
        {appState.currentTopic.topicName !== '' && (
          <Breadcrumb.Item>
            {appState.currentFacet.firstLayer !== '' ? (
              <a onClick={this.handleClickDelFacet.bind(this, studentCode, courseId, domainName, topicName, topicId)}>
                {appState.currentTopic.topicName}
              </a>
            ) : (
              appState.currentTopic.topicName
            )}
          </Breadcrumb.Item>
        )}
        {appState.currentFacet.firstLayer !== '' && (
          <Breadcrumb.Item>
            {appState.currentFacet.secondLayer !== '' ? (
              <a
                onClick={this.handleClickDelSecondFacet.bind(this, firstLayerFacetName, topicName, topicId, firstLayerFacetId, studentCode, courseId, domainName)}>
                {appState.currentFacet.firstLayer}
              </a>
            ) : (
              appState.currentFacet.firstLayer
            )}
          </Breadcrumb.Item>
        )}
        {appState.currentFacet.secondLayer !== '' && (
          <Breadcrumb.Item>{appState.currentFacet.secondLayer}</Breadcrumb.Item>
        )}
      </Breadcrumb>
    );
  }
}

export default withStyles(styles)(Navigation);
