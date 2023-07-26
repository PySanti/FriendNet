from ..api.save_image_cloudinary import save_image_cloudinary
from ..api.overwrite_image_cloudinary import overwrite_image_cloudinary

def set_photo_link(sended_data, view_type, photo_file=None, current_photo_link=None):
    """
        Toma la data que se haya recibido en la vista y comprueba que contenga
        un atributo 'photo', en caso de que lo haya, settea el photo_link del
        sended_data en la url de cloudinary de la photo ... 
    """
    if 'photo' not in sended_data :
        print('No se recibio imagen')
        sended_data['photo_link'] = None if view_type == "creating" else current_photo_link
    else:
        print('Imagen enviada')
        # recordar que a la hora de actualizar, en caso de que el usuario no tenga una imagen
        # todavia, se haria un save en lugar de un overwrite
        sended_data['photo_link'] =  save_image_cloudinary(photo_file) if view_type == "creating" else (overwrite_image_cloudinary(photo_file) if current_photo_link is not None else save_image_cloudinary(photo_file))
        del sended_data['photo']
    return sended_data