# Inverses-Oztaskop

Das inverse Oztaskop ist, in Anlehnung an den Roman "Rumo & Die Wunder im Dunkeln" von Walter Moers, 
ein Programm um Farben in Töne zu wandeln.
(Für weitere Informationen siehe: http://de.zamonien.wikia.com/wiki/Oztaskop)

Requirements:
- Python3
- virtualenv
- Browser with Web Audio API support (https://caniuse.com/#feat=audio-api)

Installation:
- Download or clone the repository
- Run a terminal from the resulting folder, activate the virtualenv and start main.py

  MacOSX/Linux:
  ```
  $ virtualenv venv
  $ source venv/bin/activate
  (venv) $ pip install -r requirements.txt
  
  (venv) $ python3 main.py
  ```

  Windows (requires adding virtualenv to your PATH):
  ```
  $ virtualenv venv
  $ venv\Scripts\activate.bat 
  (venv) $ pip install -r requirements.txt

  (venv) $ python main.py
  ```
- Open a browser at http://127.0.0.1:5000/ to try it out

How to use your own content:
- copy your .mp4 file (preferably 720p 24fps) to Inverses-Oztaskop/static/video_files/ 
- rename your file to a name that allready exist. 
- now it should work, if it doesn't restart your server and it's done.
