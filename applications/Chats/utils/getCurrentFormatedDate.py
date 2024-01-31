import pytz
from datetime import datetime

month_dict = {
    'january'   : 'ene',
    'february'  : 'feb',
    'march'     : 'mar',
    'april'     : 'abr',
    'may'       : 'may',
    'june'      : 'jun',
    'july'      : 'jul',
    'august'    : 'ago',
    'september' : 'sep',
    'october'   : 'oct',
    'november'  : 'nov',
    'december'  : 'dic'
}



def getCurrentFormatedDate():
    # Define la zona horaria de Venezuela
    zona_horaria = pytz.timezone('America/Caracas')
    formatted_date = datetime.now(zona_horaria).strftime('%d %Y, %I:%M %p')
    formatted_date = month_dict[datetime.now(zona_horaria).strftime("%B").lower()].capitalize() + " " + formatted_date
    return formatted_date;