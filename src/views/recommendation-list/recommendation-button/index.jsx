import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { inject, observer } from 'mobx-react';
import { post_log_of_mouseclick_recommendation } from '../../../log/post-log-SDK';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  white: {
    color: 'white'
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  select: {
    borderColor: 'white'
  },
  button: {
    margin: theme.spacing.unit,
    color: 'white',
    borderColor: 'white'
  },
  focused: {
    '&$focused': { color: 'white' }
  }
});

@inject('appState')
@observer
class RecommendationButton extends React.Component {
  state = {
    name: '零基础',
    labelWidth: 0
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    });
  }

  handleChange = (studentCode, courseId, domainName, event) => {
    this.setState({ name: event.target.value });
    this.props.appState.setCurrentRecommendation(event.target.value);
    if (studentCode !== -1 && courseId !== -1 && domainName !== undefined) {
      post_log_of_mouseclick_recommendation('学习页面', event.target.value, studentCode, courseId, domainName);
    }
  };

  render() {
    const { classes, appState } = this.props;
    let studentCode = appState.studentCode;
    let courseId = appState.courseId;
    let domainName = appState.domainName.get();
    const recnames = [
      '零基础',
      '自定义学习',
      '速成学习'
    ];
    if (appState.recommendationList.get() !== undefined && appState.currentTopic.topicId === -1) {
      // console.log('test');
      appState.setCurrentTopicId(appState.currentRecommendationList[0].topicId);
      appState.setCurrentTopicName(appState.currentRecommendationList[0].topicName);
    }
    return (
      <form className={classes.root} autoComplete="off">
        {/*<FormControl className={classes.formControl}>*/}
        {/*<InputLabel className={classes.white} htmlFor="name-simple">*/}
        {/*主题推荐方式*/}
        {/*</InputLabel>*/}
        {/*<Select*/}
        {/*value={this.state.name}*/}
        {/*onChange={this.handleChange.bind(this, studentCode, courseId, domainName)}*/}
        {/*className={classes.white}*/}
        {/*>*/}
        {/*{recnames.map(recname => (*/}
        {/*<MenuItem value={recname} key={recname}>*/}
        {/*{recname}*/}
        {/*</MenuItem>*/}
        {/*))}*/}
        {/*</Select>*/}
        {/*</FormControl>*/}
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel
            ref={ref => {
              this.InputLabelRef = ref;
            }}
            htmlFor="outlined-age-native-simple"
            className={classes.white}
            FormLabelClasses={{ focused: classes.focused }}
          >
            学习方式
          </InputLabel>
          <Select
            value={this.state.name}
            onChange={this.handleChange.bind(this, studentCode, courseId, domainName)}
            input={
              <OutlinedInput
                name="recname"
                labelWidth={this.state.labelWidth}
                id="outlined-age-native-simple"
                classes={{ notchedOutline: classes.select }}
              />
            }
            className={classes.white}
            classes={{ icon: classes.white }}
            style={{ height: 38 }}
          >
            {recnames.map(recname => (
              <MenuItem value={recname} key={recname}>{recname}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" className={classes.button} style={{ width: 86 }}>
          确认
        </Button>
        <Button variant="outlined" className={classes.button} style={{ width: '100%' }}>
          选择知识主题
        </Button>
      </form>
    );
  }
}

RecommendationButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RecommendationButton);
