import React from 'react';
import { connect } from 'react-redux';
import { Grid, Drawer, List, ListItem, ListItemText, FormControl, Select, MenuItem, IconButton } from "@mui/material";
import { getAllFiles, setAllFiles, setCurrentFile, changeFieldSearchValue, updateSearch, updateData } from '../action';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Upload from './Upload';
import Data from './SeachPage/Data';
import { SearchField } from './SeachPage/SearchField';

const url = 'ws://localhost:4567/platform';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      selectFile: '',
      socket: null,
      searchFieldWidth: this.props.fields.length !== 0 ? Math.ceil(12 / this.props.fields.length) + 1 : 0,
      currentPage: 0
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

  handleUpdatePage = (page) => {
    this.setState({ ...this.state, currentPage: page });
  }

  updateSearchField = () => {
    this.props.updateSearch(this.state.socket, 0);
    this.socket.onmessage = (msg) => {
      let data = JSON.parse(msg.data);
      this.props.updateData(data, this.state.currentPage);
    }
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

  displaySearchField = () => {
    let searchField = '';
    if (this.props.fields.length === 0) {
      return (<div></div>);
    }
    searchField = this.props.fields.map((field, idx) => {
      return (
        <SearchField
          key={idx}
          label={field.field}
          name={field.field}
          searchFieldWidth={this.state.searchFieldWidth}
          changeFieldSearchValue={this.props.changeFieldSearchValue}
        />
      )
    });
    return searchField;
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
              {this.displaySearchField()}
              <ListItem style={{ visibility: this.props.fields.length !== 0 ? 'visible' : 'hidden' }}>
                <IconButton edge="end" onClick={this.updateSearchField}>
                  <SearchOutlinedIcon />
                </IconButton>
              </ListItem>
            </List>
          </Drawer>
        </Grid>
        <Grid item xs={10}>
          <div>
            {this.state.show ?
              <Upload
                socket={this.state.socket}
              /> :
              <Data
                socket={this.state.socket}
                handleUpdatePage={this.handleUpdatePage}
              />}
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
    fields: state.fields,
    msg: state.msg,
    allFilesUploaded: state.allFilesUploaded,
    searchFields: state.searchFields
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllFiles: (socket) => dispatch(getAllFiles(socket)),
    setAllFiles: (files) => dispatch(setAllFiles(files)),
    setCurrentFile: (file) => dispatch(setCurrentFile(file)),
    changeFieldSearchValue: (fieldName, fieldValue) => dispatch(changeFieldSearchValue(fieldName, fieldValue)),
    updateSearch: (socket, page) => dispatch(updateSearch(socket, page)),
    updateData: (data, page) => dispatch(updateData(data, page))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);