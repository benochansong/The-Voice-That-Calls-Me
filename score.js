// Original chamber score, synthesized locally. Melodies use scale degrees, so the
// little three-note call can return in a different register, mode, or instrument.
const scoreScales = {
  major:      [0, 2, 4, 5, 7, 9, 11],
  dorian:     [0, 2, 3, 5, 7, 9, 10],
  minor:      [0, 2, 3, 5, 7, 8, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10]
};

// Each entry is [starting eighth note, scale degree above this chord, duration].
// A phrase has a question, an answer, a variation and a cadence.
const scorePhrases = {
  call: [
    [[0, 2, 1.7], [2, 3, 0.85], [3, 0, 2.5]],
    [[1, 2, 1.4], [3, 4, 2.2]],
    [[0, 2, 2], [3, 3, 0.8], [4, 7, 1.6]],
    [[0, 4, 1.6], [2, 2, 1.2], [4, 0, 2]]
  ],
  stars: [
    [[1, 4, 2.6], [5, 7, 1.7]],
    [[2, 5, 2.8]],
    [[0, 4, 3.4], [5, 2, 2.2]],
    [[2, 0, 4]]
  ],
  road: [
    [[0, 0, 1.5], [2, 2, 0.9], [3, 4, 1.6]],
    [[1, 4, 0.85], [2, 3, 1.7], [4, 2, 1.5]],
    [[0, 2, 1.5], [2, 1, 1], [3, 0, 2.3]],
    [[0, 4, 2.3], [3, 0, 2.8]]
  ],
  openAir: [
    [[0, 4, 3.8], [5, 5, 1.6]],
    [[0, 7, 3], [4, 4, 2.6]],
    [[1, 2, 2.5], [4, 4, 2]],
    [[0, 2, 2.8], [4, 0, 3.4]]
  ],
  watch: [
    [[0, 2, 3.8]],
    [[3, 1, 2], [5, 0, 2.6]],
    [[1, 4, 3.6]],
    [[2, 0, 4.6]]
  ],
  sail: [
    [[0, 0, 0.8], [3, 4, 0.8], [5, 3, 0.9]],
    [[0, 2, 1.7], [3, 1, 1.5]],
    [[0, 0, 1], [2, 1, 0.8], [3, 4, 1.7]],
    [[0, 2, 1.5], [3, 0, 2.5]]
  ]
};

// Scale-degree voicings for the plucked part. A null is a rest.
const scorePicking = {
  steps:  [0, null, 4, 2, null, 4],
  table:  [0, 4, null, 2, 4, null],
  tide:   [0, null, 4, null, 2, null, 4, null],
  chapel: [0, null, null, null, 4, null, null, null],
  tremor: [0, 4, 0, 2, 4, 0],
  still:  [null, null, null, null, null, null, null, null]
};

