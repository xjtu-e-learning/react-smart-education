import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ThumbUpRounded from '@material-ui/icons/ThumbUpRounded';
import ThumbDownRounded from '@material-ui/icons/ThumbDownRounded';
import axios from 'axios';
import { PATH_BASE, PATH_evaluationSaveAssembleEvaluation } from '../../../../../store/app-state';

require('./footer.css');

const styles = theme => ({});

class AssembleContentFooter extends React.Component {
  hancleClick = () => {
    this.props.setSet({ replicate: !this.props.replicate });
  };

  saveAssembleEvaluation = (studentCode, assembleId, evaluation) => {
    axios.get(
      PATH_BASE + PATH_evaluationSaveAssembleEvaluation,
      {
        params: {
          userId: studentCode,
          assembleId: assembleId,
          value: evaluation
        }
      }
    )
      .then(
        function(response) {
          console.log(response);
        }
      );
  };

  handleClickUp = () => {
    switch (this.props.evaluation) {
      case 0:
        this.props.setSet({ evaluation: 1, positive: this.props.positive + 1 });
        this.saveAssembleEvaluation(this.props.studentCode, this.props.assembleId, 1);
        break;
      case 1:
        this.props.setSet({ evaluation: 0, positive: this.props.positive - 1 });
        this.saveAssembleEvaluation(this.props.studentCode, this.props.assembleId, 0);
        break;
      case -1:
        this.props.setSet({ evaluation: 1, positive: this.props.positive + 1 });
        this.saveAssembleEvaluation(this.props.studentCode, this.props.assembleId, 1);
        break;
    }
  };

  handleClickDown = () => {
    switch (this.props.evaluation) {
      case 0:
        this.props.setSet({ evaluation: -1 });
        this.saveAssembleEvaluation(this.props.studentCode, this.props.assembleId, -1);
        break;
      case 1:
        this.props.setSet({ evaluation: -1, positive: this.props.positive - 1 });
        this.saveAssembleEvaluation(this.props.studentCode, this.props.assembleId, -1);
        break;
      case -1:
        this.props.setSet({ evaluation: 0 });
        this.saveAssembleEvaluation(this.props.studentCode, this.props.assembleId, 0);
        break;
    }
  };

  render() {
    return (
      <div>
        <Button className={'button'} onClick={this.hancleClick}>
          收起
        </Button>
        <Button className={'icon ' + (this.props.evaluation === 1 && 'is-active')} onClick={this.handleClickUp}>
          <ThumbUpRounded/>
        </Button>
        <Button className={'icon ' + (this.props.evaluation === -1 && 'is-active')} onClick={this.handleClickDown}>
          <ThumbDownRounded/>
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(AssembleContentFooter);