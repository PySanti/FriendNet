from ..api.save_image_cloudinary import save_image_cloudinary
from ..api.overwrite_image_cloudinary import overwrite_image_cloudinary

def set_photo_link(sended_data, view_type):
    """
        Toma la data que se haya recibido en la vista y comprueba que contenga
        un atributo 'photo', en caso de que lo haya, settea el photo_link del
        sended_data en la url de cloudinary de la photo ... 
    """
    if 'photo' not in sended_data :
        print('No se recibio imagen')
        sended_data['photo_link'] = None
    else:
        print('Imagen enviada')
        sended_data['photo_link'] =  save_image_cloudinary(sended_data['photo']) if view_type == "creating" else overwrite_image_cloudinary(sended_data['photo'])
        del sended_data['photo']
    return sended_data