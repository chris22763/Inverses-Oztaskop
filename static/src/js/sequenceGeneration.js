STEPS_PER_CHORD = 8; // Number of steps to play each chord.
STEPS_PER_PROG = 4 * STEPS_PER_CHORD;
NUM_REPS = 2; // Number of times to repeat chord progression.
SEQUENCE_LENGTH = NUM_REPS * STEPS_PER_PROG;

// Set up Improv RNN model and player.
const model = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
const player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');

// sequence to continue
let seq = { 
  quantizationInfo: {stepsPerQuarter: 4},
  notes: [],
  totalQuantizedSteps: 1
};  

let count = 0;

// Sample over chord progression.
function continueSequence(currentChords, leadInstrument, bassInstrument, playIt) {

  if(typeof playIt === 'undefined') { playIt = false; }
  
  const chords = currentChords;

  model.continueSequence(seq, STEPS_PER_PROG + (NUM_REPS-1)*STEPS_PER_PROG - 1, 0.9, chords)
    .then((contSeq) => {
      // Add the continuation to the original.
      contSeq.notes.forEach((note) => {
        note.quantizedStartStep += 1 + (SEQUENCE_LENGTH*count);
        note.quantizedEndStep += 1 + (SEQUENCE_LENGTH*count); 
        note.program = leadInstrument;   // INSTRUMENT -> soundfont.json
        seq.notes.push(note);
      });

      const roots = chords.map(mm.chords.ChordSymbols.root);
      for (let i=0; i<NUM_REPS; i++) { 
        // Add the bass progression.
        seq.notes.push({
          pitch: 36 + roots[0],
          quantizedStartStep: i*STEPS_PER_PROG + (SEQUENCE_LENGTH*count),
          quantizedEndStep: i*STEPS_PER_PROG + STEPS_PER_CHORD + (SEQUENCE_LENGTH*count),
          program: bassInstrument  // INSTRUMENT -> soundfont.json
        });
        seq.notes.push({
          pitch: 36 + roots[1],
          quantizedStartStep: i*STEPS_PER_PROG + STEPS_PER_CHORD + (SEQUENCE_LENGTH*count),
          quantizedEndStep: i*STEPS_PER_PROG + 2*STEPS_PER_CHORD + (SEQUENCE_LENGTH*count),
          program: bassInstrument
        });
        seq.notes.push({
          pitch: 36 + roots[2],
          quantizedStartStep: i*STEPS_PER_PROG + 2*STEPS_PER_CHORD + (SEQUENCE_LENGTH*count),
          quantizedEndStep: i*STEPS_PER_PROG + 3*STEPS_PER_CHORD + (SEQUENCE_LENGTH*count),
          program: bassInstrument
        });
        seq.notes.push({
          pitch: 36 + roots[3],
          quantizedStartStep: i*STEPS_PER_PROG + 3*STEPS_PER_CHORD + (SEQUENCE_LENGTH*count),
          quantizedEndStep: i*STEPS_PER_PROG + 4*STEPS_PER_CHORD + (SEQUENCE_LENGTH*count),
          program: bassInstrument
        });        
      }

      count++;
      
      // Set total sequence length.
      seq.totalQuantizedSteps = STEPS_PER_PROG * NUM_REPS * count;
 
      if(playIt) {

        player.loadSamples(seq).then(() => {

          // start video here
          let vid = document.getElementById('clip');
          vid.muted = true;
          vid.play();

          player.start(seq, 120).then(() => {

            finalChords = [];
            leadInstruments = [];
            bassInstruments = [];

            vid.load();

            soundArr.forEach(assignChords);
            
            document.getElementById('play').disabled = false;
            count = 0;
            seq = { 
              quantizationInfo: {stepsPerQuarter: 4},
              notes: [],
              totalQuantizedSteps: 1
            };
          });
        });      
      }
  });
}  

// Populate chord-arrays and call continueSequence
function startChords(chordArray, leadInstruments, bassInstruments) {

  for (let i = 0; i < (chordArray.length / 4); i++) {

    const chordProgression = chordArray.slice(i*4, i*4+4);

    if(i == ((chordArray.length / 4) - 1)) {
      
      continueSequence(chordProgression, leadInstruments[i], bassInstruments[i], true);
    }
    else {
      continueSequence(chordProgression, leadInstruments[i], bassInstruments[i]);
    }
  }
}

// Initialize model then start playing.
model.initialize().then(() => {
  document.getElementById('message1').innerText = 'Done loading model.'
  document.getElementById('play').disabled = false;
});

// Play when play button is clicked.
document.getElementById('play').onclick = () => {

  console.log(soundArr);
  document.getElementById('play').disabled = true; 
  player.resumeContext();
  player.stop();
  startChords(finalChords, leadInstruments, bassInstruments);
}