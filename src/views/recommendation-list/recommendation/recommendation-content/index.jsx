import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BookIcon from '@material-ui/icons/Book';
import { inject, observer } from 'mobx-react';
import { Badge, Popover } from 'antd';
import { post_log_of_mouseover_topic } from '../../../../log/post-log-SDK';
import appState from '../../../../store/app-state';
import Collapse from '@material-ui/core/Collapse';
import StarBorder from '@material-ui/icons/StarBorder';

const styles = theme => ({
  topic: {
    color: 'white'
  },
  specialTopic: {
    color: 'white',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '136px'
  },
  highlightStyle: {
    backgroundColor: '#374d53 !important',
    borderLeft: '1px solid #61d9fa'
  },
  fontsize12: {
    fontSize: '12px',
    paddingRight: 0
  },
  fontsize14: {
    fontSize: '14px',
    paddingRight: 0
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: 0
  },
  padding16: {
    paddingLeft: 16,
    paddingRight: 16
  },
  nav: {
    height: document.body.clientHeight - 408,
    overflow: 'auto'
  }
});

@inject('appState')
@observer
class RecommendationContent extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = (studentCode, courseId, domainName, topicName, topicId, event) => {
    this.props.appState.setCurrentTopicName(event.target.innerText);
    this.props.appState.setCurrentTopicId(event.target.id);
    this.props.appState.setCurrentFacet('', '', -1, -1);
    this.props.appState.updateFacetTopicStateList();
    this.props.appState.setCurrentPage(0);
    // console.log(studentCode + ' ' + courseId + ' ' + domainName + ' ' + topicName + ' ' + topicId);
    if (studentCode !== -1 && courseId !== -1 && domainName !== undefined && topicName !== '' && topicId !== -1) {
      post_log_of_mouseover_topic('学习页面', topicName, topicId, studentCode, courseId, domainName);
    }
  };

  render() {
    const { classes, appState } = this.props;
    let topicStateDic = {};
    appState.topicStateList.map(topic => {
      topicStateDic[topic.topicName] = topic.state;
    });

    let studentCode = appState.studentCode;
    let courseId = appState.courseId;
    let domainName = appState.domainName.get();

    const specialCourseId = ['5'];

    // 如果当前的课程编号不是特殊课程
    if (specialCourseId.indexOf(courseId) === -1) {
      return (
        <List component="nav" className={classes.nav}
              style={{ height: (appState.currentRecommendation === '零基础' && 'calc(100% - 76px)') || 'calc(100% - 123px' }}>
          {appState.currentRecommendationList !== undefined
            ? appState.currentRecommendationList.map(topic => {
              let topicId = topic.topicId;
              let topicName = topic.topicName;
              let facet = appState.facetsList.get() !== undefined && appState.facetsList.get()[topicName];
              facet = Array.from(facet);
              const content = (facet !== undefined) &&
                (
                  <div>
                    <List style={{ width: 200 }}>
                      {facet.map(firstLayer =>
                        <div key={firstLayer.firstLayerFacetId}>
                          <ListItem key={firstLayer.firstLayerFacetId} className={classes.padding16}>
                            <ListItemText disableTypography
                                          className={classes.fontsize14}
                                          primary={firstLayer.firstLayerFacetName}/>
                          </ListItem>
                          {firstLayer.secondLayerFacets.length !== 0 &&
                          (
                            <Collapse in={true} timeout="auto" unmountOnExit>
                              {firstLayer.secondLayerFacets.map(secondLayer =>
                                <ListItem key={secondLayer.secondLayerFacetId} className={classes.nested}>
                                  <ListItemIcon>
                                    <StarBorder style={{ fontSize: 16, marginRight: 0 }}/>
                                  </ListItemIcon>
                                  <ListItemText disableTypography className={classes.fontsize12}
                                                primary={secondLayer.secondLayerFacetName}/>
                                </ListItem>
                              )}
                            </Collapse>
                          )
                          }
                        </div>
                      )}
                    </List>
                  </div>
                );
              return (
                <Popover content={content} trigger={'hover'} key={topic.topicId} placement="rightTop">
                  <ListItem button
                            classes={{ selected: classes.highlightStyle }}
                            selected={Number(appState.currentTopic.topicId) === topicId}
                  >
                    <div>
                      <Badge
                        status={(topicStateDic[topic.topicName] === '2' && 'success') || (topicStateDic[topic.topicName] === '1' && 'processing') || (topicStateDic[topic.topicName] === '0' && 'default') || 'default'}/>
                    </div>

                    <ListItemIcon>
                      <BookIcon className={classes.topic}/>
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      className={classes.topic}
                      primary={topic.topicName}
                      id={topic.topicId}
                      onClick={this.handleClick.bind(this, studentCode, courseId, domainName, topicName, topicId)}
                    />
                  </ListItem>
                </Popover>
              );
            })
            : null}
        </List>
      );
    }
    else {
      // 针对特殊课程
      return (
        <List component="nav" className={classes.nav}
              style={{ height: (appState.currentRecommendation === '零基础' && 'calc(100% - 76px)') || 'calc(100% - 123px' }}>
          {appState.currentRecommendationList !== undefined
            ? appState.currentRecommendationList.map(topic => {
              let topicId = topic.topicId;
              let topicName = topic.topicName;
              const content = topicName;
              return (
                <Popover content={content} trigger={'hover'} key={topic.topicId} placement="rightTop">
                  <ListItem button
                            classes={{ selected: classes.highlightStyle }}
                            selected={Number(appState.currentTopic.topicId) === topicId}
                  >
                    <div>
                      <Badge
                        status={(topicStateDic[topic.topicName] === '2' && 'success') || (topicStateDic[topic.topicName] === '1' && 'processing') || (topicStateDic[topic.topicName] === '0' && 'default') || 'default'}/>
                    </div>
                    <ListItemText
                      disableTypography
                      className={classes.specialTopic}
                      primary={topic.topicName}
                      id={topic.topicId}
                      onClick={this.handleClick.bind(this, studentCode, courseId, domainName, topicName, topicId)}
                    />
                  </ListItem>
                </Popover>
              );
            })
            : null}
        </List>
      )
        ;
    }
  }

}

RecommendationContent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RecommendationContent);
