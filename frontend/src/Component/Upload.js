import React from 'react';
import { connect } from 'react-redux';
import { Grid } from '@mui/material';
import { validFiles, uploadFiles, updateMsg, getDataInfo, updateFields, updateDataSize, resetSearch } from '../action';

class Upload extends React.Component {
    componentDidMount() {
        this.props.resetSearch();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.uploadFiles(this.props.socket, this.props.file, this.props.filesBinary);
        this.props.getDataInfo(this.props.socket, this.props.file);
        this.props.socket.onmessage = (msg) => {
            let data = JSON.parse(msg.data);
            if ('fields' in data) {
                this.props.updateFields(data.fields);
            }
            else if ('data_size' in data) {
                this.props.updateDataSize(data.data_size);
            }
            else if ('msg' in data) {
                this.props.updateMsg(data.msg);
            }
        }
    }

    handleChange = (e) => {
        this.props.validFiles(e.target.files);
    }

    render() {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} />
                <Grid item xs={2} />
                <Grid item xs={10}>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type='file'
                            id='file'
                            accept='.csv'
                            onChange={this.handleChange}
                        />
                        <button type='submit'>Update File</button>
                    </form>
                    <div>
                        <span>{this.props.msg}</span>
                        <br></br>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        file: state.file,
        filesBinary: state.filesBinary,
        msg: state.msg,
        allFilesUploaded: state.all_files_uplodaed
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        validFiles: (files) => dispatch(validFiles(files)),
        uploadFiles: (socket, files, filesBinary) => dispatch(uploadFiles(socket, files, filesBinary)),
        updateMsg: (msg) => dispatch(updateMsg(msg)),
        getDataInfo: (socket, file) => dispatch(getDataInfo(socket, file)),
        updateFields: (fields) => dispatch(updateFields(fields)),
        updateDataSize: (size) => dispatch(updateDataSize(size)),
        resetSearch: () => dispatch(resetSearch())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload);