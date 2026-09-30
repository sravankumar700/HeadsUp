import { Language } from './types';

export interface UIStrings {
  appName: string;
  tagline: string;
  instructionForehead: string;
  playNow: string;
  quickPlay: string;
  categories: string;
  teams: string;
  customDecks: string;
  stats: string;
  settings: string;
  dailyChallenge: string;
  todaysChallenge: string;
  ready: string;
  startRound: string;
  correct: string;
  pass: string;
  timeRemaining: string;
  roundComplete: string;
  playAgain: string;
  nextTeam: string;
  changeCategory: string;
  home: string;
  teamTurn: string;
  tiltDownHint: string;
  tiltUpHint: string;
  tapModeHint: string;
  tapLowerCorrect: string;
  tapUpperPass: string;
  enableSensors: string;
  sensorsActive: string;
  sensorsUnavailable: string;
  language: string;
  timerDuration: string;
  difficulty: string;
  familySafe: string;
  motionSensitivity: string;
  soundEffects: string;
  hapticFeedback: string;
  gameTone: string;
  score: string;
  bestStreak: string;
  accuracy: string;
  fastestGuess: string;
  totalGames: string;
  totalCorrect: string;
  totalPasses: string;
  calibrationTitle: string;
  calibrateSensors: string;
  landscapeTip: string;
  playAnywayPortrait: string;
  close: string;
  save: string;
  createDeck: string;
  deckTitlePlaceholder: string;
  addCard: string;
  cardNamePlaceholder: string;
  noCardsYet: string;
  funMicrocopyCorrect: string[];
  funMicrocopyPass: string[];
  funMicrocopyTimeUp: string;
  funMicrocopyStreak: string;
}

