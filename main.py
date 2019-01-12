import os
import random
import cv2
import time
import numpy as np
from flask import Flask, render_template, request, session


PATH = "./static/video_files/short_test.mp4"

#pre rendered data array
data = {
    0: [[[84, 129, 177], [21, 61, 103], [9, 16, 20], [77, 124, 0], [126, 0, 50]], [[103, 0, 36], [9, 33, 58], [10, 10, 9], [39, 70, 120], [59, 103, 0]]],
    1: [[[180, 161, 0], [161, 0, 206], [0, 0, 0], [209, 183, 163], [0, 206, 181]], [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]], [[148, 142, 0], [70, 161, 149], [8, 7, 7], [5, 67, 145], [142, 0, 65]], [[9, 69, 129], [126, 187, 0], [186, 0, 65], [75, 156, 219], [0, 1, 2]], [[12, 9, 8], [69, 129, 175], [119, 0, 48], [14, 46, 79], [79, 121, 0]]],
    2: [[[46, 17, 5], [126, 85, 64], [3, 10, 3], [0, 97, 63], [10, 0, 52]], [[5, 5, 8], [137, 130, 61], [64, 42, 9], [53, 0, 99], [0, 88, 94]], [[44, 141, 0], [9, 83, 185], [2, 13, 99], [1, 2, 5], [142, 0, 6]]],
    3: [[[125, 121, 0], [9, 57, 105], [6, 6, 6], [61, 150, 144], [124, 0, 46]], [[57, 50, 0], [13, 56, 49], [1, 1, 0], [0, 13, 55], [48, 0, 14]], [[123, 116, 0], [111, 142, 132], [13, 13, 14], [15, 92, 113], [114, 0, 91]], [[14, 46, 65], [11, 9, 9], [59, 132, 139], [99, 0, 58], [89, 94, 0]], [[12, 9, 8], [59, 126, 134], [97, 0, 57], [13, 44, 63], [91, 97, 0]]]

}
# path for the clips
paths = {
    0: './static/video_files/short_test.mp4',
    1: './static/video_files/game_short.mp4',
    2: './static/video_files/blade_runner.mp4',
    3: './static/video_files/LOTR.mp4'
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

    # initalizing cap
    cap = cv2.VideoCapture(paths[i])

    # c => is a counter we use (with fps) to determine if the time_period of 8 seconds has past
    c = 0
    fps = 24
    time_period = 8

    # cache and vis are lists to store
    cache = np.zeros((NEIMGY, NEIMGX, 4), 'uint8')
    vis = np.zeros((NEIMGY, NEIMGX, 4), 'uint8')
    output = []
    while True:
        c += 1
        try:
            ret, frame = cap.read()
            print(ret)
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


    return output

@app.route('/', methods = ['GET', 'POST'])
def index():
    global loaded

    sound = []
    video_path = ''

    session['user_id'] = str(random.randint(0, 1000000000))


    if request.method == 'POST':
        p = request.form

        if p['select'] != '0':
            i = int(p['select'])

            # convert_data loads a video clip with the path of index i mentioned in the list 'Path'
            # the output data was stored in the list 'data' so on presentation we could skip the calculation step
            # if someone want to try it for them self you just need to uncomment line 157 and comment line 159

            #sound  = convert_data(i)

            sound = data[i]
            video_path = paths[i]

    return render_template('index_page.html', sound_list=sound, video_path=video_path)



def main():
    if __name__ == '__main__':
        app.run(debug = True, threaded = True)


main()