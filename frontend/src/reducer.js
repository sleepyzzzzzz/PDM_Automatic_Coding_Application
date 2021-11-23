import {
    getAllFiles, setAllFiles, validFiles, uploadFiles, setCurrentFile, updateMsg, getDataInfo,
    updateFields, updateDataSize,
    changeFieldSearchValue, updateSearch, updateData, resetSearch
} from './action';

const initialState = {
    file: '',
    filesBinary: [],
    fields: [],
    colFields: [],
    dataSize: 0,
    data: [],
    searchFields: [],
    allFilesUplodaed: [],
    msg: ''
}

export function frontend(state = initialState, action) {
    switch (action.type) {
        case getAllFiles:
            action.socket.send(JSON.stringify({ type: 'availableFile', name: 'availableFile' }));
            return { ...state };
        case setAllFiles:
            let allFiles = [];
            for (let i = 0; i < action.files.length; i++) {
                for (let d in action.files[i]) {
                    let value = '';
                    try {
                        value = JSON.parse(action.files[i][d])
                    } catch {
                        value = action.files[i][d]
                    }
                    allFiles.push(value);
                }
            }
            return {
                ...state,
                allFilesUplodaed: allFiles
            };
        case validFiles:
            let newFile = action.files[0];
            let filesbinary = readMultifiles(newFile);
            let msg = newFile.name;
            return {
                ...state,
                file: newFile.name,
                filesBinary: filesbinary,
                msg: msg
            }
        case uploadFiles:
            let newAllFiles = [...state.allFilesUplodaed];
            if (!state.allFilesUplodaed.includes(action.files)) {
                newAllFiles = [...state.allFilesUplodaed, action.files];
            }
            let chunks = binaryChunk(action.filesbinary[0].binary);
            for (let j = 0; j < chunks.length; j++) {
                action.socket.send(JSON.stringify({ type: 'file', name: action.filesbinary[0].name, data: chunks[j] }));
            }
            return {
                ...state,
                allFilesUplodaed: newAllFiles,
            };
        case setCurrentFile:
            let currentFile = action.file;
            return {
                ...state,
                file: currentFile,
            }
        case updateMsg:
            let newMsg = action.msg;
            return {
                ...state,
                msg: newMsg
            };
        case getDataInfo:
            action.socket.send(JSON.stringify({ type: 'field_size', name: action.file }));
            return { ...state };
        case updateFields:
            let fieldsInfo = getColumnFields(action.fields);
            let fields = fieldsInfo[0];
            let searchFields = fieldsInfo[1];
            let colHeaders = fieldsInfo[2];
            return {
                ...state,
                fields: fields,
                searchFields: searchFields,
                colFields: colHeaders
            }
        case updateDataSize:
            let dataSize = parseInt(action.size);
            return {
                ...state,
                dataSize: dataSize
            }
        case changeFieldSearchValue:
            let newSearchFields = state.searchFields;
            updateSeachFieldValue(newSearchFields, action.fieldName, action.fieldValue, state.fields)
            return {
                ...state,
                searchFields: newSearchFields
            };
        case updateSearch:
            let keys = filterSearch(state.searchFields);
            let name = state.file;
            let newPage = action.page;
            action.socket.send(JSON.stringify({ type: 'searchkeys', name: name, keys: JSON.stringify(keys), page: JSON.stringify(newPage) }));
            return {
                ...state,
                data: []
            };
        case updateData:
            let newData = parseData(action.data, state.colFields, action.page);
            return {
                ...state,
                data: newData
            }
        case resetSearch:
            let researchFields = resetSearchFields(state.searchFields);
            return {
                ...state,
                searchFields: researchFields
            }
        default:
            return { ...state };
    }
}

function readMultifiles(file) {
    let filesbinary = [];
    let reader = new FileReader();
    filesbinary.push({ 'name': file.name, 'binary': '' });
    reader.onload = function (e) {
        let bin = e.target.result;
        filesbinary[filesbinary.length - 1]['binary'] = bin;
    }
    reader.readAsText(file);
    return filesbinary;
}

function binaryChunk(file) {
    let chunks = [];
    let strsplit = file.split('\n');
    for (let i = 0; i < strsplit.length; i += 20) {
        chunks.push(strsplit.slice(i, i + 20));
    }
    return chunks;
}

function getColumnFields(fields) {
    let colFields = [];
    let colHeaders = [];
    let searchFields = [];
    let tmp = fields.slice(1, fields.length - 1).split(',');
    colHeaders.push({ field: 'id', headerName: 'ID' });
    tmp.forEach(field => {
        let tmpField = field.replaceAll('"', '');
        colFields.push({ field: tmpField, headerName: tmpField });
        colHeaders.push({ field: tmpField, headerName: tmpField });
        searchFields.push([tmpField, '']);
    });
    return [colFields, searchFields, colHeaders];
}

function updateSeachFieldValue(searchFields, fieldName, fieldValue, fields) {
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].field === fieldName) {
            searchFields[i][1] = fieldValue;
            break;
        }
    }
}

function filterSearch(searchFields) {
    let filterKeys = [];
    searchFields.forEach(key => {
        if (key[1] !== '') {
            filterKeys.push(key);
        }
    });
    return filterKeys;
}

function parseData(data, fields, page) {
    let newData = [];
    let idx = page * 20;
    for (let i = 0; i < data.length; i++) {
        let newDataJson = {};
        newDataJson[fields[0].field] = idx;
        idx += 1;
        for (let d in data[i]) {
            let tmp = JSON.parse(data[i][d]);
            for (let j = 1; j < fields.length; j++) {
                let value = '';
                try {
                    value = JSON.parse(tmp[fields[j].field])
                } catch {
                    value = tmp[fields[j].field];
                }
                newDataJson[fields[j].field] = value;
            }
        }
        newData.push(newDataJson);
    }
    return newData;
}

function resetSearchFields(searchFields) {
    let researchFields = [];
    for (let i = 0; i < searchFields.length; i++) {
        researchFields.push([searchFields[i][0], '']);
    }
    return researchFields;
}