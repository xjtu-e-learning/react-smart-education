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

const styles = theme => ({
  topic: {
    color: 'white'
  }
});

@inject('appState')
@observer
class RecommendationContent extends React.Component {
  handleClick = event => {
    this.props.appState.setCurrentTopicName(event.target.innerText);
    this.props.appState.setCurrentTopicId(event.target.id);
    this.props.appState.setCurrentFacet('', '');
    // console.log(event.target.id);
  };

  UNSAFE_componentWillMount() {
    this.props.appState.updateTopicStateList();
  }

  render() {
    const { classes } = this.props;
    let topicStateDic = {};
    this.props.appState.topicStateList.map(topic => {
      topicStateDic[topic.topicName] = topic.state;
    });
    return (
      <List component="nav">
        {this.props.appState.currentRecommendationList !== undefined
          ? this.props.appState.currentRecommendationList.map(topic => (
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
                onClick={this.handleClick}
              />
            </ListItem>
          ))
          : null}
      </List>
    );
  }
}

RecommendationContent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RecommendationContent);
