import React from 'react';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';

export class DataBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0
        }
    }

    setPage = (newPage) => {
        this.setState({ ...this.state, page: newPage });
        this.props.handleUpdatePage(newPage);
        this.props.updateSearch(this.props.socket, newPage);
        this.props.socket.onmessage = (msg) => {
            let data = JSON.parse(msg.data);
            if (!data.hasOwnProperty('msg')) {
                this.props.updateData(data, newPage);
            }
        }
    }

    checkIfSearch = () => {
        for (let i = 0; i < this.props.searchFields.length; i++) {
            if (this.props.searchFields[i][1] !== '') {
                return true;
            }
        }
        return false;
    }

    circularOverlay = () => {
        return (
            <GridOverlay>
                <div style={{ justifyItems: 'center' }}>
                    <CircularProgress />
                </div>
            </GridOverlay>
        );
    }

    render() {
        console.log(this.checkIfSearch());
        return (
            <div style={{ height: 720, width: '95%', margin: '0 auto' }}>
                <DataGrid
                    components={{
                        LoadingOverlay: this.circularOverlay,
                    }}
                    rows={this.props.data}
                    columns={this.props.fields}
                    page={this.state.page}
                    pageSize={20}
                    rowsPerPageOptions={[20]}
                    rowCount={this.props.dataSize}
                    pagination
                    paginationMode="server"
                    onPageChange={(newPage) => this.setPage(newPage)}
                    loading={this.props.data.length === 0 && !this.checkIfSearch() ? true : false}
                />
            </div>
        );
    }
}