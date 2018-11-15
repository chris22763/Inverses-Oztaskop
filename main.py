try:
	import flask
	import midi
	import cv2 as cv
	import imutils
	import numpy as np
	from os import listdir
	from os.path import isfile, join

except Exception as e:
    print("you need to install some packages")



def create_server():
    pass

def minmaxpull(img, ocimgsize, neimgsize):
    pass

def main():
    pass


path_to_vid = './data/video_files/'
path_to_img = './data/img/'


video_files = [f for f in listdir(path_to_vid) if isfile(join(path_to_vid, f))]

def shrink(img, nsize, imgSize, output=0, resize=False): #output: 0 => max/ 1 => min

    cropedimg = np.zeros((nrow,ncol))


    for x in range(int (ncol)):
        for y in range(int (nrow)):

            x0 = (x * nsize)
            y0 = (y * nsize)

            x1 = (x * nsize) + (nsize-1)
            y1 = (y * nsize) + (nsize-1)

            #cropedimg.append(img[y0:y1, x0:x1])
            mask = img[y0:y1, x0:x1]
            minMax = cv.minMaxLoc(mask)
            if output == 0:
                if minMax[0] != 0:
                    val = 1 / minMax[0]
                else:
                    val = 0
            elif output == 1:
                val = 1/minMax[1]
            cropedimg[y][x] = val



    return cropedimg

def get_frames(cap):
    count = 0
    data = []
    if not cap.isOpened():
        print("Error opening video stream or file")

    while cap.isOpened():
        if count > 500:
            break
        if ret:
            #todo make this shit work
            data.append(img)  # save frame as JPEG file
            ret, img = cam.read()
            count += 1

    cam.release()

    return data



def get_channels(frame, nsize, imgSize):
    b, g, r = cv.split(frame)
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)

    grey_crop = shrink(gray, nsize, imgSize)
    red_crop = shrink(r, nsize, imgSize)
    green_crop = shrink(g, nsize, imgSize)
    blue_crop = shrink(b, nsize, imgSize)

    return grey_crop, red_crop, green_crop, blue_crop




cam = cv.VideoCapture(path_to_vid + video_files[0])

frames = get_frames(cam)



nsize = 8
nrow, ncol = 160 , 80
c = 0
count = 0
ret, img = cam.read()




#todo why se fuck is sis not w*rking
cap = cv.VideoCapture(frames[count])
ret, frame = cap.read()

imgSize = frame.shape
nrow = int(imgSize[0] / nsize)
ncol = int(imgSize[1] / nsize)




if cap.isOpened() == False:
    print("Error opening video stream or file")

while (cap.isOpened()):
    cv.imshow("img", frame)

    grey_crop, red_crop, green_crop, blue_crop = get_channels(frame, nsize, imgSize)

    gray = imutils.resize(grey_crop, width=imgSize[1])

    count += 1

else:
    print("Error opening video stream or file")


cap.release()
cv.destroyAllWindows()


if __name__ == '__main__':
        main()
