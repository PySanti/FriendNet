import cloudinary
import cloudinary.uploader
from ..utils.load_cloudinary_secrets import load_cloudinary_secrets
from ..utils.get_image_size import get_image_size
import copy



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
    'width' : 400,
    'quality' : 'auto:best',
    'format' : 'jpg'
}

def save_image_cloudinary(image, overwriting=False, current_publicid=None ):
    """
        Almacena la imagen en cloudinary o la sobreescribe y retorna la url de la misma
    """
    image_size = get_image_size(copy.deepcopy(image.file), QUALITY['width'])
    print(image_size)
    if not overwriting:
        response = cloudinary.uploader.upload(
            image, 
            signature       = signature,
            #optimization
            quality = QUALITY['quality'],
            width   = image_size[0],
            height   = image_size[1],
        )
    else:
        response = cloudinary.uploader.upload(
            image, 
            public_id   =   current_publicid,
            overwrite   =   True,
            signature   = signature,
            #optimization
            quality = QUALITY['quality'],
            width   = image_size[0],
            height   = image_size[1],
            )
    return cloudinary.CloudinaryImage(response['public_id']).build_url(
        quality = QUALITY['quality'],
        width   = image_size[0],
        height   = image_size[1],
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