// key is the MIDI pitch at the bottom of the melody; bass and lute play below it.
const scorePieces = {
  nightField: {key:62, mode:'dorian', bpm:63, pick:'chapel', line:'stars', lead:'flute', chords:[0,3,0,4,5,3,4,0]},
  goodNews:   {key:67, mode:'major', bpm:69, pick:'tide', line:'openAir', lead:'glass', chords:[0,3,5,4,0,3,4,0]},
  cradle:     {key:62, mode:'major', bpm:61, pick:'steps', line:'call', lead:'flute', chords:[0,3,5,4,0,3,4,0]},
  market:     {key:65, mode:'major', bpm:88, pick:'table', line:'call', lead:'lute', chords:[0,3,0,4,5,3,4,0]},
  doorstep:   {key:62, mode:'major', bpm:72, pick:'chapel', line:'watch', lead:'bow', chords:[0,5,3,4]},
  rooftop:    {key:62, mode:'dorian', bpm:81, pick:'steps', line:'road', lead:'lute', chords:[0,3,1,4,0,5,3,0]},
  leviTable:  {key:65, mode:'mixolydian', bpm:82, pick:'table', line:'sail', lead:'flute', chords:[0,6,3,0,5,3,4,0]},
  hillside:   {key:67, mode:'major', bpm:70, pick:'tide', line:'openAir', lead:'flute', chords:[0,3,1,4,5,3,4,0]},
  seeds:      {key:60, mode:'dorian', bpm:76, pick:'steps', line:'call', lead:'glass', chords:[0,3,6,0,2,3,4,0]},
  boarding:   {key:62, mode:'mixolydian', bpm:78, pick:'table', line:'sail', lead:'lute', chords:[0,4,6,3]},
  tempest:    {key:55, mode:'minor', bpm:98, pick:'tremor', line:'sail', lead:'bow', chords:[0,1,0,4,0,5,1,4]},
  calmWater:  {key:62, mode:'major', bpm:56, pick:'chapel', line:'stars', lead:'flute', chords:[0,3,5,4]},
  meadow:     {key:67, mode:'major', bpm:85, pick:'table', line:'road', lead:'flute', chords:[0,3,5,4,0,1,4,0]},
  road:       {key:60, mode:'dorian', bpm:74, pick:'steps', line:'road', lead:'bow', chords:[0,3,6,0,2,3,4,0]},
  shepherd:   {key:65, mode:'major', bpm:62, pick:'chapel', line:'call', lead:'flute', chords:[0,5,3,0]},
  jericho:    {key:64, mode:'mixolydian', bpm:85, pick:'table', line:'road', lead:'lute', chords:[0,3,6,4,0,5,3,0]},
  gate:       {key:65, mode:'major', bpm:92, pick:'steps', line:'road', lead:'flute', chords:[0,0,3,4,5,3,4,0]},
  sanctuary:  {key:62, mode:'dorian', bpm:58, pick:'still', line:'stars', lead:'glass', chords:[0,3,6,0]},
  bethany:    {key:64, mode:'minor', bpm:62, pick:'chapel', line:'openAir', lead:'flute', chords:[0,5,3,4,0,3,4,0]},
  upperRoom:  {key:60, mode:'dorian', bpm:62, pick:'chapel', line:'call', lead:'bow', chords:[0,3,5,4,0,3,4,0]},
  nightWatch: {key:57, mode:'minor', bpm:55, pick:'still', line:'watch', lead:'bow', chords:[0,5,1,4]},
  trial:      {key:55, mode:'dorian', bpm:60, pick:'chapel', line:'watch', lead:'bow', chords:[0,1,6,0]},
  firstLight: {key:62, mode:'dorian', bpm:60, pick:'chapel', line:'stars', lead:'flute', chords:[0,3,5,4]},
  home:       {key:65, mode:'major', bpm:60, pick:'still', line:'call', lead:'flute', chords:[0,3,5,0]},
  breakfast:  {key:65, mode:'major', bpm:78, pick:'table', line:'call', lead:'flute', chords:[0,3,5,4,0,1,4,0]},
  peter:      {key:62, mode:'major', bpm:62, pick:'chapel', line:'watch', lead:'flute', chords:[0,5,3,4]},
  tableEnd:   {key:65, mode:'major', bpm:65, pick:'table', line:'call', lead:'lute', chords:[0,3,0,4,5,3,4,0]},
  boatEnd:    {key:65, mode:'major', bpm:61, pick:'tide', line:'call', lead:'flute', chords:[0,3,0,4,5,3,4,0]}
};

const prologueScore = {
  watchFlock:'nightField', goodNews:'goodNews', toVillage:'goodNews',
  toManger:'cradle', newborn:'cradle', holdMemory:'cradle', acrossYears:'cradle'
};

