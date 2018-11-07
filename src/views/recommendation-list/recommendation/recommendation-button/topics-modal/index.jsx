import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Modal, Popover } from 'antd';
import { inject, observer } from 'mobx-react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Button from '@material-ui/core/Button';
import WhatshotIcon from '@material-ui/icons/WhatshotRounded';

const styles = theme => ({
  gridList: {
    width: '100%',
    height: 600
  },
  label: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: ' nowrap'
  }
});

@inject('appState')
@observer
class TopicsModal extends React.Component {


  handleOk = () => {
    this.props.appState.setTopicListVisible(false);
  };

  handleCanel = () => {
    this.props.appState.setTopicListVisible(false);
  };

  handleClick = (topicId, topicName) => {
    this.props.appState.chooseTopic(topicName, topicId);
  };

  render() {
    const { classes } = this.props;
    const { appState } = this.props;
    let topicList = appState.topicList.get();

    return (
      <Modal
        title='知识主题列表'
        visible={this.props.appState.topicListVisible}
        onOk={this.handleOk}
        onCancel={this.handleCanel}
        centered
        width={800}
      >
        <GridList className={classes.gridList} cols={4} cellHeight='auto'>
          {topicList !== undefined && topicList.map(topic => (
            <GridListTile key={topic.topicId}>
              <Popover content={<div><p>{topic.topicName}</p></div>}>
                <Button variant="outlined" style={{ width: '100%' }}
                        onClick={this.handleClick.bind(this, topic.topicId, topic.topicName)}
                        classes={{ label: classes.label }}
                >
                  {appState.hotTopics.get().indexOf(topic.topicId.toString()) !== -1 &&
                  <WhatshotIcon style={{ color: 'red' }}/>}
                  {topic.topicName}
                </Button>
              </Popover>
            </GridListTile>
          ))}
        </GridList>
      </Modal>
    );
  }
}

export default withStyles(styles)(TopicsModal);