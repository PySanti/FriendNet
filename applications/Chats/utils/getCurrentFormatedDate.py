import locale
import pytz
from datetime import datetime
from babel.dates import format_datetime


def getCurrentFormatedDate():

    locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8')
    now_utc = datetime.now(pytz.utc)
    timezone_vzla = pytz.timezone('America/Caracas')
    now_vzla = now_utc.astimezone(timezone_vzla)
    formatted_date = now_vzla.strftime("%b %d %Y, %I:%M")
    am_pm = now_vzla.strftime("%p")
    if am_pm != "AM":
        am_pm_es = "AM."
    else:
        am_pm_es = "PM."
    formatted_date += " " + am_pm_es
    formatted_date = formatted_date.capitalize()
    return formatted_date;