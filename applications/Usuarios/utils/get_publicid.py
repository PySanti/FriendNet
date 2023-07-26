def get_publicid(photo_link):
    """
        Recibe el link de la imagen y retorna su public id
    """
    return photo_link.split('/')[-1].split('.')[0]