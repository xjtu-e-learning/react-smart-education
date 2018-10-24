import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import appState from '../../../../store/app-state';

const styles = theme => ({
  mark: {
    color: '#d7daed',
    paddingLeft: 8
  },
  bgGre: {
    background: '#7FC236',
    color: '#000',
    padding: '1px 5px',
    borderRadius: '10px',
    lineHeight: '18px',
    marginRight: 6
  },
  bgBlu: {
    background: '#548FFB',
    color: '#000',
    padding: '1px 5px',
    borderRadius: '10px',
    lineHeight: '18px',
    marginRight: 6
  },
  bgGry: {
    background: '#D8D8D8',
    color: '#000',
    padding: '1px 5px',
    borderRadius: '10px',
    lineHeight: '18px'
  }
});


@inject('appState')
@observer
class RecommendationStatus extends React.Component {
  render() {
    const { classes, appState } = this.props;
    let topicStateDic = {};
    appState.topicStateList.map(topic => {
      topicStateDic[topic.topicName] = topic.state;
    });

    let currRecommendationlist = appState.currentRecommendationList;

    let successNum = 0, processNum = 0, defaultNum = 0;
    if (currRecommendationlist !== undefined) {
      for (var i = 0; i < currRecommendationlist.length; i++) {
        if (topicStateDic[currRecommendationlist[i].topicName] === '2')
          successNum++;
        else if (topicStateDic[currRecommendationlist[i].topicName] === '1')
          processNum++;
        else
          defaultNum++;
      }
    }

    return (
      <div className={classes.mark}>
        <span>已学习:<label className={classes.bgGre}>{successNum}</label></span>
        <span>正在学习:<label className={classes.bgBlu}>{processNum}</label></span>
        <span>未学习:<label className={classes.bgGry}>{defaultNum}</label></span>
      </div>
    );
  }
}

export default withStyles(styles)(RecommendationStatus);