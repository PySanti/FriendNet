/**
 * Carga los datos del archivo file_path y los retorna
 * @param {String} secrets_filepath ruta de archivo a leer
 */
export async function loadFile(file_path){
    const loadedFileData = await fetch(file_path)
    const parsedFileData = await loadedFileData.json()
    return parsedFileData
}
