import cloudinary
import cloudinary.uploader
from json import load
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent




def save_image_cloudinary(image, overwriting=False, current_publicid=None ):
    """
        Almacena la imagen en cloudinary o la sobreescribe y retorna la url de la misma
    """
    secrets = {}
    QUALITY_PARAMS = {
        'quality': 'auto:best',  # Ajusta la calidad de la imagen al nivel óptimo para su tamaño y contenido
        'crop': 'limit',  # Recorta la imagen para ajustarla a los límites de tamaño especificados
    }
    with open(f'{BASE_DIR}/secrets.json','r') as f:
        secrets = load(f)
    if not overwriting:
        print('Registrando imagen')
        response = cloudinary.uploader.upload(image, 
            api_key=secrets["CLOUDINARY__API_KEY"],
            api_secret=secrets["CLOUDINARY__API_SECRET"],
            cloud_name=secrets["CLOUDINARY__CLOUD_NAME"],
            # optimization
            quality=QUALITY_PARAMS['quality'],
            crop=QUALITY_PARAMS['crop'],
        )
    else:
        print('Sobreescribiendo imagen')
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

