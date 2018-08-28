import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import KnowledgeForestModal from './knowledge-forest-modal';
import { post_log_of_mouseclick_Global_Graph } from '../../../log/post-log-SDK';

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
  showModal = (studentCode, courseId, domainName) => {
    this.props.appState.setKnowledgeForestVisible(true);
    if (studentCode !== -1 && courseId !== -1 && domainName !== undefined) {
      post_log_of_mouseclick_Global_Graph('学习页面', studentCode, courseId, domainName);
    }
  };

  handleOk = () => {
    this.props.appState.setKnowledgeForestVisible(false);
  };

  handleCanel = () => {
    this.props.appState.setKnowledgeForestVisible(false);
  };

  render() {
    const { classes } = this.props;
    const { appState } = this.props;
    let studentCode = appState.studentCode;
    let courseId = appState.courseId;
    let domainName = appState.domainName.get();
    return (
      <div>
        <img src='./forest_256.png' className={classes.image}
             onClick={this.showModal.bind(this, studentCode, courseId, domainName)}/>
        <Modal
          title='知识森林'
          visible={this.props.appState.knowledgeForestVisible}
          onOk={this.handleOk}
          onCancel={this.handleCanel}
          centered
          width={1200}
        >
          <KnowledgeForestModal/>
        </Modal>
      </div>
    );
  }
}

export default withStyles(styles)(KnowledgeForesst);