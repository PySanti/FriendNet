import cloudinary
import cloudinary.uploader
from json import load
from pathlib import Path

def delete_image_cloudinary(publicid):
    """
        Elimina la imagen con publicid de cloudinary 
    """
    secrets = {}
    BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
    with open(f'{BASE_DIR}/secrets.json','r') as f:
        secrets = load(f)
    response = cloudinary.uploader.destroy(public_id=publicid, 
        api_key=secrets["CLOUDINARY__API_KEY"],
        api_secret=secrets["CLOUDINARY__API_SECRET"],
        cloud_name=secrets["CLOUDINARY__CLOUD_NAME"])
    return response