export const translations: Record<Language, UIStrings> = {
  en: {
    appName: "Mana Heads Up",
    tagline: "The Ultimate Tollywood & Indian Cinema Party Game",
    instructionForehead: "Place phone on forehead. Friends act & give clues. Tilt DOWN for Correct, Tilt UP to Pass!",
    playNow: "PLAY NOW",
    quickPlay: "⚡ Quick Play",
    categories: "Categories",
    teams: "Teams",
    customDecks: "Custom Decks",
    stats: "Statistics",
    settings: "Settings",
    dailyChallenge: "Daily Challenge",
    todaysChallenge: "Today's Cinema Challenge",
    ready: "Ready?",
    startRound: "Start Game",
    correct: "GOT IT",
    pass: "PASS",
    timeRemaining: "Time Left",
    roundComplete: "Round Finished!",
    playAgain: "PLAY AGAIN",
    nextTeam: "NEXT TEAM",
    changeCategory: "CHANGE CATEGORY",
    home: "HOME",
    teamTurn: "Your Turn",
    tiltDownHint: "Tilt DOWN to mark Correct",
    tiltUpHint: "Tilt UP to Pass card",
    tapModeHint: "Tap bottom half = Correct • Tap top half = Pass",
    tapLowerCorrect: "⬇ Tap lower half = Correct",
    tapUpperPass: "⬆ Tap upper half = Pass",
    enableSensors: "Enable Motion Sensors",
    sensorsActive: "Motion Sensors Active",
    sensorsUnavailable: "Motion sensors unavailable — Tap Mode active",
    language: "Language",
    timerDuration: "Round Timer",
    difficulty: "Difficulty",
    familySafe: "Family Safe Mode",
    motionSensitivity: "Motion Sensitivity",
    soundEffects: "Sound Effects",
    hapticFeedback: "Vibration / Haptic",
    gameTone: "Microcopy Tone",
    score: "Score",
    bestStreak: "Best Streak",
    accuracy: "Accuracy",
    fastestGuess: "Fastest Guess",
    totalGames: "Total Games Played",
    totalCorrect: "Total Correct Guesses",
    totalPasses: "Total Passes",
    calibrationTitle: "Motion Sensor Calibration",
    calibrateSensors: "Calibrate Tilt Angle",
    landscapeTip: "Please rotate your phone to Landscape for the best forehead guessing experience!",
    playAnywayPortrait: "Play in Portrait anyway",
    close: "Close",
    save: "Save",
    createDeck: "Create Custom Deck",
    deckTitlePlaceholder: "e.g., College Gang, Family Legends...",
    addCard: "+ Add Card",
    cardNamePlaceholder: "Movie, Friend name, or Character...",
    noCardsYet: "No custom decks created yet. Make one for your friends!",
    funMicrocopyCorrect: ["Mass ra! 🔥", "Abbaa! Super! 🔥", "Whistle podu! 🎺", "Cinema peaks! 🎬", "Dookudu! ⚡"],
    funMicrocopyPass: ["Parledu, next!", "Lite theesko!", "Next card!", "Kaani ra kaani!"],
    funMicrocopyTimeUp: "Ayipoyindi ra! 😂",
    funMicrocopyStreak: "Cinema knowledge peaks! 🎬🔥"
  },
  te: {
    appName: "మన హెడ్స్ అప్",
    tagline: "అసలైన టాలీవుడ్ & ఇండియన్ సినిమా గెస్సింగ్ గేమ్",
    instructionForehead: "ఫోన్ నుదుటిపై పెట్టుకోండి. ఫ్రెండ్స్ సైగలు చేసి క్లూస్ ఇస్తారు. కరెక్ట్ అయితే కిందికి, పాస్ అయితే పైకి టిల్ట్ చేయండి!",
    playNow: "ఆట మొదలు పెట్టు",
    quickPlay: "⚡ క్విక్ ప్లే",
    categories: "కేటగిరీలు",
    teams: "టీమ్స్",
    customDecks: "కస్టమ్ డెక్స్",
    stats: "గణాంకాలు",
    settings: "సెట్టింగ్స్",
    dailyChallenge: "డైలీ ఛాలెంజ్",
    todaysChallenge: "నేటి సినిమా ఛాలెంజ్",
    ready: "రెడీనా?",
    startRound: "ఆట ప్రారంభించు",
    correct: "కరెక్ట్",
    pass: "పాస్",
    timeRemaining: "మిగిలిన సమయం",
    roundComplete: "రౌండ్ పూర్తయింది!",
    playAgain: "మళ్ళీ ఆడు",
    nextTeam: "తర్వాతి టీమ్",
    changeCategory: "కేటగిరీ మార్చు",
    home: "హోమ్",
    teamTurn: "మీ వంతు",
    tiltDownHint: "కరెక్ట్ కోసం ఫోన్ కిందికి వంచండి",
    tiltUpHint: "పాస్ కోసం ఫోన్ పైకి వంచండి",
    tapModeHint: "కింది భాగం నొక్కితే కరెక్ట్ • పై భాగం నొక్కితే పాస్",
    tapLowerCorrect: "⬇ కింది భాగం నొక్కితే కరెక్ట్",
    tapUpperPass: "⬆ పై భాగం నొక్కితే పాస్",
    enableSensors: "మోషన్ సెన్సార్లు ఆన్ చేయండి",
    sensorsActive: "మోషన్ సెన్సార్లు పనిచేస్తున్నాయి",
    sensorsUnavailable: "సెన్సార్లు లేవు — ట్యాప్ మోడ్ ఆన్ చేయబడింది",
    language: "భాష",
    timerDuration: "సమయం (సెకన్లు)",
    difficulty: "కఠినత స్థాయి",
    familySafe: "ఫ్యామిలీ సేఫ్ మోడ్",
    motionSensitivity: "మోషన్ సెన్సిటివిటీ",
    soundEffects: "సౌండ్ ఎఫెక్ట్స్",
    hapticFeedback: "వైబ్రేషన్ / హాప్టిక్స్",
    gameTone: "డైలాగ్ శైలి",
    score: "స్కోర్",
    bestStreak: "అత్యుత్తమ స్ట్రీక్",
    accuracy: "ఖచ్చితత్వం",
    fastestGuess: "వేగవంతమైన సమాధానం",
    totalGames: "మొత్తం ఆడిన ఆటలు",
    totalCorrect: "కరెక్ట్ సమాధానాలు",
    totalPasses: "పాస్ అయినవి",
    calibrationTitle: "మోషన్ సెన్సార్ కాలిబ్రేషన్",
    calibrateSensors: "సెన్సార్ సరిచూడండి",
    landscapeTip: "నుదుటిపై సౌకర్యంగా పెట్టుకోవడానికి ఫోన్ అడ్డంగా (Landscape) తిప్పండి!",
    playAnywayPortrait: "నిలువుగానే ఆడండి",
    close: "మూసివేయి",
    save: "సేవ్ చేయి",
    createDeck: "కొత్త డెక్ తయారు చేయి",
    deckTitlePlaceholder: "ఉదా: కాలేజ్ గ్యాంగ్, ఫ్యామిలీ పేర్లు...",
    addCard: "+ కార్డ్ జోడించు",
    cardNamePlaceholder: "సినిమా, ఫ్రెండ్ పేరు, క్యారెక్టర్...",
    noCardsYet: "ఇంకా కస్టమ్ డెక్స్ లేవు. మీ స్నేహితుల కోసం సృష్టించండి!",
    funMicrocopyCorrect: ["మాస్ రా! 🔥", "అబ్బా! సూపర్! 🔥", "ఈలలు వేయండి! 🎺", "సినిమా పీక్స్! 🎬", "దూకుడు! ⚡"],
    funMicrocopyPass: ["పర్లేదు, నెక్స్ట్!", "లైట్ తీస్కో!", "తర్వాతి కార్డ్!", "కానీ రా కానీ!"],
    funMicrocopyTimeUp: "అయిపోయింది రా! 😂",
    funMicrocopyStreak: "సినిమా నాలెడ్జ్ పీక్స్! 🎬🔥"
  },
  tanglish: {
    appName: "Mana Heads Up",
    tagline: "Phone Forehead Pai Pettu. Friends Thoti Guess Cheyyi!",
    instructionForehead: "Phone forehead pai pettu. Friends clues istharu. Correct aithe kindhiki tilt cheyyi, Pass aithe paik tilt cheyyi!",
    playNow: "AATA MODALU PETTU",
    quickPlay: "⚡ Quick Play",
    categories: "Categories",
    teams: "Teams",
    customDecks: "Custom Decks",
    stats: "Stats & Scores",
    settings: "Settings",
    dailyChallenge: "Daily Challenge",
    todaysChallenge: "Today's Cinema Challenge",
    ready: "Ready Na?",
    startRound: "Start Game",
    correct: "CORRECT (Got It)",
    pass: "PASS (Skip)",
    timeRemaining: "Time Left",
    roundComplete: "Round Ayipoyindi!",
    playAgain: "MALLI AADU",
    nextTeam: "NEXT TEAM",
    changeCategory: "CHANGE DECK",
    home: "HOME KI VELLU",
    teamTurn: "Mee Vanthu",
    tiltDownHint: "Tilt DOWN = Correct (Got It)",
    tiltUpHint: "Tilt UP = Pass (Skip)",
    tapModeHint: "Tap bottom = Correct • Tap top = Pass",
    tapLowerCorrect: "⬇ Kindha tap chesthe Correct",
    tapUpperPass: "⬆ Paina tap chesthe Pass",
    enableSensors: "Enable Tilt Motion",
    sensorsActive: "Tilt Sensors On",
    sensorsUnavailable: "Tilt sensors unavailable — Tap Mode on",
    language: "Language",
    timerDuration: "Round Timer",
    difficulty: "Difficulty",
    familySafe: "Family Safe Only",
    motionSensitivity: "Tilt Sensitivity",
    soundEffects: "Game Sounds",
    hapticFeedback: "Vibration / Haptic",
    gameTone: "Dialogue Tone",
    score: "Score",
    bestStreak: "Best Streak",
    accuracy: "Accuracy",
    fastestGuess: "Fastest Guess",
    totalGames: "Total Games",
    totalCorrect: "Total Correct",
    totalPasses: "Total Passes",
    calibrationTitle: "Sensor Calibration",
    calibrateSensors: "Calibrate Tilt Angle",
    landscapeTip: "Phone ni Landscape (Addamga) thippithe forehead pai super ga untundhi!",
    playAnywayPortrait: "Portrait lone aadu",
    close: "Close",
    save: "Save",
    createDeck: "Create Custom Deck",
    deckTitlePlaceholder: "e.g., B.Tech Batch, Adda Friends...",
    addCard: "+ Add Card",
    cardNamePlaceholder: "Movie name, Dialogue, or Character...",
    noCardsYet: "Inka custom decks levu. Mee friends kosam create cheskondi!",
    funMicrocopyCorrect: ["Mass ra! 🔥", "Abbaa! Super! 🔥", "Whistle podu! 🎺", "Cinema peaks! 🎬", "Dookudu! ⚡"],
    funMicrocopyPass: ["Parledu, next!", "Lite theesko!", "Next card!", "Kaani ra kaani!"],
    funMicrocopyTimeUp: "Ayipoyindi ra! 😂",
    funMicrocopyStreak: "Cinema knowledge peaks! 🎬🔥"
  }
};
