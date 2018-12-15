STEPS_PER_CHORD = 8; // Number of steps to play each chord.
STEPS_PER_PROG = 4 * STEPS_PER_CHORD;
NUM_REPS = 2; // Number of times to repeat chord progression.
SEQUENCE_LENGTH = NUM_REPS * STEPS_PER_PROG;

// Set up Improv RNN model and player.
const model = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
const player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
let playing = false;

let count = 0;

let seq = { 
  quantizationInfo: {stepsPerQuarter: 4},
  notes: [],
  totalQuantizedSteps: 1
};  

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

        seq.notes.forEach((note) => {
          //console.log(note);
        });

        // Play it!
        player.start(seq, 120).then(() => {
          playing = false;
          document.getElementById('message1').innerText = 'Press play to generate a new sequence!';
          document.getElementById('play').disabled = false;
          count = 0;
          seq = { 
            quantizationInfo: {stepsPerQuarter: 4},
            notes: [],
            totalQuantizedSteps: 1
          };         
        });
      }
    });
}  

// Populate chord-arrays and call continueSequence
function startChords(howManyTimes, leadInstrument, bassInstrument) {

  const scales = Tonal.Scale.names(); // Array 0-90 ("bebop", "flamenco", ...)
  const notes = Tonal.Note.names(); // Array 0-16 ("C", "C#", "Db", ...)

  for (let i = 0; i < howManyTimes; i++) {

    const chordArray = [];
    const rnd1 = Math.floor(Math.random() * scales.length); // random number between 0-90
    const fittingChords = Tonal.Scale.chords(scales[rnd1]); // Array of varying size with fitting chords for the given scale  
    console.log(scales[rnd1]);

    for (let j = 0; j < 4; j++) {
    
      const rnd2 = Math.floor(Math.random() * notes.length); // random number between 0-16
      const rnd3 = Math.floor(Math.random() * fittingChords.length);

      const chord = notes[rnd2] + fittingChords[rnd3];

      chordArray.push(chord);
    
    }

    console.log(chordArray);
    var elementID = 'message' + (i+2);
    document.getElementById(elementID).innerText = scales[rnd1] + ': ' + chordArray;
  
    if(i == (howManyTimes - 1)) { 
      continueSequence(chordArray, leadInstrument, bassInstrument, true); // Play the sequence!
    }
    else { 
      continueSequence(chordArray, leadInstrument, bassInstrument); 
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
  playing = true;
  document.getElementById('play').disabled = true; 
  document.getElementById('message1').innerText = 'Improvising over:';

  let leadInstrument = parseInt(document.getElementById('lead-dropdown').value);
  let bassInstrument = parseInt(document.getElementById('bass-dropdown').value);

  mm.Player.tone.context.resume();
  player.stop();
  startChords(3, leadInstrument, bassInstrument);
}