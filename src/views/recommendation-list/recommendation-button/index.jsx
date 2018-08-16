import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { inject, observer } from 'mobx-react';

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
  }
});

@inject('appState')
@observer
class RecommendationButton extends React.Component {
  state = {
    name: ''
  };

  handleChange = event => {
    this.setState({ name: event.target.value });
    this.props.appState.setCurrentRecommendation(event.target.value);
  };

  render() {
    const { classes } = this.props;
    const recnames = [
      '最短学习路径',
      '有效学习路径',
      '补全学习路径',
      '热度学习路径'
    ];

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel className={classes.white} htmlFor="name-simple">
            主题推荐方式
          </InputLabel>
          <Select
            value={this.state.name}
            onChange={this.handleChange}
            className={classes.white}
          >
            {recnames.map(recname => (
              <MenuItem value={recname} key={recname}>
                {recname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
    );
  }
}

RecommendationButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RecommendationButton);
