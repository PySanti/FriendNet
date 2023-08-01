from PIL import Image

def get_image_size(image, width):
    """
        Recibe un archivo de imagen y retorna el tamanio que debe
        tener para el width recibido. Ejm:

        get_image_size(image, 500) -> [500,250]
    """
    pil_image = Image.open(image)
    image_size = list(pil_image.size)
    image_size[1] = round(width/(image_size[0]/image_size[1]))
    image_size[0] = width
    pil_image.close()
    return image_size