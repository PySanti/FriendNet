def mail_html_content(title, content):
    return  """
<html>
    <head>
        <style>
            *{
                text-align : center;
                font-family : sans-serif;
                color : #000;
            }
            body{
                display : flex;
                justify-content : center;
                flex-direction : column;
            }
            .subject{
                font-weight : 400;
            }
        </style>
    </head>
    <body>
        <h3 class="title">
            %s
        </h3>
        <h3 class="subject">
            %s
        </h3>
    </body>
</html>""" % ( title, content);

