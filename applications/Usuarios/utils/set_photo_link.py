from ..api.save_image_cloudinary import save_image_cloudinary
from ..utils.get_publicid import get_publicid 

def set_photo_link(sended_data, view_type, photo_file=None, current_photo_link=None):
    """
        Genera el campo photo_link a partir de la imagen recibida desde el frontend
    """
    if 'photo' not in sended_data :
        print('No se recibio imagen')
        sended_data['photo_link'] = None if view_type == "creating" else current_photo_link
    else:
        print('Imagen enviada')
        if view_type == "creating":
            sended_data['photo_link'] =  save_image_cloudinary(photo_file) 
        else: 
            if current_photo_link is None:
                sended_data['photo_link'] = save_image_cloudinary(photo_file)
            else:
                sended_data['photo_link'] = save_image_cloudinary(
                    image=photo_file, 
                    overwriting=True,
                    current_publicid=get_publicid(current_photo_link))
        del sended_data['photo']
    return sended_data