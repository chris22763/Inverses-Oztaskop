import os
import random
from flask import Flask, render_template, request, send_from_directory, redirect, url_for, session, escape

app = Flask(__name__, static_url_path='/static')
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

app.config.from_object(__name__)
app.secret_key = os.urandom(24)

def webserver_init():
    pass


@app.route('/', methods = ['GET', 'POST'])
def index():

    session['user_id'] = str(random.randint(0, 1000000000))


    if request.method == 'POST':
        pass

    return render_template('intro.html')



def main():
    if __name__ == '__main__':
        app.run(debug = True, threaded = True)