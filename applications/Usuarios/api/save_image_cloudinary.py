import cloudinary
import cloudinary.uploader
from ..utils.load_cloudinary_secrets import load_cloudinary_secrets



def save_image_cloudinary(image, overwriting=False, current_publicid=None ):
    """
        Almacena la imagen en cloudinary o la sobreescribe y retorna la url de la misma
    """
    secrets = load_cloudinary_secrets()
    QUALITY_PARAMS = {
        'quality': 'auto:best',  # Ajusta la calidad de la imagen al nivel óptimo para su tamaño y contenido
        'crop': 'limit',  # Recorta la imagen para ajustarla a los límites de tamaño especificados
    }
    if not overwriting:
        response = cloudinary.uploader.upload(image, 
            api_key=secrets["CLOUDINARY__API_KEY"],
            api_secret=secrets["CLOUDINARY__API_SECRET"],
            cloud_name=secrets["CLOUDINARY__CLOUD_NAME"],
            # optimization
            quality=QUALITY_PARAMS['quality'],
            crop=QUALITY_PARAMS['crop'],
        )
    else:
        response = cloudinary.uploader.upload(image, 
            api_key=secrets["CLOUDINARY__API_KEY"],
            api_secret=secrets["CLOUDINARY__API_SECRET"],
            cloud_name=secrets["CLOUDINARY__CLOUD_NAME"], 
            public_id=current_publicid,
            overwrite=True,
            # optimization
            quality=QUALITY_PARAMS['quality'],
            crop=QUALITY_PARAMS['crop'],
            )
    return response['url']

