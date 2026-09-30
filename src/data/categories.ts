import { CategoryInfo, GameCard, GameSettings } from './types';
import { csvMovies } from './moviesData';
import { teluguMovies } from './movies';
import { teluguActors } from './actors';
import { teluguActresses } from './actresses';
import { indianCelebrities } from './celebrities';
import { teluguCharacters } from './characters';
import { teluguDialogues } from './dialogues';
import { teluguSongs } from './songs';
import { teluguMemes } from './memes';

export interface CategoryGroup {
  id: string;
  name: string;
  teluguName: string;
  categories: CategoryInfo[];
}

// Build a fast lookup map for curated movies with director, cast, and characters
const curatedMovieMap = new Map<string, typeof teluguMovies[0]>();
teluguMovies.forEach((m) => {
  const normTitle = m.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  curatedMovieMap.set(normTitle, m);
  if (m.alternateTitle) {
    curatedMovieMap.set(m.alternateTitle.toLowerCase().replace(/[^a-z0-9]/g, ''), m);
  }
});

// Map of curated modern blockbusters (2020-2026) plot storylines for explainer clues
const modernPlotSummaries: Record<string, string> = {
  rrr: "Two legendary revolutionaries Alluri Sitarama Raju & Komaram Bheem forge an epic bond in 1920s British-occupied Delhi to fight the Empire! Oscar-winning Naatu Naatu dance step.",
  kalki2898ad: "In post-apocalyptic Kasi in 2898 AD, the immortal warrior Ashwatthama rises to protect pregnant refugee SUM-80 from Supreme Yaskin's Complex.",
  pushpathrise: "A daring daily-wage laborer rises through the red sandalwood smuggling syndicate in Seshachalam forests! 'Thaggede Le!'",
  pushpa2therule: "Pushpa Raj expands his international red sandalwood empire while fighting against relentless SP Bhanwar Singh Shekhawat.",
  hanuman: "In the mythical village of Anjanadri, petty thief Hanumanthu discovers a celestial solar gem blessed with Lord Hanuman's superpowers to fight evil.",
  salaar: "A ferocious warrior Deva returns to the dystopian fortress-city Khansaar to help his exile childhood friend Varadha claim the throne.",
  devarapart1: "A legendary fearless coastal chief protects his ancestral sea waters against international weapon smuggling cartels.",
  tillusquare: "Wannabe DJ Tillu gets seduced by mysterious Lilly and caught in a high-stakes undercover STF murder investigation! 'Attitude star Tillu'",
  djtillu: "A self-proclaimed DJ gets entangled with an aspiring singer Radhika and an accidental murder mystery in Hyderabad.",
  gunturkaaram: "A fiery son from Guntur is pressured by his powerful politician grandfather and estranged mother to sign away family rights.",
  waltairveerayya: "A notorious Vizag smuggler is hired by police to go to Malaysia and capture an international drug lord who killed naval officers.",
  veerasimhareddy: "A loving son in Istanbul discovers that his father is a revered faction leader in Rayalaseema defending poor villagers.",
  dasara: "In the coal-mining town of Veerlapally, Dharani fights against liquor cartels, caste oppression, and a depraved local villain.",
  hinanna: "A devoted single father invents comforting bedtime fairy tales for his sick daughter about her missing mother until a mysterious woman enters.",
  sitaramam: "An orphaned soldier Lieutenant Ram stationed in Kashmir receives romantic letters from an unknown girl calling herself Sita Mahalakshmi.",
  karthikeya2: "Dr. Karthikeya travels across Dwarka, Mathura, and the Himalayas solving mythological clues to find the lost sacred anklet of Lord Krishna.",
  major: "The real heroic story of Major Sandeep Unnikrishnan who led NSG commandos and saved hostages during 26/11 Mumbai Taj terror attacks.",
  bimbisara: "A tyrannical ancient Trigartala emperor is banished into modern Hyderabad through a cursed magic mirror.",
  gamechanger: "A righteous IAS officer takes down corrupt political mafias and dynastic politicians to enforce transparent governance.",
  og: "A legendary underworld boss Ojas Gambheera returns to Mumbai's criminal world for a blood-soaked retribution.",
  daakumaharaaj: "A mythical bandit leader defends his tribal province against tyrannical British conquerors and treacherous feudal kings.",
  sankranthikivasthunnam: "A sharp ex-cop steps back into action to defend his loved ones from an international criminal syndicate during festive season."
};

