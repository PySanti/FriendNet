def getFormatedDateDiff(new_date, old_date):
    diff =  new_date- old_date
    days, seconds = divmod(diff.total_seconds(), 86400)
    hours, seconds = divmod(seconds, 3600)
    minutes, seconds = divmod(seconds, 60)


    # Format the result as a string
    if days:
        diff_string = f"{round(days)} dias"
    elif hours:
        diff_string = f"{round(hours)} horas"
    elif minutes:
        diff_string = f"{round(minutes)} minutos"
    elif seconds:
        diff_string = f"{round(seconds)} segundos"
    return diff_string
