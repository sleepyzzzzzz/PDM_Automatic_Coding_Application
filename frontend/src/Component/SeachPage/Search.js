import React from 'react';
import { connect } from 'react-redux';
import { Grid, IconButton } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { updateMsg, getDataInfo, updateFields, updateDataSize, changeFieldSearchValue, updateSearch, updateData } from '../../action';
import { Datablock } from './Datablock';
import { SearchField } from './SearchField';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchFieldWidth: this.props.fields.length !== 0 ? Math.ceil(12 / this.props.fields.length) + 1 : 0,
            currentPage: 0,
        }
    }

    componentDidMount() {
        if (this.props.dataSize !== 0) {
            this.props.updateSearch(this.props.socket, 0);
            this.props.socket.onmessage = (msg) => {
                let data = JSON.parse(msg.data);
                this.props.updateData(data, 0);
            }
        }
        else if (this.props.dataSize === 0 && this.props.file) {
            this.props.getDataInfo(this.props.socket, this.props.file);
            this.props.socket.onmessage = (msg) => {
                let data = JSON.parse(msg.data);
                if ('fields' in data) {
                    this.props.updateFields(data.fields);
                }
                else if ('data_size' in data) {
                    this.props.updateDataSize(data.data_size);
                    this.props.updateSearch(this.props.socket, 0);
                    this.props.socket.onmessage = (msg) => {
                        let data1 = JSON.parse(msg.data);
                        this.props.updateData(data1, 0);
                    }
                }
                else if ('msg' in data) {
                    this.props.updateMsg(data.msg);
                }
            }
        }
    }

    handleSearch = (page) => {
        this.setState({ ...this.state, currentPage: page });
    }

    updateSearchField = () => {
        console.log(this.state.currentPage);
        this.props.updateSearch(this.props.socket, 0);
        this.props.socket.onmessage = (msg) => {
            let data = JSON.parse(msg.data);
            this.props.updateData(data, this.state.currentPage);
        }
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
            <Grid container style={{ 'visibility': this.props.fields.length === 0 ? 'hidden' : 'visible' }}>
                {/* <Grid item xs={12}><div><br></br></div></Grid>
                {this.displaySearchField()}
                <Grid item xs={this.state.searchFieldWidth}>
                    <IconButton edge="end" onClick={this.updateSearchField}>
                        <SearchOutlinedIcon />
                    </IconButton>
                </Grid> */}
                <Grid item xs={12}>
                    <Datablock
                        data={this.props.data}
                        fields={this.props.colFields}
                        dataSize={this.props.dataSize}
                        socket={this.props.socket}
                        handleSearch={this.handleSearch}
                        updateSearch={this.props.updateSearch}
                        updateData={this.props.updateData}
                    />
                </Grid>
            </Grid >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        file: state.file,
        filesBinary: state.filesBinary,
        fields: state.fields,
        colFields: state.colFields,
        dataSize: state.dataSize,
        data: state.data,
        searchFields: state.searchFields,
        allFilesUploaded: state.allFilesUploaded,
        msg: state.msg
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateMsg: (msg) => dispatch(updateMsg(msg)),
        getDataInfo: (socket, file) => dispatch(getDataInfo(socket, file)),
        updateFields: (fields) => dispatch(updateFields(fields)),
        updateDataSize: (size) => dispatch(updateDataSize(size)),
        changeFieldSearchValue: (fieldName, fieldValue) => dispatch(changeFieldSearchValue(fieldName, fieldValue)),
        updateSearch: (socket, page) => dispatch(updateSearch(socket, page)),
        updateData: (data, page) => dispatch(updateData(data, page))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);