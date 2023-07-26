import cloudinary
import cloudinary.uploader
from json import load
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent




def save_image_cloudinary(image, updating=False, current_publicid=None ):
    """
        Almacena la imagen en cloudinary y retorna la url de la misma
    """
    secrets = {}
    with open(f'{BASE_DIR}/secrets.json','r') as f:
        secrets = load(f)
    if not updating:
        response = cloudinary.uploader.upload(image, 
            api_key=secrets["CLOUDINARY__API_KEY"],
            api_secret=secrets["CLOUDINARY__API_SECRET"],
            cloud_name=secrets["CLOUDINARY__CLOUD_NAME"])
    else:
        response = cloudinary.uploader.upload(image, 
            api_key=secrets["CLOUDINARY__API_KEY"],
            api_secret=secrets["CLOUDINARY__API_SECRET"],
            cloud_name=secrets["CLOUDINARY__CLOUD_NAME"], 
            public_id=current_publicid,
            overwrite=True
            )
    return response['url']

