import numpy as np
import cv2

PATH = "./data/video_files/CGI_Animated_Short_Film_The_Box_La_Boîte_by_ESMA_CGMeetup.mp4"

cap = cv2.VideoCapture(PATH)

ret, frame = cap.read()

while ret:
    ret, frame = cap.read()

    cv2.imshow("img", frame)

    if cv2.waitKey(1) == ord("q"):
        break