import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import { post_log_of_mouseclick_assemble } from '../../../../../log/post-log-SDK';
import { updateState } from '../../../../../store/update-state';

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

class AssembleContentText extends React.Component {
  constructor(props) {
    super(props);
    this.state = { replicate: true };
  }

  handleClick = (topicName, topicId, firstLayerFacetName, firstLayerFacetId, secondLayerFacetName, secondLayerFacetId, assembleId, studentCode, courseId, domainName, domainId) => {
    this.setState({ replicate: !this.state.replicate });
    updateState(domainId, studentCode);
    post_log_of_mouseclick_assemble('学习页面', topicName, topicId,
      firstLayerFacetName, firstLayerFacetId, secondLayerFacetName, secondLayerFacetId, assembleId, studentCode, courseId, domainName);
  };

  render() {
    const { classes, assemble, studentCode, courseId, domainName, domainId } = this.props;
    const assemblecontent =
      assemble !== undefined
        ? assemble.assembleContent
        : '';

    return (
      <div>
        <Paper className={classes.root} elevation={2}>
          {this.state.replicate === true ? (
            <div onClick={this.handleClick.bind(this, assemble.topicName, assemble.topicId,
              assemble.firstLayerFacetName, assemble.firstLayerFacetId, assemble.secondLayerFacetName, assemble.secondLayerFacetId, assemble.assembleId,
              studentCode, courseId, domainName, domainId
            )} className={classes.mouse}>
              <HTMLEllipsis
                unsafeHTML={assemblecontent}
                maxLine="5"
                ellipsisHTML="<a>...查看更多</a>"
                basedOn="letters"
              />
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: assemblecontent }}/>
          )}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(AssembleContentText);