// Convert CSV Movie to GameCard with rich explainer clues directly from dataset
function csvToCard(movie: typeof csvMovies[0]): GameCard {
  const normKey = movie.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const curated = curatedMovieMap.get(normKey);

  // 1. Primary Explainer Plot Clue from CSV
  let plotClue = movie.overview ? movie.overview.trim() : '';
  if (plotClue.startsWith('"') && plotClue.endsWith('"')) {
    plotClue = plotClue.slice(1, -1).trim();
  }
  if (!plotClue && curated) {
    plotClue = modernPlotSummaries[normKey] || 
      (curated.famousDialogues?.length 
        ? `Iconic dialogue: "${curated.famousDialogues[0]}"` 
        : `${curated.genre.join(', ')} movie starring ${curated.leadActors.join(', ')}`);
  }

  // 2. Info / Context line (Year, Genre, Director, Cast, Rating)
  const yearNum = movie.releaseYear || curated?.releaseYear || null;
  const yearStr = yearNum ? String(yearNum) : '';
  const genreStr = movie.genres?.length ? movie.genres.slice(0, 2).join(', ') : (curated?.genre?.slice(0, 2).join(', ') || '');
  const dirStr = curated?.director ? `Dir: ${curated.director}` : '';
  const castList = [...(curated?.leadActors || []), ...(curated?.leadActresses || [])];
  const castStr = castList.length ? `Cast: ${castList.slice(0, 2).join(', ')}` : '';
  const ratingStr = movie.rating ? `⭐${movie.rating}` : '';

  const infoParts = [yearStr, genreStr, dirStr, castStr, ratingStr].filter(Boolean);
  const info = infoParts.join(' • ');

  // 3. Dialogue or Punchline
  const dialogue = curated?.famousDialogues?.[0] || '';

  // 4. Combined subtext for legacy and easy display
  const subtextParts: string[] = [];
  if (plotClue) subtextParts.push(plotClue);
  if (info) subtextParts.push(`(${info})`);
  if (dialogue) subtextParts.push(`"${dialogue}"`);
  const subtext = subtextParts.join(' • ');

  // 5. Telugu support
  const teluguTitle = curated?.teluguTitle || movie.title;
  const teluguSubtext = curated?.director
    ? `${curated.releaseYear || ''} • దర్శకత్వం: ${curated.director} • ${plotClue}`
    : subtext;

  const yearTags = yearNum ? [`year_${yearNum}`, String(yearNum)] : [];

  return {
    id: movie.id,
    type: 'movie',
    answer: movie.title,
    telugu: teluguTitle,
    clue: plotClue,
    info,
    dialogue,
    subtext,
    teluguSubtext,
    category: 'movies',
    tags: [...movie.genres.map(g => g.toLowerCase()), ...(curated?.tags || []), ...yearTags],
    difficulty: movie.rating && movie.rating >= 7.5 ? 'easy' : 'medium',
    isFamilySafe: movie.certificate !== 'A'
  };
}

// Convert curated movies not present in CSV (e.g. modern 2021-2026 releases) to GameCard
function curatedToCard(curated: typeof teluguMovies[0]): GameCard {
  const normKey = curated.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const plotClue = modernPlotSummaries[normKey] || 
    (curated.famousDialogues?.length 
      ? `Iconic dialogue: "${curated.famousDialogues[0]}"` 
      : `${curated.genre.join(', ')} blockbuster starring ${curated.leadActors.join(', ')}`);

  const yearStr = curated.releaseYear ? String(curated.releaseYear) : '';
  const genreStr = curated.genre?.slice(0, 2).join(', ') || '';
  const dirStr = curated.director ? `Dir: ${curated.director}` : '';
  const castList = [...(curated.leadActors || []), ...(curated.leadActresses || [])];
  const castStr = castList.length ? `Cast: ${castList.slice(0, 2).join(', ')}` : '';

  const infoParts = [yearStr, genreStr, dirStr, castStr].filter(Boolean);
  const info = infoParts.join(' • ');
  const dialogue = curated.famousDialogues?.[0] || '';

  const subtextParts: string[] = [];
  if (plotClue) subtextParts.push(plotClue);
  if (info) subtextParts.push(`(${info})`);
  if (dialogue) subtextParts.push(`"${dialogue}"`);
  const subtext = subtextParts.join(' • ');

  const teluguSubtext = `${curated.teluguTitle} (${curated.releaseYear}) • దర్శకత్వం: ${curated.director} • ${plotClue}`;
  const yearTags = curated.releaseYear ? [`year_${curated.releaseYear}`, String(curated.releaseYear)] : [];

  return {
    id: curated.id,
    type: 'movie',
    answer: curated.title,
    telugu: curated.teluguTitle,
    clue: plotClue,
    info,
    dialogue,
    subtext,
    teluguSubtext,
    category: 'movies',
    tags: [...(curated.tags || []), ...yearTags],
    difficulty: curated.difficulty || 'medium',
    isFamilySafe: curated.isFamilySafe !== false
  };
}

