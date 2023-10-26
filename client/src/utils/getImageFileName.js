/**
 * Funcion creada para obtener el nombre de un archivo de imagen
 */
export function getImageFileName(imageFile, imageNameSetter){
    const reader = new FileReader();
    reader.addEventListener("load", function () {
        imageNameSetter(reader.result);
    });
    if (imageFile) {
        reader.readAsDataURL(imageFile);
    }
}