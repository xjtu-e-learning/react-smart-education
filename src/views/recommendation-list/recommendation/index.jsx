import React from 'react';
import RecommendationButton from './recommendation-button';
import Divider from '@material-ui/core/Divider/Divider';
import RecommendationContent from './recommendation-content';
import RecommendationStatus from './recommendation-status';
import { withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

const styles = theme => ({
  divider: {
    backgroundColor: '#7AAAFB'
  }
});

@inject('appState')
@observer
class Recommendation extends React.Component {
  render() {
    return (
      <div style={{ height: this.props.appState.clientHeight - 244 }}>
        <RecommendationButton/>
        <Divider className={this.props.classes.divider}/>
        <RecommendationContent/>
        <RecommendationStatus/>
      </div>
    );
  }
}

export default withStyles(styles)(Recommendation);