import os
import random
import midi
import cv2 as cv
import imutils
import numpy as np
from os import listdir
from os.path import isfile, join
from flask import Flask, render_template, request, send_from_directory, redirect, url_for, session, escape

app = Flask(__name__, static_url_path='/static')
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

app.config.from_object(__name__)
app.secret_key = os.urandom(24)


NSIZE =  16
OCIMGX = 848
OCIMGY = 480
NEIMGX = OCIMGX / NSIZE
NEIMGY = OCIMGY / NSIZE

OCIMGSIZE = (OCIMGX, OCIMGY)
NEIMGSIZE = (NEIMGX, NEIMGY)


def webserver_init():
    pass

def resize_frame(img, nsize, imgSize, output=0, resize=False): #output: 0 => max/ 1 => min):
    cropedimg = np.zeros((nrow,ncol))


    for x in range(newImgSize[0]):
        for y in range(newImgSize[1]):
            x0 = (x * NSIZE)
            y0 = (y * NSIZE)

            x1 = (x * NSIZE) + (NSIZE-1)
            y1 = (y * NSIZE) + (NSIZE-1)

            mask = img[y0:y1, x0:x1]
            minMax = cv2.minMaxLoc(mask)
            val = 1 / minMax[1]

            cropedimg[y][x] = val

    return cropedimg


def get_ch_from_frame(img):
    r, g, b, gray = 0

    b, g, r = cv.split(img)
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

    gray = resize_frame(gray, NEIMGSIZE, OCIMGSIZE)
    r = resize_frame(r, NEIMGSIZE, OCIMGSIZE)
    g = resize_frame(g, NEIMGSIZE, OCIMGSIZE)
    b = resize_frame(b, NEIMGSIZE, OCIMGSIZE)

    return r, g, b, gray

#todo make this shit work
def get_frames(cap):
    count = 0
    data = []
    if not cap.isOpened():
        print("Error opening video stream or file")

    while cap.isOpened():
        if count > 500:
            break
        if ret:

            data.append(img)  # save frame as JPEG file
            ret, img = cam.read()
            count += 1

    cam.release()

    return data

def send_data(data, ip, port):
    pass

def convert_data():
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