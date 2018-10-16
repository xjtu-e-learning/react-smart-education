import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { inject, observer } from 'mobx-react';
import SingleAssemble from './single-assemble';

const styles = theme => ({
  grid: {
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
    paddingBottom: 16,
    overflow: 'auto',
    // height: 896
    height: document.body.clientHeight - 224
    // position: 'absolute'
  }

});

@inject('appState')
@observer
class AssemblePaper extends React.Component {

  constructor(props) {
    super(props);
    this.state = { height: document.body.clientHeight - 224 };
  }

  resize = () => {
    this.setState({ height: document.body.clientHeight - 224 });
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  render() {
    const { classes, appState } = this.props;
    const currentAssembles = appState.currentAssembles.get();
    const studentCode = appState.studentCode;
    const courseId = appState.courseId;
    const domainName = appState.domainName.get();
    const domainId = appState.domainId.get();
    return (
      <Paper className={classes.grid} style={{ height: this.state.height }}>
        {currentAssembles !== undefined &&
        currentAssembles.content.map(assemble => (
          <SingleAssemble assemble={assemble} studentCode={studentCode} courseId={courseId} domainName={domainName}
                          domainId={domainId} textorvideo={appState.textOrVideo} key={assemble.assembleId}/>
        ))
        }
      </Paper>
    );
  }
}

export default withStyles(styles)(AssemblePaper);
