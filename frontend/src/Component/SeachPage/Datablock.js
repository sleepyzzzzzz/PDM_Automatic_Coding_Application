import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export class RowData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0
        }
    }

    setPage = (newPage) => {
        this.setState({ ...this.state, page: newPage });
        this.props.handleSearch(this.state.page);
    }

    render() {
        return (
            <div style={{ height: 400, width: '100%', textAlign: 'center' }}>
                <DataGrid
                    rows={this.props.data}
                    columns={this.props.fields}
                    page={this.state.page}
                    pageSize={Math.ceil(this.props.dataSize / 20)}
                    rowsPerPageOptions={[20]}
                    pagination
                    onPageChange={(newPage) => this.setPage(newPage)}
                />
            </div>
        );
    }
}