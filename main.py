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
data = {
    0: 'pre rendered data array',
    1: [[[84, 129, 177], [21, 61, 103], [9, 16, 20], [77, 124, 0], [126, 0, 50]], [[103, 0, 36], [9, 33, 58], [10, 10, 9], [39, 70, 120], [59, 103, 0]]],
    2: [[[78, 155, 184], [112, 152, 0], [9, 11, 11], [156, 0, 63], [14, 67, 120]], [[141, 0, 71], [16, 70, 109], [7, 8, 9], [111, 142, 0], [87, 147, 175]], [[113, 147, 0], [98, 163, 189], [9, 12, 14], [20, 77, 116], [148, 0, 75]], [[145, 0, 71], [8, 11, 12], [96, 160, 187], [19, 74, 115], [110, 145, 0]], [[9, 12, 14], [147, 0, 74], [98, 160, 187], [19, 74, 116], [111, 146, 0]]] ,
    3: [[[46, 17, 5], [126, 85, 64], [3, 10, 3], [0, 97, 63], [10, 0, 52]], [[5, 5, 8], [137, 130, 61], [64, 42, 9], [53, 0, 99], [0, 88, 94]], [[44, 141, 0], [9, 83, 185], [2, 13, 99], [1, 2, 5], [142, 0, 6]]],
    4: [[[18, 88, 106], [76, 83, 0], [7, 5, 4], [80, 0, 14], [3, 24, 58]], [[9, 5, 4], [5, 32, 59], [79, 83, 0], [91, 0, 23], [28, 96, 123]], [[59, 148, 142], [125, 121, 0], [6, 6, 6], [8, 56, 105], [125, 0, 47]], [[1, 1, 1], [49, 0, 14], [14, 56, 50], [0, 14, 55], [56, 50, 0]], [[122, 115, 0], [111, 142, 132], [13, 13, 14], [14, 92, 112], [114, 0, 90]], [[59, 132, 139], [11, 9, 9], [98, 0, 58], [15, 46, 65], [89, 94, 0]]]
}
paths = {
    0: './static/video_files/short_test.mp4',
    1: './static/video_files/short_test.mp4',
    2: './static/video_files/game_short.mp4',
    3: './static/video_files/blade_runner_short.mp4',
    4: './static/video_files/LOTR.mp4'
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


def convert_data(i):

    global paths

    _cap = cv2.VideoCapture(paths[i])
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
            ret, frame = _cap.read()

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
    video_path = ''

    session['user_id'] = str(random.randint(0, 1000000000))


    #convert_data()

    if request.method == 'POST':
        p = request.form
        print(p)
        if loaded:
            if p['select'] != '0':
                i = int(p['select'])
                #sound = data[i]
                sound  = convert_data(i)
                video_path = paths[i]

            #p = multiprocessing.Pool(1)
            #result = p.apply_async(convert_data)

        loaded = True

    return render_template('index_page.html', sound_list=sound, video_path=video_path)



def main():
    if __name__ == '__main__':
        app.run(debug = True, threaded = True)


main()