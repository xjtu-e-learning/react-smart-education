import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ThumbUpRounded from '@material-ui/icons/ThumbUpRounded';
import ThumbDownRounded from '@material-ui/icons/ThumbDownRounded';

require('./footer.css');

const styles = theme => ({});

class AssembleContentFooter extends React.Component {
  render() {
    return (
      <div>
        <Button className={'button'}>
          收起
        </Button>
        <Button className={'icon'}>
          <ThumbUpRounded/>
        </Button>
        <Button className={'icon'}>
          <ThumbDownRounded/>
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(AssembleContentFooter);