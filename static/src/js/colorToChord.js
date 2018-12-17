const majorScales = ['major', 'mixolydian', 'lydian', 'phrygian dominant', 'harmonic major', 'major pentatonic', 'whole tone'];
const minorScales = ['aeolian', 'dorian', 'harmonic minor', 'melodic minor', 'phrygian', 'minor pentatonic', 'minor hexatonic', 'prometheus'];
const notes = Tonal.Note.names(); // Array 0-16 ("C", "C#", "Db", ...)
const instruments = []; // populated by getInstruments via JSON


const finalChords = [];
let leadInstruments = [];
let bassInstruments = [];

let chosenScale;

function assignChords(array) {

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

// const testArr = [[[18, 88, 106], [76, 83, 0], [7, 5, 4], [80, 0, 14], [3, 24, 58]], [[9, 5, 4], [5, 32, 59], [79, 83, 0], [91, 0, 23], [28, 96, 123]], [[59, 148, 142], [125, 121, 0], [6, 6, 6], [8, 56, 105], [125, 0, 47]], [[1, 1, 1], [49, 0, 14], [14, 56, 50], [0, 14, 55], [56, 50, 0]], [[122, 115, 0], [111, 142, 132], [13, 13, 14], [14, 92, 112], [114, 0, 90]], [[59, 132, 139], [11, 9, 9], [98, 0, 58], [15, 46, 65], [89, 94, 0]]];
// const testArr = [[[186, 165, 0], [159, 0, 212], [71, 20, 24], [211, 185, 165], [0, 205, 180]], [[155, 148, 0], [70, 162, 145], [33, 36, 44], [6, 71, 161], [148, 0, 65]], [[7, 28, 64], [126, 188, 0], [14, 87, 150], [187, 0, 62], [82, 158, 223]], [[75, 117, 0], [121, 0, 44], [66, 122, 173], [18, 14, 13], [14, 47, 80]], [[44, 91, 135], [10, 42, 71], [19, 16, 16], [118, 0, 39], [74, 111, 0]], [[148, 0, 58], [21, 22, 17], [123, 157, 0], [8, 61, 110], [65, 128, 165]], [[14, 66, 124], [121, 155, 0], [75, 153, 176], [152, 0, 62], [21, 23, 25]], [[122, 157, 0], [13, 64, 122], [150, 0, 62], [74, 151, 176], [19, 22, 20]], [[26, 33, 32], [153, 0, 78], [95, 159, 185], [122, 157, 0], [20, 80, 124]], [[145, 0, 60], [70, 133, 173], [110, 151, 0], [16, 64, 107], [23, 26, 25]], [[21, 79, 121], [96, 161, 187], [25, 29, 29], [153, 0, 77], [118, 156, 0]], [[142, 0, 53], [14, 62, 107], [107, 147, 0], [19, 22, 20], [69, 131, 174]], [[21, 20, 18], [75, 136, 176], [151, 0, 67], [118, 155, 0], [16, 63, 107]], [[82, 152, 184], [129, 167, 0], [161, 0, 72], [18, 69, 121], [23, 27, 19]], [[24, 26, 21], [151, 0, 67], [16, 68, 115], [126, 156, 0], [78, 154, 186]], [[24, 28, 22], [15, 69, 117], [129, 161, 0], [77, 149, 182], [151, 0, 64]], [[18, 79, 115], [141, 0, 74], [24, 33, 27], [122, 155, 0], [97, 151, 183]], [[149, 0, 56], [83, 163, 188], [18, 70, 129], [20, 30, 32], [115, 153, 0]], [[81, 141, 177], [117, 155, 0], [145, 0, 68], [23, 28, 25], [18, 73, 114]], [[27, 139, 175], [189, 201, 195], [28, 37, 38], [174, 0, 117], [167, 184, 0]], [[31, 42, 45], [28, 138, 162], [134, 161, 0], [170, 176, 177], [160, 0, 118]], [[7, 48, 97], [175, 0, 71], [137, 179, 0], [43, 133, 185], [165, 206, 216]], [[22, 34, 23], [16, 65, 110], [134, 0, 62], [76, 141, 164], [118, 147, 0]], [[141, 194, 222], [132, 182, 0], [178, 0, 71], [9, 44, 82], [36, 119, 179]], [[26, 31, 27], [142, 173, 0], [171, 0, 72], [82, 165, 196], [16, 77, 135]], [[151, 183, 0], [15, 76, 135], [175, 0, 71], [83, 171, 204], [29, 34, 25]], [[13, 68, 113], [151, 0, 66], [31, 34, 25], [126, 159, 0], [72, 141, 175]], [[148, 192, 203], [19, 122, 168], [34, 38, 37], [170, 191, 0], [183, 0, 115]], [[145, 0, 60], [20, 29, 28], [20, 70, 119], [79, 150, 178], [118, 157, 0]], [[172, 196, 0], [192, 0, 113], [32, 35, 35], [19, 126, 177], [152, 195, 209]], [[163, 0, 69], [75, 136, 181], [10, 71, 120], [24, 26, 23], [126, 171, 0]], [[66, 140, 175], [158, 0, 66], [130, 164, 0], [14, 69, 120], [27, 27, 24]]];
// const testArr = [[[46, 17, 5], [126, 85, 64], [3, 10, 3], [0, 97, 63], [10, 0, 52]], [[5, 5, 8], [137, 130, 61], [64, 42, 9], [53, 0, 99], [0, 88, 94]], [[44, 141, 0], [9, 83, 185], [2, 13, 99], [1, 2, 5], [142, 0, 6]]];
const soundArr = appConfig.sound_list; // Array von Christoph
console.log(soundArr)
soundArr.forEach(assignChords);