const sceneScore = new Map();
function assignScore(cue, ...steps) {
  for (const step of steps) sceneScore.set(step, cue);
}
assignScore('doorstep','bedside','recovery','aside','evening');
assignScore('rooftop','doorway','stairs','lowering','below','witness','healing','end');
assignScore('leviTable','levi','supper','seat','dusk');
assignScore('hillside','climb','flowers','lake');
assignScore('seeds','boatTalk','pathSeed','stoneSeed','thornSeed','harvest','returnLake');
assignScore('calmWater','hillEnd','quiet','shoreRest');
assignScore('boarding','boarding');
assignScore('tempest','gale');
assignScore('meadow','family','seats','bread','sharing','baskets','fourthEnd');
assignScore('road','neighbor','wounded','tending','toInn','inn');
assignScore('shepherd','embers','crag','found');
assignScore('jericho','outcry','called','tree','roomTree','welcome','supperDoor','pledge','fifthEnd');
assignScore('gate','ridge','procession','cityGate');
assignScore('sanctuary','colonnade','disciples','twilight','sixthEnd');
assignScore('bethany','flask','giveRoom','anoint','backToCity');
assignScore('upperRoom','upperDoor','washFeet','mealPlace','lastMeal');
assignScore('nightWatch','gardenDoor','watch','prayer','seize','followFire','denial','emptySeat','morning','passionChoice');
assignScore('trial','verdict','sentence','crossRoad','witnesses','gravePath','linenTomb');
assignScore('firstLight','gardenDawn','openTomb','tears','newsPath');
assignScore('home','reunion');
assignScore('breakfast','galilee','netMorning','charcoal','mealMorning','lastRest');
assignScore('peter','peterWalk','threeCalls');
// Leave the storm's stilling, coins, rooster, death, Sabbath, witness and name audible on their own.
assignScore(null,'hush','twoCoins','threeAnswers','briefPassion','crucified','laidToRest','sabbath','seventhEnd','herName','testimony','calledHome');

function scoreCue(save) {
  if (save.prologue) return prologueScore[save.prologue] || null;
  if (!save.chapterStep) return save.done ? 'calmWater' : 'market';
  if (save.chapterStep === 'credits') return save.restSpot === 'boat' ? 'boatEnd' : 'tableEnd';
  return sceneScore.get(save.chapterStep) || null;
}

const scoreTimbres = {
  bass:  {partials:[1,.33,.1], attack:.07, gain:.068},
  lute:  {partials:[1,.48,.22,.11,.045], attack:.012, gain:.115},
  flute: {partials:[1,.12,.08,.025], attack:.095, gain:.132},
  bow:   {partials:[1,.38,.26,.12,.07,.03], attack:.17, gain:.102},
  glass: {partials:[1,.05,.15,.045,.02], attack:.016, gain:.085}
};
const scoreWaveBanks = new WeakMap();
function scoreWave(context, instrument) {
  let bank = scoreWaveBanks.get(context);
  if (!bank) {
    bank = new Map();
    scoreWaveBanks.set(context, bank);
  }
  if (!bank.has(instrument)) {
    const partials = scoreTimbres[instrument].partials;
    const sine = Float32Array.from([0, ...partials]);
    bank.set(instrument, context.createPeriodicWave(new Float32Array(sine.length), sine));
  }
  return bank.get(instrument);
}

function scorePitch(piece, degree, octaveOffset) {
  const scale = scoreScales[piece.mode];
  const octave = Math.floor(degree / 7);
  const interval = scale[degree - octave * 7];
  const midi = piece.key + 12 * (octave + octaveOffset) + interval;
  return 440 * 2 ** ((midi - 69) / 12);
}

