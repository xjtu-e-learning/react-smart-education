import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BookIcon from '@material-ui/icons/Book';
import { inject, observer } from 'mobx-react';
import { Badge } from 'antd';
import { post_log_of_mouseover_topic } from '../../../log/post-log-SDK';

const styles = theme => ({
  topic: {
    color: 'white'
  }
});

@inject('appState')
@observer
class RecommendationContent extends React.Component {
  handleClick = (studentCode, courseId, domainName, topicName, topicId, event) => {
    this.props.appState.setCurrentTopicName(event.target.innerText);
    this.props.appState.setCurrentTopicId(event.target.id);
    this.props.appState.setCurrentFacet('', '', -1, -1);
    this.props.appState.updateFacetTopicStateList();
    // console.log(studentCode + ' ' + courseId + ' ' + domainName + ' ' + topicName + ' ' + topicId);
    if (studentCode !== -1 && courseId !== -1 && domainName !== undefined && topicName !== '' && topicId !== -1) {
      post_log_of_mouseover_topic('学习页面', topicName, topicId, studentCode, courseId, domainName);
    }
  };

  UNSAFE_componentWillMount() {
    this.props.appState.updateTopicStateList();
  }

  render() {
    const { classes, appState } = this.props;
    let topicStateDic = {};
    appState.topicStateList.map(topic => {
      topicStateDic[topic.topicName] = topic.state;
    });

    let studentCode = appState.studentCode;
    let courseId = appState.courseId;
    let domainName = appState.domainName.get();
    return (
      <List component="nav">
        {this.props.appState.currentRecommendationList !== undefined
          ? this.props.appState.currentRecommendationList.map(topic => {
            let topicId = topic.topicId;
            let topicName = topic.topicName;
            return (
              <ListItem button key={topic.topicName}>
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
            );
          })
          : null}
      </List>
    );
  }
}

RecommendationContent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RecommendationContent);
