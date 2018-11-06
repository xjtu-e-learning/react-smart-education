import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Menu, Dropdown } from 'antd';

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

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_self" rel="noopener noreferrer" href="?courseId=201&studentCode=3117033016">数据结构</a>
    </Menu.Item>
    <Menu.Item>
      <a target="_self" rel="noopener noreferrer" href="?courseId=5&studentCode=3117033016">Java(video course)</a>
    </Menu.Item>
  </Menu>
);

@inject('appState')
@observer
class CourseInfo extends React.Component {

  render() {
    const { classes } = this.props;
    const topicNum = this.props.appState.topicList.get() !== undefined ? this.props.appState.topicList.get().length : 0;
    return (
      <div className={classes.right}>
        <span>课程：
          <Dropdown overlay={menu}>
            <label className={classes.blue}>{this.props.appState.domainName.get()}</label>
          </Dropdown>
        </span>
        <span className={classes.span}>知识主题：<label className={classes.orange}>{topicNum}</label></span>
        <span className={classes.span}><AccountCircleIcon className={classes.icon}/> Yotta同学</span>
      </div>
    );
  }
}

export default withStyles(styles)(CourseInfo);