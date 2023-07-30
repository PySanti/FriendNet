import cloudinary
import cloudinary.uploader
from ..utils.load_cloudinary_secrets import load_cloudinary_secrets

secrets = load_cloudinary_secrets()
cloudinary.config(
    cloud_name  =   secrets["CLOUDINARY__CLOUD_NAME"],
    api_key     =   secrets["CLOUDINARY__API_KEY"],
    api_secret  =   secrets["CLOUDINARY__API_SECRET"]
)

signature = cloudinary.utils.api_sign_request(
    {"upload_preset": secrets["CLOUDINARY__UPLOAD_PRESET"]}, 
    secrets["CLOUDINARY__API_SECRET"]
)

QUALITY_PARAMS = {
    'quality': 'auto',  # Ajusta la calidad de la imagen al nivel óptimo para su tamaño y contenido
    'crop': 'limit',  # Recorta la imagen para ajustarla a los límites de tamaño especificados
}
def save_image_cloudinary(image, overwriting=False, current_publicid=None ):
    """
        Almacena la imagen en cloudinary o la sobreescribe y retorna la url de la misma
    """

    if not overwriting:
        response = cloudinary.uploader.upload(
            image, 
            quality         =   QUALITY_PARAMS['quality'],
            crop            =   QUALITY_PARAMS['crop'],
            signature = signature
        )
    else:
        response = cloudinary.uploader.upload(
            image, 
            public_id   =   current_publicid,
            overwrite   =   True,
            signature = signature,
            # optimization
            quality     =   QUALITY_PARAMS['quality'],
            crop        =   QUALITY_PARAMS['crop'],
            )
    return response['url']

