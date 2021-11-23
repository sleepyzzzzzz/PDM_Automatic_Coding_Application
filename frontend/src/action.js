export const getAllFiles = (socket) => {
    return { type: getAllFiles, socket };
}

export const setAllFiles = (files) => {
    return { type: setAllFiles, files };
}

export const validFiles = (files) => {
    return { type: validFiles, files };
}

export const uploadFiles = (socket, files, filesBinary) => {
    return { type: uploadFiles, socket, files, filesBinary};
}

export const setCurrentFile = (file) => {
    return { type: setCurrentFile, file };
}

export const updateMsg = (msg) => {
    return { type: updateMsg, msg };
}

export const getDataInfo = (socket, file) => {
    return { type: getDataInfo, socket, file };
}

export const updateFields = (fields) => {
    return { type: updateFields, fields };
}

export const updateDataSize = (size) => {
    return { type: updateDataSize, size };
}

export const changeFieldSearchValue = (fieldName, fieldValue) => {
    return { type: changeFieldSearchValue, fieldName, fieldValue };
}

export const updateSearch = (socket, page) => {
    return { type: updateSearch, socket, page };
}

export const updateData = (data, page) => {
    return { type: updateData, data, page };
}

export const resetSearch = () => {
    return { type: resetSearch };
}