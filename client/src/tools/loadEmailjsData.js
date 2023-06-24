export async function loadEmailJsData(secrets_filepath){
    const data = await fetch(secrets_filepath)
    const parsed_data = data.json()
    return parsed_data
}
