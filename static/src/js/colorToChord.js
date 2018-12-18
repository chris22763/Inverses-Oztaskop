const majorScales = ['major', 'mixolydian', 'lydian', 'phrygian dominant', 'harmonic major', 'major pentatonic', 'whole tone'];
const minorScales = ['aeolian', 'dorian', 'harmonic minor', 'melodic minor', 'phrygian', 'minor pentatonic', 'minor hexatonic', 'prometheus'];
const notes = Tonal.Note.names(); // Array 0-16 ("C", "C#", "Db", ...)
const instruments = []; // populated by getInstruments via JSON

let finalChords = [];
let leadInstruments = [];
let bassInstruments = [];

function assignChords(array) {

    let chosenScale;

    let h = []; 
    let s = [];
    let l = [];
    let avgH = 0;
    let avgS = 0;
    let avgL = 0;
    
    for (let i = 0; i < (array.length); i++) {
        
        let colorHSL = rgbToHsl(array[i]);
        h.push(colorHSL[0]);
        s.push(colorHSL[1]);
        l.push(colorHSL[2]);

        avgH += colorHSL[0];
        avgS += colorHSL[1];
        avgL += colorHSL[2];
        
    }

    avgH /= array.length;
    avgS /= array.length;
    avgL /= array.length;

    let minMaxH = Math.max(...h) - Math.min(...h);
    let minMaxS = Math.max(...s) - Math.min(...s);
    let minMaxL = Math.max(...l) - Math.min(...l);

    h.sort();
    s.sort();
    l.sort();

    let meanH = h[(array.length - 1) / 2];
    let meanS = s[(array.length - 1) / 2];
    let meanL = l[(array.length - 1) / 2];

    let avgMinMaxH = (avgH + minMaxH) / 2;
    let diffH = Math.floor(Math.abs(avgMinMaxH - meanH));

    let diffL = Math.floor(Math.abs(meanL - avgL));

    let rnd1 = Math.round(Math.random());
    let rnd2 = Math.round(Math.random());

    if(diffH < 30) {

        if(avgS > 66) {

            if(diffL < 2) {

                if(rnd1 == 0) {

                    chosenScale = majorScales[1]; // mixolydian

                    if(rnd2 == 0) {
                        leadInstruments.push(instruments.indexOf('tenor_sax'));
                        bassInstruments.push(instruments.indexOf('electric_guitar_jazz'));
                    }
                    else {
                        leadInstruments.push(instruments.indexOf('lead_3_calliope'));
                        bassInstruments.push(instruments.indexOf('tuba'));
                    }
                }
                else {

                    chosenScale = majorScales[3]; // phrygian dominant

                    if(rnd2 == 0) {
                        leadInstruments.push(instruments.indexOf('violin'));
                        bassInstruments.push(instruments.indexOf('cello'));
                    }
                    else {
                        leadInstruments.push(instruments.indexOf('cello'));
                        bassInstruments.push(instruments.indexOf('synthstrings_1'));
                    }
                }
            }
            else {

                chosenScale = majorScales[5]; // major pentatonic

                if(rnd2 == 0) {
                    leadInstruments.push(instruments.indexOf('oboe'));
                    bassInstruments.push(instruments.indexOf('acoustic_bass'));
                }
                else {
                    leadInstruments.push(instruments.indexOf('vibraphone'));
                    bassInstruments.push(instruments.indexOf('slap_bass_1'));
                }
            }
        }
        else {

            if(diffL < 2) {

                if(rnd1 == 0) {

                    chosenScale = majorScales[0]; // major

                    if(rnd2 == 0) {
                        leadInstruments.push(instruments.indexOf('melodic_tom'));
                        bassInstruments.push(instruments.indexOf('lead_8_bass_lead'));
                    }
                    else {
                        leadInstruments.push(instruments.indexOf('clarinet'));
                        bassInstruments.push(instruments.indexOf('electric_bass_finger'));
                    }
                }
                else {

                    chosenScale = majorScales[4]; // harmonic major

                    if(rnd2 == 0) {
                        leadInstruments.push(instruments.indexOf('trumpet'));
                        bassInstruments.push(instruments.indexOf('timpani'));
                    }
                    else {
                        leadInstruments.push(instruments.indexOf('synth_voice'));
                        bassInstruments.push(instruments.indexOf('synth_bass_2'));
                    }
                }
            }
            else {

                if(rnd1 == 0) {

                    chosenScale = majorScales[2]; // lydian

                    if(rnd2 == 0) {
                        leadInstruments.push(instruments.indexOf('music_box'));
                        bassInstruments.push(instruments.indexOf('percussive_organ'));
                    }
                    else {
                        leadInstruments.push(instruments.indexOf('pizzicato_strings'));
                        bassInstruments.push(instruments.indexOf('synth_bass_1'));
                    }
                }
                else {

                    chosenScale = majorScales[6]; // whole tone

                    if(rnd2 == 0) {
                        leadInstruments.push(instruments.indexOf('marimba'));
                        bassInstruments.push(instruments.indexOf('fx_2_soundtrack'));
                    }
                    else {
                        leadInstruments.push(instruments.indexOf('tinkle_bell'));
                        bassInstruments.push(instruments.indexOf('fretless_bass'));
                    }
                }
            }      
        }  
    }
    else {

        if(avgS > 66) {
  
            if(diffL < 2) {

                if(rnd1 == 0) {

                    chosenScale = minorScales[1]; // dorian

                    if(rnd2 == 0) {
                        leadInstruments.push(instruments.indexOf('electric_guitar_jazz'));
                        bassInstruments.push(instruments.indexOf('shanai'));
                    }
                    else {
                        leadInstruments.push(instruments.indexOf('kalimba'));
                        bassInstruments.push(instruments.indexOf('electric_bass_pick'));
                    }
                }
                else {

                    chosenScale = minorScales[3]; // melodic minor

                    if(rnd2 == 0) {
                        leadInstruments.push(instruments.indexOf('whistle'));
                        bassInstruments.push(instruments.indexOf('english_horn'));
                    }
                    else {
                        leadInstruments.push(instruments.indexOf('glockenspiel'));
                        bassInstruments.push(instruments.indexOf('rock_organ'));
                    }
                }
            }
            else {

                if(rnd1 == 0) {

                    chosenScale = minorScales[4]; // phrygian

                    if(rnd2 == 0) {
                        leadInstruments.push(instruments.indexOf('woodblock'));
                        bassInstruments.push(instruments.indexOf('pad_2_warm'));
                    }
                    else {
                        leadInstruments.push(instruments.indexOf('flute'));
                        bassInstruments.push(instruments.indexOf('oboe'));
                    }
                }
                else {

                    chosenScale = minorScales[5]; // minor pentatonic

                    if(rnd2 == 0) {
                        leadInstruments.push(instruments.indexOf('viola'));
                        bassInstruments.push(instruments.indexOf('woodblock'));
                    }
                    else {
                        leadInstruments.push(instruments.indexOf('xylophone'));
                        bassInstruments.push(instruments.indexOf('slap_bass_2'));
                    }
                }
            }      
        }
        else {

            if(diffL < 2) {

                if(rnd1 == 0) {

                    chosenScale = minorScales[6]; // minor hexatonic

                    if(rnd2 == 0) {
                        leadInstruments.push(instruments.indexOf('ocarina'));
                        bassInstruments.push(instruments.indexOf('bassoon'));
                    }
                    else {
                        leadInstruments.push(instruments.indexOf('fiddle'));
                        bassInstruments.push(instruments.indexOf('koto'));
                    }
                }
                else {

                    chosenScale = minorScales[2]; // harmonic minor

                    if(rnd2 == 0) {
                        leadInstruments.push(instruments.indexOf('shamisen'));
                        bassInstruments.push(instruments.indexOf('kalimba'));
                    }
                    else {
                        leadInstruments.push(instruments.indexOf('shakuhachi'));
                        bassInstruments.push(instruments.indexOf('sitar'));
                    }
                }
            }
            else {

                if(rnd1 == 0) {

                    chosenScale = minorScales[0]; // aeolian

                    if(rnd2 == 0) {
                        leadInstruments.push(instruments.indexOf('string_ensemble_1'));
                        bassInstruments.push(instruments.indexOf('trombone'));
                    }
                    else {
                        leadInstruments.push(instruments.indexOf('string_ensemble_2'));
                        bassInstruments.push(instruments.indexOf('contrabass'));
                    }
                }
                else {

                    chosenScale = minorScales[7]; // prometheus

                    if(rnd2 == 0) {
                        leadInstruments.push(instruments.indexOf('bassoon'));
                        bassInstruments.push(instruments.indexOf('taiko_drum'));
                    }
                    else {
                        leadInstruments.push(instruments.indexOf('lead_2_sawtooth'));
                        bassInstruments.push(instruments.indexOf('melodic_tom'));
                    }
                }
            }      
        }
    }

    const fittingChords = Tonal.Scale.chords(chosenScale);
    shuffleArray(fittingChords);
    shuffleArray(notes);

    for (let i = 0; i < 4; i++) {

        if(fittingChords[i] == '69#11') {
            finalChords.push(notes[i] + fittingChords[fittingChords.length - 1]);
        }
        else {
            finalChords.push(notes[i] + fittingChords[i]);
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function rgbToHsl(array) {

    r = array[0];
    g = array[1];
    b = array[2];

    r /= 255, g /= 255, b /= 255;
  
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
  
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
  
      h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
  
    return [ h, s, l ];
}

function getInstruments() {

    const url = 'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus/soundfont.json';

    const request = new XMLHttpRequest();
    request.open('GET', url, false);

    request.onload = function() {

        if (request.status === 200) {

            data = JSON.parse(request.responseText);

            for (let i = 0; i < 128; i++) {

                instruments.push(data.instruments[i]);

            }  
        } 
        else {
            console.log('Reached the server, but it returned an error.');
        }   
    }

    request.onerror = function() {
        console.error('An error occurred fetching the JSON from ' + url);
    };

    request.send();
}

getInstruments();

const soundArr = appConfig.sound_list;
console.log(soundArr)
soundArr.forEach(assignChords);