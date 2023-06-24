export async function loadEmailJsData(secrets_filepath){
    try{
        const loadedFileData = await fetch(secrets_filepath)
        const parsedFileData = await loadedFileData.json()
        return parsedFileData
    } catch (error){
        console.log(`Error cargando ${secrets_filepath}`)
        console.log(error)
    }
}
