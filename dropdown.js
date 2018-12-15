let dropdownLead = document.getElementById('lead-dropdown');
dropdownLead.length = 0;
let defaultOptionLead = document.createElement('option');
defaultOptionLead.text = 'Choose Lead instrument';
defaultOptionLead.value = 0;
dropdownLead.add(defaultOptionLead);
dropdownLead.selectedIndex = 0;

let dropdownBass = document.getElementById('bass-dropdown');
dropdownBass.length = 0;
let defaultOptionBass = document.createElement('option');
defaultOptionBass.text = 'Choose Bass instrument';
defaultOptionBass.value = 32;
dropdownBass.add(defaultOptionBass);
dropdownBass.selectedIndex = 0;

const url = 'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus/soundfont.json';

const request = new XMLHttpRequest();
request.open('GET', url, true);

request.onload = function() {

  if (request.status === 200) {

    const data = JSON.parse(request.responseText);

    for (let i = 0; i < 128; i++) {
        optionLead = document.createElement('option');
        optionLead.text = data.instruments[i];
        optionLead.value = i;
        dropdownLead.add(optionLead);

        optionBass = document.createElement('option');
        optionBass.text = data.instruments[i];
        optionBass.value = i;
        dropdownBass.add(optionBass);   
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