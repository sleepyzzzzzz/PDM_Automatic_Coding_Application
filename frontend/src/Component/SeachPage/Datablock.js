import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

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
            this.props.updateData(data, newPage);
        }
    }

    render() {
        return (
            <div style={{ display: 'flex', height: '100%', width: '100%' }}>
                <DataGrid
                    rows={this.props.data}
                    columns={this.props.fields}
                    page={this.state.page}
                    pageSize={20}
                    rowsPerPageOptions={[20]}
                    rowCount={this.props.dataSize}
                    pagination
                    onPageChange={(newPage) => this.setPage(newPage)}
                />
            </div>
        );
    }
}