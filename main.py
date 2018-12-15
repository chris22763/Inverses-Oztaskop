import os
import random
import midi
import cv2
import time
import numpy as np
from os import listdir
from os.path import isfile, join
from flask import Flask, render_template, request, send_from_directory, redirect, url_for, session, escape
import multiprocessing
import matplotlib.pyplot as plt



PATH = "./static/video_files/short_test.mp4"
OCIMGX = 1280
OCIMGY = 720
NSIZEY =  int(OCIMGY / 45)
NSIZEX =  int(OCIMGX / 40)
NEIMGX = 45 # redundant ==> 16
NEIMGY = 40 # ==> 8

OCIMGSIZE = (OCIMGX, OCIMGY)
NEIMGSIZE = (NEIMGX, NEIMGY)

app = Flask(__name__, static_url_path='/static')
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

app.config.from_object(__name__)
app.secret_key = os.urandom(24)


cap = cv2.VideoCapture(PATH)
loaded = False

def resize_frame(img): #output: 0 => max/ 1 => min):
    cropedimg = np.zeros((NEIMGY, NEIMGX, 4), 'uint8')

    for x in range(NEIMGX):
        for y in range(NEIMGY):
            x0 = (x * NSIZEX)
            y0 = (y * NSIZEY)


            x1 = ((x * NSIZEX) + (NSIZEX-1))
            y1 = ((y * NSIZEY) + (NSIZEY-1))
            mask = img[y0:y1, x0:x1]

            minMaxMean = cv2.mean(mask)
            cropedimg[y][x] = minMaxMean

    return cropedimg

def mean_data_over_time(_img, _cache, _vis):
    for x in range(NEIMGX):
        for y in range(NEIMGY):
            _vis = combine_img_part(_img[y,x], _cache[y,x])
            _cache[y,x] = cv2.mean(_vis)

    return _cache

def combine_img_part(new_img, last_img):

    vis = np.zeros((1, 2, 4), np.uint8)
    vis[0][0] = new_img
    vis[0][1] = last_img

    return vis


def convert_data_old():

    c = 0
    out = []
    cacher = [[]]
    cacheg = [[]]
    cacheb = [[]]
    cachek = [[]]
    ret, frame = cap.read()
    r1, g1, b1, k1 = get_ch_from_frame(frame)
    visb1 = None

    while True:

        ret, frame = cap.read()
        c += 1
        r, g, b, k = get_ch_from_frame(frame)

        if c % 2==0:
            visr = combine_img(r, r1)
            visg = combine_img(g, g1)
            visb = combine_img(b, b1)
            visk = combine_img(k, k1)


            if visb1 is not None:
                t = combine_img(visr, visr1)

            visr1 = visr
            visg1 = visg
            visb1 = visb
            visk1 = visk



        #out = output_list(out, (r, g, b, k))
        #cv2.imshow("k", k)

        # cacher, c, outr = mean_data_over_time(r, cacher, c)
        # cacheg, c, outg = mean_data_over_time(g, cacheg, c)
        # cacheb, c, outb = mean_data_over_time(b, cacheb, c)
        # cachek, c, outk = mean_data_over_time(k, cachek, c)
        #
        # out = output_list(out, (outr, outg, outb, outk))

        if cv2.waitKey(1) == ord("q"):
            break

        r1, g1, b1, k1 = get_ch_from_frame(frame)

    return out



def convert_data():

    c = 0
    fps = 24
    time_period = 8
    cache = np.zeros((NEIMGY, NEIMGX, 4), 'uint8')
    vis = np.zeros((NEIMGY, NEIMGX, 4), 'uint8')
    output = []

    while True:
        start = time.time()
        c += 1
        try:
            ret, frame = cap.read()

            img = resize_frame(frame)

            cache = mean_data_over_time(img, cache, vis)

            if c == time_period * fps:
                c = 0
                pixels = np.float32(cache.reshape(-1, 3))

                n_colors = 5
                criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 200, .1)
                flags = cv2.KMEANS_RANDOM_CENTERS

                _, labels, palette = cv2.kmeans(pixels, n_colors, None, criteria, 10, flags)
                _, counts = np.unique(labels, return_counts=True)

                dominant = palette[np.argmax(counts)]
                colors = palette.copy()
                colors = colors.astype(int)

                output.append(colors.tolist())
        except Exception as e:
            print(e)
            print("finish")
            break

        end = time.time()

        #print(end-start)


    return output

@app.route('/', methods = ['GET', 'POST'])
def index():
    global loaded
    session['user_id'] = str(random.randint(0, 1000000000))


    #convert_data()

    if request.method == 'POST':
        if loaded:
            sound  = convert_data()
            #p = multiprocessing.Pool(1)
            #result = p.apply_async(convert_data)
            return render_template('index.html', sound_list=sound)
        loaded = True

    return render_template('index.html')



def main():
    if __name__ == '__main__':
        app.run(debug = True, threaded = True)


main()