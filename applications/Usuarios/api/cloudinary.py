import cloudinary
import cloudinary.uploader
from ..utils.load_cloudinary_secrets import load_cloudinary_secrets
import logging



secrets = load_cloudinary_secrets()
cloudinary.config(
    cloud_name  =   secrets["CLOUDINARY__CLOUD_NAME"],
    api_key     =   secrets["CLOUDINARY__API_KEY"],
    api_secret  =   secrets["CLOUDINARY__API_SECRET"],
    secure      = True
)
signature = cloudinary.utils.api_sign_request(
    {"upload_preset": secrets["CLOUDINARY__UPLOAD_PRESET"]}, 
    secrets["CLOUDINARY__API_SECRET"]
)



def save_image_cloudinary(image, overwriting=False, current_publicid=None ):
    """
        Almacena la imagen en cloudinary o la sobreescribe y retorna la url de la misma
    """
    QUALITY = {
        'quality' : 'auto:best',
    }
    BASE_IMAGE_UPLOADING_ARGS = {
        'file' : image,
        'signature' : signature,
    }
    if not overwriting:
        response = cloudinary.uploader.upload(**BASE_IMAGE_UPLOADING_ARGS,**QUALITY)
    else:
        response = cloudinary.uploader.upload(
            public_id   =   current_publicid,
            overwrite   =   True, 
            **BASE_IMAGE_UPLOADING_ARGS,
            **QUALITY
        )
    logger = logging.getLogger("django")
    logger.debug(response)
    return cloudinary.CloudinaryImage(response['public_id']).build_url(
        format      =   'jpg',
        version     =   response['version'],
        **QUALITY
    )


def delete_image_cloudinary(publicid):
    """
        Elimina la imagen con publicid de cloudinary 
    """
    response = cloudinary.uploader.destroy(
        public_id   =   publicid, 
        signature   = signature
    )
    return response


