import React from 'react';
import { Breadcrumb } from 'antd';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import appState from '../../../store/app-state';

const styles = theme => ({
  breadcrumb: {
    paddingLeft: 16
  },
  mouse: {
    cursor: 'pointer'
  }
});

@inject('appState')
@observer
class Navigation extends React.Component {
  handleClickDelFacet = event => {
    this.props.appState.setCurrentFacet('', '');
  };

  handleClickDelSecondFacet = event => {
    this.props.appState.setCurrentSecondFacet('');
  };

  render() {
    const { appState, classes } = this.props;
    return (
      <Breadcrumb className={classes.breadcrumb}>
        {appState.currentTopic.topicName !== '' && (
          <Breadcrumb.Item>
            {appState.currentFacet.firstLayer !== '' ? (
              <a onClick={this.handleClickDelFacet}>
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
              <a onClick={this.handleClickDelSecondFacet}>
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
