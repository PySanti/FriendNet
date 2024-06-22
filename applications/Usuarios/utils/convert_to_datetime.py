import locale
from datetime import datetime

month_dict = {
    'ene' : 'january',
    'feb' : 'february',
    'mar' : 'march',
    'abr' : 'april' ,
    'may' :'may'  ,
    'jun' : 'june',
    'jul' :'july' ,
    'ago' : 'august',
    'sep' : 'september',
    'oct' : 'october',
    'nov' : 'november',
    'dic' : 'december'
}




def convert_to_datetime(str):
    """
        Recibira una fecha con el formato ... '%b %d %Y, %I:%M %p'
        en un string y retornara el objeto datetime para hacer comparaciones
    """
    locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
    formatted_str = f"{month_dict[str.split(' ')[0].lower()].capitalize()} {' '.join(str.split(' ')[1:])}"
    final_datetime = datetime.strptime(formatted_str, '%B %d %Y, %I:%M %p')
    return final_datetime