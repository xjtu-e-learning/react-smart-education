import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const styles = theme => ({
  right: {
    float: 'right',
    color: '#999',
    paddingRight: 16,
    paddingTop: 11,
    paddingBottom: 15
  },
  blue: {
    backgroundColor: '#2d95fd',
    color: '#fff',
    padding: '1px 3px',
    borderRadius: 3
  },
  orange: {
    backgroundColor: '#ff7457',
    color: '#fff',
    padding: '1px 3px',
    borderRadius: 3
  },
  icon: {
    color: '#2d95fd',
    fontSize: 18,
    verticalAlign: 'sub'
  },
  span: {
    paddingLeft: 10
  }
});

@inject('appState')
@observer
class CourseInfo extends React.Component {

  render() {
    const { classes } = this.props;
    const topicNum = this.props.appState.topicList.get() !== undefined ? this.props.appState.topicList.get().length : 0;
    return (
      <div className={classes.right}>
        <span>课程：<label className={classes.blue}>{this.props.appState.domainName.get()}</label></span>
        <span className={classes.span}>知识主题：<lable className={classes.orange}>{topicNum}</lable></span>
        <span className={classes.span}><AccountCircleIcon className={classes.icon}/> Yotta同学</span>
      </div>
    );
  }
}

export default withStyles(styles)(CourseInfo);