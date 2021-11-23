import React from 'react';
import { connect } from 'react-redux';
import { Grid, Drawer, List, ListItem, ListItemText, FormControl, Select, MenuItem } from "@mui/material";
import { getAllFiles, setAllFiles, setCurrentFile } from '../action';
import Upload from './Upload';
import Search from './SeachPage/Search';

const url = 'ws://localhost:4567/platform';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      selectFile: '',
      socket: null
    }
  }

  socket = new WebSocket(url);

  componentDidMount() {
    this.connect();
  }

  connect = () => {
    let socket = new WebSocket(url);
    socket.onopen = () => {
      console.log('connect');
      this.setState({ socket: socket });
      this.props.getAllFiles(socket);
      socket.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        this.props.setAllFiles(data);
      }
    };

    socket.onerror = (err) => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );
      socket.close();
    };
  }

  check = () => {
    const { socket } = this.state;
    if (!socket || socket.readyState === WebSocket.CLOSED) {
      this.connect();
    }
  };

  handleUpload = () => {
    this.setState({ ...this.state, show: true });
  }

  handleSearch = () => {
    this.setState({ ...this.state, show: false });
  }

  handleChange = (e) => {
    this.setState({ ...this.state, selectFile: e.target.value });
    this.props.setCurrentFile(e.target.value);
  }

  displaySelectFiles = () => {
    if (this.props.allFilesUploaded.length === 0) {
      return (
        <MenuItem value=''><em></em></MenuItem>
      );
    }
    let filesSelected = this.props.allFilesUploaded.map((file, idx) => {
      return (
        <MenuItem key={idx} value={file}>{file}</MenuItem>
      );
    });
    return filesSelected;
  }

  render() {
    return (
      <Grid container>
        <Grid item xs={2}>
          <Drawer
            variant='permanent'
            open={true}
            PaperProps={{
              sx: {
                backgroundColor: "#ccffff",
                color: "black",
              }
            }}>
            <List>
              <ListItem button onClick={this.handleUpload}>
                <ListItemText primary='upload'></ListItemText>
              </ListItem>
              <ListItem button onClick={this.handleSearch}>
                <ListItemText primary='search'></ListItemText>
              </ListItem>
              <ListItem>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    value={this.state.selectFile}
                    onChange={this.handleChange}
                    displayEmpty
                  >
                    {this.displaySelectFiles()}
                  </Select>
                </FormControl>
              </ListItem>
            </List>
          </Drawer>
        </Grid>
        <Grid item xs={10}>
          <div>
            {this.state.show ? <Upload socket={this.state.socket} /> : <Search socket={this.state.socket} />}
          </div>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    file: state.file,
    filesBinary: state.filesbinary,
    msg: state.msg,
    allFilesUploaded: state.allFilesUploaded
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllFiles: (socket) => dispatch(getAllFiles(socket)),
    setAllFiles: (files) => dispatch(setAllFiles(files)),
    setCurrentFile: (file) => dispatch(setCurrentFile(file))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);