let playingScore = null;
let fadingScore = null;
function playScoreNote(part, time, length, degree, octave, instrument, accent) {
  const {context, piece} = part;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  const color = scoreTimbres[instrument];
  const peak = color.gain * accent;
  const attack = Math.min(length * .25, color.attack);
  const end = time + length;
  oscillator.setPeriodicWave(scoreWave(context, instrument));
  oscillator.frequency.value = scorePitch(piece, degree, octave);
  envelope.gain.setValueAtTime(.00001, time);
  envelope.gain.exponentialRampToValueAtTime(peak, time + attack);
  if (instrument === 'lute' || instrument === 'glass') {
    envelope.gain.exponentialRampToValueAtTime(peak * .22, time + length * .6);
  } else {
    envelope.gain.linearRampToValueAtTime(peak * .81, time + length * .68);
  }
  envelope.gain.exponentialRampToValueAtTime(.00001, end);
  oscillator.connect(envelope).connect(part.fader);
  part.voices.add(oscillator);
  oscillator.onended = () => {
    oscillator.disconnect();
    envelope.disconnect();
    part.voices.delete(oscillator);
    if (part.retired && !part.voices.size) {
      part.fader.disconnect();
      if (fadingScore === part) fadingScore = null;
    }
  };
  oscillator.start(time);
  oscillator.stop(end);
}

function scheduleScorePulse(part) {
  const piece = part.piece;
  const picking = scorePicking[piece.pick];
  const bar = Math.floor(part.pulse / picking.length);
  const pulseInBar = part.pulse % picking.length;
  const chord = piece.chords[bar % piece.chords.length];
  const eighth = 30 / piece.bpm;
  const when = part.nextTime;
  if (pulseInBar === 0) {
    playScoreNote(part, when, eighth * picking.length * .78, chord, -2, 'bass', .86);
  }
  const string = picking[pulseInBar];
  if (string !== null) {
    playScoreNote(part, when + .012, eighth * 1.65, chord + string, -1, 'lute', pulseInBar === 0 ? .78 : .58);
  }
  const phrase = scorePhrases[piece.line][bar % 4];
  for (const [onset, degree, duration] of phrase) {
    if (pulseInBar === onset) {
      playScoreNote(part, when + .016, eighth * duration, chord + degree, 0, piece.lead, .94);
    }
  }
  part.nextTime += eighth;
  part.pulse++;
}

function retireScore(part, fade) {
  if (!part) return;
  const now = part.context.currentTime;
  if (part.retired && part.releaseEnd <= now + fade) return;
  let current = Math.max(.00001, Math.min(1, (now - part.started) / .42));
  if (part.retired) {
    const remaining = Math.max(0, part.releaseEnd - now);
    current = part.releaseGain * remaining / (part.releaseEnd - part.releaseStart);
  }
  part.retired = true;
  part.releaseStart = now;
  part.releaseEnd = now + fade;
  part.releaseGain = current;
  const gain = part.fader.gain;
  gain.cancelScheduledValues(now);
  gain.setValueAtTime(current, now);
  gain.linearRampToValueAtTime(0, now + fade);
  for (const oscillator of part.voices) oscillator.stop(now + fade + .01);
  if (!part.voices.size) part.fader.disconnect();
}

// Called by the game loop. Only the near future is queued on the audio clock.
// A long frame never causes skipped, overdue notes to be emitted in a burst.
function updateScore(context, musicBus, cueId) {
  const piece = scorePieces[cueId];
  if (!context || context.state !== 'running' || !musicBus || !piece) {
    stopScore();
    return;
  }
  const now = context.currentTime;
  if (!playingScore || playingScore.cue !== cueId || playingScore.context !== context || playingScore.bus !== musicBus) {
    retireScore(fadingScore, .015);
    fadingScore = playingScore;
    retireScore(fadingScore, .48);
    const fader = context.createGain();
    fader.gain.setValueAtTime(.00001, now);
    fader.gain.linearRampToValueAtTime(1, now + .42);
    fader.connect(musicBus);
    playingScore = {cue:cueId, piece, context, bus:musicBus, fader, started:now,
      nextTime:now + .025, pulse:0, voices:new Set(), retired:false};
  }
  if (playingScore.nextTime < now) playingScore.nextTime = now + .012;
  while (playingScore.nextTime < now + .18) scheduleScorePulse(playingScore);
}

function stopScore() {
  retireScore(fadingScore, .032);
  fadingScore = null;
  retireScore(playingScore, .032);
  playingScore = null;
}