// Set of normalized keys already in CSV
const csvMovieKeys = new Set(csvMovies.map(m => m.title.toLowerCase().replace(/[^a-z0-9]/g, '')));

// Curated movies not present in CSV (e.g. 2021-2026 modern blockbusters)
const curatedOnlyMovieCards: GameCard[] = teluguMovies
  .filter(m => !csvMovieKeys.has(m.title.toLowerCase().replace(/[^a-z0-9]/g, '')))
  .map(curatedToCard);

// All movies combined: 378 CSV dataset movies + modern 2021-2026 curated movies
export const allMovieCards: GameCard[] = [...csvMovies.map(csvToCard), ...curatedOnlyMovieCards];

// Helper to ensure any card has a non-empty clue for the explainer
function ensureCardClue(card: GameCard): GameCard {
  return {
    ...card,
    clue: card.clue || card.subtext || card.teluguSubtext || card.answer,
    info: card.info || (card.tags?.length ? card.tags.join(' • ') : '')
  };
}

// Primary 12 categories for quick discoverability
export const primaryCategories: CategoryInfo[] = [
  {
    id: "quick_mix",
    name: "Mixed Masala",
    teluguName: "మిక్స్‌డ్ మసాలా",
    description: "The ultimate Tollywood party mix: Blockbusters, Heroes, Songs & Punchlines!",
    teluguDescription: "సినిమాలు, హీరోలు, పాటలు, డైలాగుల సూపర్ మిశ్రమం!",
    icon: "Sparkles",
    emoji: "🎲",
    color: "from-amber-500 to-red-600",
    badge: "Most Popular",
    isPopular: true
  },
  {
    id: "all_movies",
    name: "Telugu Movies",
    teluguName: "తెలుగు సినిమాలు",
    description: "1,400+ Telugu films spanning all eras and blockbusters!",
    teluguDescription: "వేల కొద్దీ తెలుగు సినిమాలు!",
    icon: "Film",
    emoji: "🎬",
    color: "from-red-600 to-amber-600",
    badge: "1,400+ Movies",
    isPopular: true
  },
  {
    id: "actors",
    name: "Actors / Heroes",
    teluguName: "హీరోలు",
    description: "Prabhas, Mahesh, NTR, Bunny, Charan, Pawan, Chiru, Balayya, Nani...",
    teluguDescription: "ప్రభాస్, మహేష్, ఎన్టీఆర్, బన్నీ, చరణ్, పవన్, చిరు, బాలయ్య, నాని...",
    icon: "User",
    emoji: "⭐",
    color: "from-emerald-600 to-teal-700",
    isPopular: true
  },
  {
    id: "actresses",
    name: "Actresses / Heroines",
    teluguName: "హీరోయిన్లు",
    description: "Samantha, Anushka, Sai Pallavi, Rashmika, Keerthy, Sreeleela, Mrunal...",
    teluguDescription: "సమంత, అనుష్క, సాయి పల్లవి, రష్మిక, కీర్తి, శ్రీలీల, మృణాల్...",
    icon: "Heart",
    emoji: "👩",
    color: "from-pink-500 to-rose-600",
    isPopular: true
  },
  {
    id: "characters",
    name: "Famous Characters",
    teluguName: "క్యారెక్టర్ చెప్పు",
    description: "Kattappa, DJ Tillu, Pushpa Raj, Bhallaladeva, Kill Bill Pandey, Agent Athreya...",
    teluguDescription: "కట్టప్ప, డీజే టిల్లు, పుష్ప రాజ్, కిల్ బిల్ పాండే, ఏజెంట్ ఆత్రేయ...",
    icon: "Mask",
    emoji: "🎭",
    color: "from-indigo-600 to-violet-700",
    isPopular: true
  },
  {
    id: "songs",
    name: "Hit Songs",
    teluguName: "పాటలు",
    description: "Naatu Naatu, Kurchi Madathapetti, Oo Antava, Samajavaragamana, Butta Bomma...",
    teluguDescription: "నాటు నాటు, కుర్చీ మడతపెట్టి, ఊ అంటావా, సామజవరగమన, బుట్టబొమ్మ...",
    icon: "Music",
    emoji: "🎵",
    color: "from-teal-500 to-emerald-600",
    isPopular: true
  },
  {
    id: "dialogues",
    name: "Famous Dialogues",
    teluguName: "పంచ్ డైలాగులు",
    description: "Thaggede Le, Evadu Kodithe Dhimma Thirigi, Athla Untadhi Manathoni...",
    teluguDescription: "తగ్గేదే లే, ఎవడు కొడితే దిమ్మ తిరిగి, అట్ల ఉంటది మనతోని...",
    icon: "MessageSquare",
    emoji: "💬",
    color: "from-amber-600 to-yellow-500",
    badge: "Party Hit",
    isPopular: true
  },
  {
    id: "memes",
    name: "Telugu Memes",
    teluguName: "మీమ్స్ & ట్రెండ్స్",
    description: "Ante adi Ram Babu, Endi ra idhi, Cheppanu Brother, Jai Balayya...",
    teluguDescription: "అంటే అది రామ్ బాబు, ఏంది రా ఇది, చెప్పను బ్రదర్, జై బాలయ్య...",
    icon: "Laugh",
    emoji: "😂",
    color: "from-yellow-500 to-amber-600",
    isPopular: true
  },
  {
    id: "celebrities",
    name: "Indian Celebrities",
    teluguName: "సెలబ్రిటీలు",
    description: "Rajamouli, SRK, Salman, Amitabh, Deepika, Alia, Vijay, Suriya...",
    teluguDescription: "దర్శకులు, బాలీవుడ్ స్టార్స్, కోలీవుడ్ తారలు...",
    icon: "Star",
    emoji: "🇮🇳",
    color: "from-orange-500 to-red-600",
    isPopular: true
  },
  {
    id: "cricket",
    name: "Cricket Stars",
    teluguName: "క్రికెట్ స్టార్స్",
    description: "Virat Kohli, MS Dhoni, Rohit Sharma, Sachin, Bumrah, Hardik...",
    teluguDescription: "కోహ్లీ, ధోని, రోహిత్, సచిన్, బుమ్రా...",
    icon: "Activity",
    emoji: "🏏",
    color: "from-blue-600 to-indigo-700",
    isPopular: true
  },
  {
    id: "pan_india",
    name: "Pan-India Blockbusters",
    teluguName: "పాన్-ఇండియా",
    description: "Baahubali, RRR, Pushpa, Kalki 2898 AD, Salaar, KGF, Kantara...",
    teluguDescription: "బాహుబలి, ఆర్ఆర్ఆర్, పుష్ప, కల్కి, సలార్, కేజీఎఫ్...",
    icon: "Globe",
    emoji: "🎞️",
    color: "from-purple-600 to-pink-600",
    isPopular: true
  },
  {
    id: "mass_mode",
    name: "Mass Mode",
    teluguName: "మాస్ మోడ్",
    description: "Whistle-worthy mass elevations, fights and high voltage hits!",
    teluguDescription: "ఈలలు వేయించే హై-వోల్టేజ్ మాస్ సినిమాలు, డైలాగులు!",
    icon: "Flame",
    emoji: "🔥",
    color: "from-red-600 to-amber-600",
    isPopular: true
  }
];

