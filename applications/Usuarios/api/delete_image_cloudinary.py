import cloudinary
import cloudinary.uploader
from ..utils.load_cloudinary_secrets import load_cloudinary_secrets

def delete_image_cloudinary(publicid):
    """
        Elimina la imagen con publicid de cloudinary 
    """
    secrets = load_cloudinary_secrets()
    response = cloudinary.uploader.destroy(public_id=publicid, 
        api_key=secrets["CLOUDINARY__API_KEY"],
        api_secret=secrets["CLOUDINARY__API_SECRET"],
        cloud_name=secrets["CLOUDINARY__CLOUD_NAME"])
    return response
