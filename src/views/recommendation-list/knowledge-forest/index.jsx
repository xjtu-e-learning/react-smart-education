import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import KnowledgeForestModal from './knowledge-forest-modal';

const styles = theme => ({
  image: {
    height: 240,
    width: 240,
    bottom: 0,
    position: 'fixed',
    cursor: 'pointer'
  }
});

@inject('appState')
@observer
class KnowledgeForesst extends React.Component {
  showModal = () => {
    this.props.appState.setKnowledgeForestVisible(true);
  };

  handleOk = () => {
    this.props.appState.setKnowledgeForestVisible(false);
    this.props.appState.updateTopicStateList();
  };

  handleCanel = () => {
    this.props.appState.setKnowledgeForestVisible(false);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <img src='./forest_256.png' className={classes.image} onClick={this.showModal}></img>
        <Modal
          title='知识森林'
          visible={this.props.appState.knowledgeForestVisible}
          onOk={this.handleOk}
          onCancel={this.handleCanel}
          centered
        >
          <KnowledgeForestModal/>
        </Modal>
      </div>
    );
  }
}

export default withStyles(styles)(KnowledgeForesst);