// All grouped categories
export const categoryGroups: CategoryGroup[] = [
  {
    id: "group_telugu_cinema",
    name: "Telugu Cinema",
    teluguName: "తెలుగు సినిమాలు",
    categories: [
      {
        id: "all_movies",
        name: "All Telugu Movies",
        teluguName: "అన్ని సినిమాలు",
        description: "1,400+ Telugu films from dataset",
        teluguDescription: "మొత్తం తెలుగు సినిమాలు",
        icon: "Film",
        emoji: "🎬",
        color: "from-red-600 to-amber-600"
      },
      {
        id: "movies_2020_2024",
        name: "Telugu Movies 2020–2024",
        teluguName: "2020–2024 సినిమాలు",
        description: "RRR, Pushpa, Kalki, HanuMan, Tillu, Devara...",
        teluguDescription: "ఆర్ఆర్ఆర్, పుష్ప, కల్కి, దేవర...",
        icon: "Flame",
        emoji: "⚡",
        color: "from-amber-600 to-red-600"
      },
      {
        id: "movies_2025_2026",
        name: "Telugu Movies 2025–2026",
        teluguName: "2025–2026 సినిమాలు",
        description: "Game Changer, OG, Daaku Maharaaj, The Raja Saab, Mirai...",
        teluguDescription: "గేమ్ ఛేంజర్, ఓజీ, డాకూ మహారాజ్...",
        icon: "Sparkles",
        emoji: "🚀",
        color: "from-purple-600 to-indigo-600"
      },
      {
        id: "movies_2015_2019",
        name: "Telugu Movies 2015–2019",
        teluguName: "2015–2019 సినిమాలు",
        description: "Baahubali, Rangasthalam, Arjun Reddy, Jersey, Mahanati...",
        teluguDescription: "బాహుబలి, రంగస్థలం, అర్జున్ రెడ్డి...",
        icon: "Award",
        emoji: "👑",
        color: "from-yellow-600 to-amber-700"
      },
      {
        id: "movies_2010_2014",
        name: "Telugu Movies 2010–2014",
        teluguName: "2010–2014 సినిమాలు",
        description: "Dookudu, Eega, Gabbar Singh, Race Gurram, Mirchi, AD...",
        teluguDescription: "దూకుడు, ఈగ, గబ్బర్ సింగ్...",
        icon: "History",
        emoji: "📽️",
        color: "from-blue-600 to-cyan-700"
      },
      {
        id: "highest_rated",
        name: "Highest Rated Movies",
        teluguName: "హైయెస్ట్ రేటెడ్ సినిమాలు",
        description: "Top IMDb rated Telugu classics and blockbusters",
        teluguDescription: "టాప్ రేటింగ్ పొందిన సినిమాలు",
        icon: "Star",
        emoji: "🌟",
        color: "from-amber-500 to-yellow-600"
      },
      {
        id: "most_rated",
        name: "Most Popular & Rated",
        teluguName: "మోస్ట్ పాపులర్ సినిమాలు",
        description: "Movies with highest audience engagement",
        teluguDescription: "అత్యధిక మంది వీక్షించిన సినిమాలు",
        icon: "TrendingUp",
        emoji: "💥",
        color: "from-red-500 to-rose-600"
      },
      {
        id: "comedy_movies",
        name: "Telugu Comedy Movies",
        teluguName: "కామెడీ సినిమాలు",
        description: "Jathi Ratnalu, DJ Tillu, F2, Maryada Ramanna, Dookudu...",
        teluguDescription: "నవ్వుల విందు అందించే సినిమాలు",
        icon: "Smile",
        emoji: "😂",
        color: "from-amber-400 to-orange-500"
      },
      {
        id: "action_movies",
        name: "Telugu Action Movies",
        teluguName: "యాక్షన్ సినిమాలు",
        description: "High-octane fights, stunts and thrillers",
        teluguDescription: "హై-వోల్టేజ్ యాక్షన్ సినిమాలు",
        icon: "ShieldAlert",
        emoji: "🥊",
        color: "from-orange-600 to-red-700"
      },
      {
        id: "romance_movies",
        name: "Telugu Romance Movies",
        teluguName: "రొమాంటిక్ లవ్ స్టోరీస్",
        description: "Geetha Govindam, Fidaa, Sita Ramam, Ye Maaya Chesave...",
        teluguDescription: "ప్రేమకథా చిత్రాలు",
        icon: "Heart",
        emoji: "💖",
        color: "from-pink-500 to-rose-600"
      },
      {
        id: "classic_movies",
        name: "Telugu Classics",
        teluguName: "క్లాసిక్ సినిమాలు",
        description: "Mayabazar, Shiva, Jagadeka Veerudu, Pokiri, Magadheera...",
        teluguDescription: "ఎప్పటికీ నిలిచిపోయే క్లాసిక్స్",
        icon: "BookOpen",
        emoji: "🏛️",
        color: "from-stone-600 to-neutral-800"
      }
    ]
  },
  {
    id: "group_people",
    name: "People & Stars",
    teluguName: "తారలు & సెలబ్రిటీలు",
    categories: [
      {
        id: "actors",
        name: "Telugu Heroes",
        teluguName: "తెలుగు హీరోలు",
        description: "Prabhas, Mahesh, NTR, Bunny, Charan, Pawan, Chiru, Balayya...",
        teluguDescription: "మన ప్రియతమ కథానాయకులు",
        icon: "User",
        emoji: "⭐",
        color: "from-emerald-600 to-teal-700"
      },
      {
        id: "actresses",
        name: "Telugu Heroines",
        teluguName: "తెలుగు హీరోయిన్లు",
        description: "Samantha, Anushka, Sai Pallavi, Rashmika, Keerthy, Sreeleela...",
        teluguDescription: "సినిమా నాయికలు",
        icon: "Heart",
        emoji: "👩",
        color: "from-pink-500 to-rose-600"
      },
      {
        id: "directors",
        name: "Telugu Directors",
        teluguName: "దర్శకులు",
        description: "Rajamouli, Sukumar, Trivikram, Vanga, Nag Ashwin, Koratala...",
        teluguDescription: "దర్శక దిగ్గజాలు",
        icon: "Clapperboard",
        emoji: "🎬",
        color: "from-indigo-600 to-purple-700"
      },
      {
        id: "comedians",
        name: "Telugu Comedians",
        teluguName: "హాస్య నటులు",
        description: "Brahmanandam, Sunil, Ali, MS Narayana, Satya, Priyadarshi...",
        teluguDescription: "హాస్య బ్రహ్మలు",
        icon: "Smile",
        emoji: "🤣",
        color: "from-yellow-500 to-amber-600"
      },
      {
        id: "celebrities",
        name: "Indian Celebrities",
        teluguName: "ఇండియన్ సెలబ్రిటీలు",
        description: "SRK, Salman, Aamir, Hrithik, Deepika, Rajini, Kamal, Vijay...",
        teluguDescription: "భారతీయ సినీ ప్రముఖులు",
        icon: "Star",
        emoji: "🇮🇳",
        color: "from-orange-500 to-red-600"
      },
      {
        id: "cricket",
        name: "Cricket Stars",
        teluguName: "క్రికెట్ స్టార్లు",
        description: "Virat Kohli, MS Dhoni, Rohit Sharma, Sachin, Bumrah...",
        teluguDescription: "క్రికెట్ వీరులు",
        icon: "Activity",
        emoji: "🏏",
        color: "from-blue-600 to-indigo-700"
      }
    ]
  },
  {
    id: "group_special",
    name: "Special Decks",
    teluguName: "స్పెషల్ డెక్స్",
    categories: [
      {
        id: "quick_mix",
        name: "Mixed Masala",
        teluguName: "మిక్స్‌డ్ మసాలా",
        description: "A fun blend of movies, heroes, songs & punch dialogues",
        teluguDescription: "అన్ని రకాల మిశ్రమం",
        icon: "Sparkles",
        emoji: "🎲",
        color: "from-amber-500 to-red-600"
      },
      {
        id: "characters",
        name: "Famous Characters",
        teluguName: "ప్రసిద్ధ పాత్రలు",
        description: "Kattappa, DJ Tillu, Pushpa Raj, Bhallaladeva, Kill Bill Pandey...",
        teluguDescription: "సినిమా క్యారెక్టర్లు",
        icon: "Mask",
        emoji: "🎭",
        color: "from-indigo-600 to-violet-700"
      },
      {
        id: "dialogues",
        name: "Famous Dialogues",
        teluguName: "డైలాగులు",
        description: "Thaggede Le, Evadu Kodithe Dhimma Thirigi, Athla Untadhi...",
        teluguDescription: "పంచ్ డైలాగులు",
        icon: "MessageSquare",
        emoji: "💬",
        color: "from-amber-600 to-yellow-500"
      },
      {
        id: "songs",
        name: "Hit Songs",
        teluguName: "సూపర్‌హిట్ పాటలు",
        description: "Naatu Naatu, Kurchi Madathapetti, Oo Antava, Samajavaragamana...",
        teluguDescription: "పాటల గెస్సింగ్",
        icon: "Music",
        emoji: "🎵",
        color: "from-teal-500 to-emerald-600"
      },
      {
        id: "memes",
        name: "Telugu Memes",
        teluguName: "మీమ్స్",
        description: "Ante adi Ram Babu, Endi ra idhi, Cheppanu Brother...",
        teluguDescription: "వైరల్ మీమ్ డైలాగులు",
        icon: "Laugh",
        emoji: "😂",
        color: "from-yellow-500 to-amber-600"
      },
      {
        id: "mass_mode",
        name: "Mass Mode",
        teluguName: "మాస్ మోడ్",
        description: "High energy mass movies, whistle dialogues & songs",
        teluguDescription: "మాస్ బొమ్మలు",
        icon: "Flame",
        emoji: "🔥",
        color: "from-red-600 to-amber-600"
      },
      {
        id: "pan_india",
        name: "Pan-India Hits",
        teluguName: "పాన్-ఇండియా హిట్స్",
        description: "Baahubali, RRR, Pushpa, Kalki, Salaar, KGF, Kantara...",
        teluguDescription: "పాన్-ఇండియా సంచలనాలు",
        icon: "Globe",
        emoji: "🎞️",
        color: "from-purple-600 to-pink-600"
      }
    ]
  }
];

