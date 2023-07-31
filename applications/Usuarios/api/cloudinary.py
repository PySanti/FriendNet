import cloudinary
import cloudinary.uploader
from ..utils.load_cloudinary_secrets import load_cloudinary_secrets

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

QUALITY = {
    'width' : 250,
    'height' : 500,
    'quality' : 'auto:best',
    'format' : 'jpg'
}

def save_image_cloudinary(image, overwriting=False, current_publicid=None ):
    """
        Almacena la imagen en cloudinary o la sobreescribe y retorna la url de la misma
    """

    if not overwriting:
        response = cloudinary.uploader.upload(
            image, 
            signature       = signature,
            #optimization
            quality = QUALITY['quality'],
            width   = QUALITY['width'],
            height  = QUALITY['height'],
        )
    else:
        response = cloudinary.uploader.upload(
            image, 
            public_id   =   current_publicid,
            overwrite   =   True,
            signature   = signature,
            #optimization
            quality = QUALITY['quality'],
            width   = QUALITY['width'],
            height  = QUALITY['height'],
            )

    return cloudinary.CloudinaryImage(response['public_id']).build_url(
        quality = QUALITY['quality'],
        width   = QUALITY['width'],
        height  = QUALITY['height'],
        format  = QUALITY['format']
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
