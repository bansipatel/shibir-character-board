// ============================================================================
// CHARACTER DATA — 58 figures spanning the Ramayana, Mahabharata, Vedic/Puranic
// sages, Vedanta acharyas, Bhakti-movement saints, warrior-rulers, and
// scholars/poets.
//
// IMPORTANT: The `quote` field for each name is a short factual descriptor
// written from general knowledge, not a verbatim scripture quote or
// documented statement. Given how many of these are real historical/
// religious teachers and saints, please review every line for accuracy and
// respectfulness before using this at Shibir.
//
// Display order is computed at runtime in board.js (alphabetical on admin,
// shuffled + repacked on viewer) — this file is just the content, grouped
// by category purely so the reveal card's "epic" tag has something
// meaningful to show.
// ============================================================================

const CATEGORIES = [
  { name: 'Ramayana', chars: [
    ['Bhagwan Ram', 'The seventh avatar of Vishnu; Prince of Ayodhya, revered as maryada purushottama, the ideal man.'],
    ['Sita', 'Daughter of King Janak and Rama\'s wife, an incarnation of Lakshmi celebrated for her devotion and inner strength.'],
    ['Lakshman', 'Rama\'s devoted younger brother, who chose fourteen years of exile at his side.'],
    ['Bharat', 'Rama\'s brother, who ruled Ayodhya as regent and placed Rama\'s sandals on the throne in his stead.'],
    ['Shatrughna', 'The youngest of the four royal brothers, twin of Lakshman and loyal supporter of Bharat.'],
    ['Hanuman', 'Vanara devotee whose boundless devotion to Rama and heroic leap to Lanka made him a symbol of selfless service.'],
    ['Urmila', 'Lakshman\'s wife, remembered for her quiet sacrifice while he accompanied Rama into exile.'],
    ['Shabari', 'A humble devotee who waited a lifetime in the forest for the chance to offer Rama her berries.'],
    ['Jatayu', 'The aged vulture king who gave his life fighting Ravana in an attempt to save Sita.'],
  ]},
  { name: 'Mahabharata', chars: [
    ['Bhagwan Krishna', 'The eighth avatar of Vishnu; Arjun\'s charioteer and guide, whose counsel on the battlefield became the Bhagavad Gita.'],
    ['Draupadi', 'Wife of the five Pandavas, whose humiliation in the Kaurava court became a turning point of the epic.'],
    ['Arjun', 'The third Pandava, a peerless archer and the direct recipient of Krishna\'s teachings.'],
    ['Yudhishthir', 'Eldest Pandava and king, called Dharmaraja for his unwavering commitment to truth.'],
    ['Bhishma', 'The grand patriarch who took a lifelong vow of celibacy and could choose the moment of his own death.'],
    ['Vidur', 'The wise and impartial minister of Hastinapur, remembered for his integrity and counsel.'],
    ['Abhimanyu', 'Arjun\'s son, who bravely broke into the Chakravyuha formation but could not find his way out.'],
    ['Ekalavya', 'A self-taught archer who famously gave his thumb as guru-dakshina to Dronacharya.'],
  ]},
  { name: 'Sages & Devotees', chars: [
    ['Maharishi Vashisht', 'The royal sage and guru of the Raghu dynasty, including Rama.'],
    ['Maharishi Ved Vyas', 'The sage credited with compiling the Mahabharata and organizing the Vedas.'],
    ['Prahlad', 'A young devotee of Vishnu whose unshakeable faith survived every trial his father put him through.'],
    ['Dhruv', 'A child whose determined penance to Vishnu earned him a place as the eternal pole star.'],
    ['Nachiketa', 'A boy from the Katha Upanishad whose questions to Yama, the god of death, revealed the nature of the eternal Self.'],
    ['Raja Janak', 'The philosopher-king of Mithila and Sita\'s father, revered for ruling while remaining spiritually detached.'],
    ['Savitri', 'A devoted wife whose wit and resolve won her husband Satyavan\'s life back from Yama.'],
    ['Gargi', 'A Vedic philosopher renowned for boldly questioning the sage Yajnavalkya in the court of King Janak.'],
    ['Maitreyi', 'A Vedic scholar remembered for choosing spiritual wisdom over worldly wealth.'],
    ['Ambarish Raja', 'A devoted king whose unwavering faith and humility, even under a sage\'s curse, showed the protective power of surrender to God.'],
  ]},
  { name: 'Acharyas & Gurus', chars: [
    ['Adi Shankaracharya', 'An 8th-century philosopher who traveled across India establishing four mathas and systematizing Advaita Vedanta.'],
    ['Ramanujacharya', 'An 11th-century philosopher-saint who founded Vishishtadvaita, the philosophy of qualified non-dualism.'],
    ['Madhvacharya', 'A 13th-century philosopher who founded Dvaita, the school of dualistic Vedanta.'],
    ['Nimbarkacharya', 'A philosopher-saint who founded Dvaitadvaita, teaching simultaneous oneness and difference with the divine.'],
    ['Vallabhacharya', 'The philosopher-saint who founded the Pushtimarg tradition of devotion to Krishna.'],
    ['Bhagwan Swaminarayan', 'Founder of the Swaminarayan Sampraday, remembered for his teachings on dharma and devotion.'],
    ['Ramakrishna Paramahansa', 'A 19th-century mystic whose God-realization across faiths inspired a generation of seekers.'],
    ['Swami Vivekananda', 'Ramakrishna\'s disciple, who introduced Vedanta to the world at Chicago\'s 1893 Parliament of Religions.'],
  ]},
  { name: 'Bhakti Saints', chars: [
    ['Sant Kabir', 'A 15th-century poet-saint whose dohas cut across caste and creed to point directly at the divine.'],
    ['Sant Tukaram', 'A Maharashtrian poet-saint whose abhangas expressed deep devotion to Vitthal of Pandharpur.'],
    ['Sant Gyanneshwar', 'A 13th-century saint who wrote the Dnyaneshwari, a celebrated commentary on the Bhagavad Gita, in his teens.'],
    ['Sant Ravidas', 'A poet-saint whose verses on equality and devotion transcended the caste barriers of his time.'],
    ['Sant Tulsidas', 'Author of the Ramcharitmanas, which brought the story of Rama to millions in the language of the people.'],
    ['Sant Surdas', 'A blind poet-saint whose verses on Krishna\'s childhood remain central to Krishna bhakti.'],
    ['Narsinh Mehta', 'A Gujarati poet-saint whose bhajans, including "Vaishnav Jan To", celebrate compassion and devotion.'],
    ['Guru Nanak Dev', 'Founder of Sikhism, who taught one formless God and the equality of all people.'],
    ['Samarth Ramdas', 'A saint and spiritual guide to Chhatrapati Shivaji Maharaj, author of the Dasbodh.'],
    ['Meera Bai', 'A Rajput princess whose passionate devotional songs to Krishna made her one of India\'s best-loved poet-saints.'],
    ['Mata Sharda Devi', 'Spiritual companion of Ramakrishna Paramahansa, revered in her own right as the Holy Mother.'],
  ]},
  { name: 'Warriors & Rulers', chars: [
    ['Chhatrapati Shivaji Maharaj', 'Founder of the Maratha Empire, celebrated for his statecraft and swarajya, or self-rule.'],
    ['Maharana Pratap', 'The Rajput king of Mewar, remembered for his defiance against Mughal rule and devotion to his homeland.'],
    ['Rani Lakshmibai', 'The Rani of Jhansi, whose courage leading her army in 1857 made her an icon of resistance.'],
    ['Chhatrapati Sambhaji Maharaj', 'Shivaji\'s son and successor, remembered for his resilience under relentless persecution.'],
    ['Emperor Ashoka', 'The Mauryan emperor who, after the Kalinga war, embraced Buddhism and ruled through dhamma.'],
    ['Chandragupta Maurya', 'Founder of the Maurya Empire, guided by his mentor Chanakya to unify much of the Indian subcontinent.'],
    ['Chanakya', 'The strategist and teacher whose Arthashastra remains a foundational text on statecraft and economics.'],
  ]},
  { name: 'Scholars & Poets', chars: [
    ['Aryabhata', 'The 5th-century mathematician-astronomer who calculated pi and explained the rotation of the Earth.'],
    ['Kalidasa', 'Classical India\'s greatest poet-dramatist, author of Shakuntala and Meghaduta.'],
    ['Sushruta', 'The ancient physician regarded as the father of surgery, author of the Sushruta Samhita.'],
    ['Charaka', 'The physician-scholar whose Charaka Samhita is a foundational text of Ayurveda.'],
    ['Rabindranath Tagore', 'Poet and philosopher, the first non-European Nobel laureate in Literature, for Gitanjali.'],
  ]},
];

// Rotates across every name in the cloud (not per-category) for visual variety.
const TILE_VARIANTS = ['v1', 'v2', 'v3', 'v4'];

const FLAT_CHARACTERS = [];
CATEGORIES.forEach((cat) => cat.chars.forEach(([name, quote]) => {
  FLAT_CHARACTERS.push({ name, quote, epic: cat.name.split(':')[0].trim() });
}));
