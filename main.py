import os
import random
import midi
import cv2
import numpy as np
from os import listdir
from os.path import isfile, join
from flask import Flask, render_template, request, send_from_directory, redirect, url_for, session, escape
import multiprocessing



PATH = "./static/video_files/CGI_Animated_Short_Film_The_Box_La_Boîte_by_ESMA_CGMeetup.mp4"

NSIZE =  40
OCIMGX = 1280
OCIMGY = 720
NEIMGX = int(OCIMGX / NSIZE)
NEIMGY = int(OCIMGY / NSIZE)

OCIMGSIZE = (OCIMGX, OCIMGY)
NEIMGSIZE = (NEIMGX, NEIMGY)

app = Flask(__name__, static_url_path='/static')
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

app.config.from_object(__name__)
app.secret_key = os.urandom(24)


cap = cv2.VideoCapture(PATH)
loaded = False

def resize_frame(img, nsize, imgSize, output=0, resize=False): #output: 0 => max/ 1 => min):
    cropedimg = np.zeros((NEIMGY, NEIMGX))

    for x in range(NEIMGX):
        for y in range(NEIMGY):
            x0 = (x * NSIZE)
            y0 = (y * NSIZE)

            x1 = (x * NSIZE) + (NSIZE-1)
            y1 = (y * NSIZE) + (NSIZE-1)

            mask = img[y0:y1, x0:x1]
            minMax = cv2.minMaxLoc(mask)
            if minMax[0] != 0:
                val = 1 / minMax[0]
            else:
                val = 0

            cropedimg[y][x] = val

    return cropedimg


def get_ch_from_frame(img):

    b, g, r = cv2.split(img)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    gray = resize_frame(gray, NEIMGSIZE, OCIMGSIZE)
    r = resize_frame(r, NEIMGSIZE, OCIMGSIZE)
    g = resize_frame(g, NEIMGSIZE, OCIMGSIZE)
    b = resize_frame(b, NEIMGSIZE, OCIMGSIZE)

    return r, g, b, gray

def output_list(output, value):

    output.append(value)

    return output

def sound_out():
    pass

def convert_data():

    c = 0
    out = []
    while True:
        try:
            ret, frame = cap.read()

            c += 1
            if c == 90:
                r, g, b, k = get_ch_from_frame(frame)
                c = 0
                out = output_list(out, (r, g, b, k))
                #cv2.imshow("k", k)


            if cv2.waitKey(1) == ord("q"):
                break

        except:
            break


@app.route('/', methods = ['GET', 'POST'])
def index():
    global loaded
    session['user_id'] = str(random.randint(0, 1000000000))

    convert_data()

    if request.method == 'POST':
        pass

    return render_template('index.html')



def main():
    if __name__ == '__main__':
        app.run(debug = True, threaded = True)


main()