// Flat list for lookup
export const categoriesList: CategoryInfo[] = [
  ...primaryCategories,
  ...categoryGroups.flatMap(g => g.categories).filter((c, idx, arr) => arr.findIndex(x => x.id === c.id) === idx)
];

// Card generator
export function getCardsForCategory(
  categoryId: string,
  settings: GameSettings,
  customDeckCards?: GameCard[]
): GameCard[] {
  let cards: GameCard[] = [];

  if (categoryId === 'custom' && customDeckCards) {
    cards = customDeckCards.map(ensureCardClue);
  } else if (categoryId === 'quick_mix') {
    cards = [
      ...allMovieCards.slice(0, 50),
      ...teluguActors.map(ensureCardClue).slice(0, 30),
      ...teluguActresses.map(ensureCardClue).slice(0, 20),
      ...teluguSongs.map(ensureCardClue).slice(0, 20),
      ...teluguDialogues.map(ensureCardClue).slice(0, 20),
      ...teluguCharacters.map(ensureCardClue).slice(0, 15)
    ];
  } else if (categoryId === 'all_movies') {
    cards = [...allMovieCards];
  } else if (categoryId === 'movies_2020_2024') {
    cards = allMovieCards.filter((m) => 
      m.tags.some(t => ['2020', '2021', '2022', '2023', '2024', 'year_2020', 'year_2021', 'year_2022', 'year_2023', 'year_2024'].includes(t)) ||
      (m.info && /\b(202[0-4])\b/.test(m.info))
    );
    if (cards.length === 0) cards = allMovieCards.slice(0, 50);
  } else if (categoryId === 'movies_2025_2026') {
    cards = allMovieCards.filter((m) => 
      m.tags.some(t => ['2025', '2026', 'year_2025', 'year_2026'].includes(t)) ||
      (m.info && /\b(202[5-6])\b/.test(m.info))
    );
    if (cards.length === 0) cards = allMovieCards.slice(0, 30);
  } else if (categoryId === 'movies_2015_2019') {
    cards = allMovieCards.filter((m) => 
      m.tags.some(t => ['2015', '2016', '2017', '2018', '2019', 'year_2015', 'year_2016', 'year_2017', 'year_2018', 'year_2019'].includes(t)) ||
      (m.info && /\b(201[5-9])\b/.test(m.info))
    );
  } else if (categoryId === 'movies_2010_2014') {
    cards = allMovieCards.filter((m) => 
      m.tags.some(t => ['2010', '2011', '2012', '2013', '2014', 'year_2010', 'year_2011', 'year_2012', 'year_2013', 'year_2014'].includes(t)) ||
      (m.info && /\b(201[0-4])\b/.test(m.info))
    );
  } else if (categoryId === 'highest_rated') {
    cards = [...allMovieCards]
      .filter((m) => m.difficulty === 'easy' || (m.info && m.info.includes('⭐')))
      .slice(0, 70);
  } else if (categoryId === 'most_rated') {
    cards = [...allMovieCards].slice(0, 70);
  } else if (categoryId === 'comedy_movies') {
    cards = allMovieCards.filter((m) => 
      m.tags.some(g => g.toLowerCase().includes('comedy'))
    );
  } else if (categoryId === 'action_movies') {
    cards = allMovieCards.filter((m) => 
      m.tags.some(g => g.toLowerCase().includes('action'))
    );
  } else if (categoryId === 'romance_movies') {
    cards = allMovieCards.filter((m) => 
      m.tags.some(g => g.toLowerCase().includes('romance') || g.toLowerCase().includes('drama'))
    );
  } else if (categoryId === 'classic_movies') {
    cards = allMovieCards.filter((m) => 
      m.tags.some(t => {
        const yr = parseInt(t.replace('year_', ''), 10);
        return !isNaN(yr) && yr > 1950 && yr < 2010;
      })
    );
    if (cards.length === 0) cards = allMovieCards.slice(0, 40);
  } else if (categoryId === 'actors') {
    cards = teluguActors.map(ensureCardClue);
  } else if (categoryId === 'actresses') {
    cards = teluguActresses.map(ensureCardClue);
  } else if (categoryId === 'directors') {
    cards = indianCelebrities.filter(c => c.tags.includes('director')).map(ensureCardClue);
  } else if (categoryId === 'comedians') {
    cards = teluguActors.filter(c => c.tags.includes('comedy')).map(ensureCardClue);
  } else if (categoryId === 'celebrities') {
    cards = indianCelebrities.map(ensureCardClue);
  } else if (categoryId === 'cricket') {
    cards = indianCelebrities.filter(c => c.tags.includes('cricket')).map(ensureCardClue);
  } else if (categoryId === 'characters') {
    cards = teluguCharacters.map(ensureCardClue);
  } else if (categoryId === 'dialogues') {
    cards = teluguDialogues.map(ensureCardClue);
  } else if (categoryId === 'songs') {
    cards = teluguSongs.map(ensureCardClue);
  } else if (categoryId === 'memes') {
    cards = teluguMemes.map(ensureCardClue);
  } else if (categoryId === 'pan_india') {
    const panIndiaTitles = ['RRR', 'Bahubali: The Beginning', 'Baahubali 2: The Conclusion', 'Kalki 2898 AD', 'Pushpa: The Rise', 'Pushpa 2: The Rule', 'KGF: Chapter 1', 'KGF: Chapter 2', 'Kantara', 'Devara: Part 1', 'Salaar', 'Hanu-Man', 'Eega', 'Saaho'];
    cards = allMovieCards.filter(c => panIndiaTitles.some(p => c.answer.toLowerCase().includes(p.toLowerCase())));
  } else if (categoryId === 'mass_mode') {
    const massMovies = allMovieCards.filter(m => m.tags.some(g => g.toLowerCase().includes('action') || g.toLowerCase().includes('mass'))).slice(0, 45);
    cards = [...massMovies, ...teluguDialogues.map(ensureCardClue), ...teluguSongs.filter(s => s.tags.includes('mass')).map(ensureCardClue)];
  } else {
    cards = [...allMovieCards];
  }

  // Filter for Family Safe mode if enabled
  if (settings.familySafeOnly) {
    cards = cards.filter((c) => c.isFamilySafe !== false);
  }

  // Ensure card clues are present on every card
  cards = cards.map(ensureCardClue);

  // If card pool has few items, duplicate/cycle them so long rounds & marathon sessions never run out
  if (cards.length > 0 && cards.length < 35) {
    const original = [...cards];
    while (cards.length < 50) {
      cards.push(...original);
    }
  }

  // Shuffle array using Fisher-Yates
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
