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


video_clips = {
    'short_test' : ["./static/video_files/short_test.mp4", 24, 16, 1280, 720],
    'luxor_jr': ["./static/video_files/short_test.mp4", 30, 96, 1184, 720],
    'game': ["./static/video_files/game.mp4", 24, 272, 1280, 720]
}

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

    sound = []

    session['user_id'] = str(random.randint(0, 1000000000))


    #convert_data()

    if request.method == 'POST':
        if loaded:
            sound  = convert_data()
            #p = multiprocessing.Pool(1)
            #result = p.apply_async(convert_data)

        loaded = True

    return render_template('index.html', sound_list=sound)



def main():
    if __name__ == '__main__':
        app.run(debug = True, threaded = True)


main()