import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: 16
  },
  mouse: {
    cursor: 'pointer'
  }
});

class AssembleContentLess extends React.Component {
  constructor(props) {
    super(props);
    this.state = { replicate: true };
  }

  handleClick = () => {
    this.setState({ replicate: !this.state.replicate });
  };

  render() {
    const { classes } = this.props;
    const assemblecontent =
      this.props.assemble !== undefined
        ? this.props.assemble.assembleContent
        : '';

    return (
      <div>
        <Paper className={classes.root} elevation={2}>
          {this.state.replicate === true ? (
            <div onClick={this.handleClick} className={classes.mouse}>
              <HTMLEllipsis
                unsafeHTML={assemblecontent}
                maxLine="5"
                ellipsisHTML="<a>...查看更多</a>"
                basedOn="letters"
              />
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: assemblecontent }} />
          )}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(AssembleContentLess);
