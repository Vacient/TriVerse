/* ============================================================
   TRIVERSE AI — Destination & content catalog
   ============================================================ */

export const ORIGINS = [
  { id: "yangon", code: "RGN", city: "Yangon", country: "Myanmar", flag: "🇲🇲" },
  { id: "singapore", code: "SIN", city: "Singapore", country: "Singapore", flag: "🇸🇬" },
  { id: "hongkong", code: "HKG", city: "Hong Kong", country: "Hong Kong", flag: "🇭🇰" },
];

export const DESTINATIONS = [
  {
    id: "bangkok",
    city: "Bangkok",
    country: "Thailand",
    code: "BKK",
    flag: "🇹🇭",
    scene: "city-night",
    image: "/destinations/bangkok.jpg",
    tagline: "Street food, golden temples and river nights",
    flightPrice: { RGN: 128, SIN: 96, HKG: 142 },
    hotels: [
      { name: "Khaosan Hub Hostel", area: "Old Town", nightly: 12, tier: "value" },
      { name: "Riverside Boutique Hotel", area: "Chao Phraya Riverside", nightly: 23, tier: "boutique" },
      { name: "Sukhumvit Sky Suites", area: "Sukhumvit", nightly: 41, tier: "premium" },
    ],
    diningPerMeal: 8,
    transitPerDay: 7,
    attractions: [
      { name: "Wat Arun Exploration", desc: "Visit the Temple of Dawn. Climb the steep central prang for views of the Chao Phraya River.", cost: 8, hours: 2, tags: ["Culture"], scene: "temple" },
      { name: "Grand Palace & Emerald Buddha", desc: "Marvel at Thailand's most sacred temple complex and its glittering golden chedis.", cost: 14, hours: 3, tags: ["Culture"], scene: "palace" },
      { name: "Chatuchak Weekend Market", desc: "Lose yourself in 15,000 stalls of vintage finds, street snacks and local crafts.", cost: 4, hours: 3, tags: ["Shopping"], scene: "market" },
      { name: "Siam Paragon & MBK Run", desc: "Air-conditioned retail therapy across Bangkok's iconic shopping district.", cost: 2, hours: 3, tags: ["Shopping"], scene: "mall" },
      { name: "Lumphini Park Morning Walk", desc: "Jog or stroll among monitor lizards and lakes in Bangkok's green heart.", cost: 0, hours: 2, tags: ["Nature", "Relaxation"], scene: "park" },
      { name: "Wat Pho Reclining Buddha", desc: "The birthplace of Thai massage and home to a 46-metre golden reclining Buddha.", cost: 8, hours: 2, tags: ["Culture", "Relaxation"], scene: "temple" },
      { name: "Rooftop Sky Bar", desc: "Cocktails above the skyline as the sun sets over the Chao Phraya.", cost: 15, hours: 2, tags: ["Nightlife"], scene: "rooftop" },
      { name: "Asiatique Night Market", desc: "Ferris wheel, riverside stalls and live music after dark.", cost: 6, hours: 3, tags: ["Nightlife", "Shopping"], scene: "market" },
      { name: "Thai Cooking Class", desc: "Hands-on pad thai and green curry with a riverside chef.", cost: 22, hours: 3, tags: ["Food", "Culture"], scene: "cooking" },
      { name: "Traditional Thai Spa Session", desc: "Herbal compress and aromatherapy massage to reset your rhythm.", cost: 18, hours: 2, tags: ["Relaxation"], scene: "spa" },
    ],
    foods: [
      { name: "Lunch at Supanniga", desc: "Riverside dining featuring authentic Eastern Thai recipes. Recommendation: Moo Cha Muang.", cost: 12, meal: "lunch", tags: ["Food"], scene: "dining" },
      { name: "Dinner at Jay Fai", desc: "Michelin-starred street food legend. Famous for crab omelets. Expect a wait if no reservation.", cost: 26, meal: "dinner", tags: ["Food", "Nightlife"], scene: "street-food" },
      { name: "Chinatown Food Crawl", desc: "Grilled squid, dim sum and mango sticky rice under Yaowarat's neon signs.", cost: 10, meal: "dinner", tags: ["Food", "Nightlife"], scene: "street-food" },
      { name: "Thipsamai Pad Thai", desc: "The legendary shrimp-oil pad thai wrapped in egg — a pilgrimage for food lovers.", cost: 9, meal: "any", tags: ["Food"], scene: "street-food" },
      { name: "Canal-Side Brunch", desc: "Boat noodles and iced Thai tea on the banks of the khlong.", cost: 8, meal: "breakfast", tags: ["Food"], scene: "dining" },
      { name: "Or Tor Kor Market Tasting", desc: "Grazing through Thailand's best fresh market with a guide.", cost: 11, meal: "any", tags: ["Food", "Shopping"], scene: "market" },
    ],
    transfers: [
      { name: "Airport Rail Link + BTS", cost: 4, mode: "train" },
      { name: "Private car transfer", cost: 18, mode: "car" },
    ],
  },
  {
    id: "tokyo",
    city: "Tokyo",
    country: "Japan",
    code: "NRT",
    flag: "🇯🇵",
    scene: "city-neon",
    image: "/destinations/tokyo.jpg",
    airports: ["HND", "NRT"],
    tagline: "Neon streets, shrines and sushi counters",
    flightPrice: { RGN: 212, SIN: 158, HKG: 172 },
    hotels: [
      { name: "Asakusa Sakura Hostel", area: "Asakusa", nightly: 26, tier: "value" },
      { name: "Shinjuku Garden Hotel", area: "Shinjuku", nightly: 58, tier: "boutique" },
      { name: "Ginza Sky Tower Hotel", area: "Ginza", nightly: 118, tier: "premium" },
    ],
    diningPerMeal: 11,
    transitPerDay: 9,
    attractions: [
      { name: "Senso-ji Temple", desc: "Tokyo's oldest temple — pass through the thunder gate into a lane of paper lanterns.", cost: 0, hours: 2, tags: ["Culture"], scene: "temple" },
      { name: "Shibuya Crossing & Sky View", desc: "Watch the world's busiest crossing from above, then dive into Center Gai.", cost: 7, hours: 2, tags: ["Nightlife", "Shopping"], scene: "city-neon" },
      { name: "Tsukiji Outer Market", desc: "Fresh tuna bowls and tamagoyaki skewers before the crowds arrive.", cost: 12, hours: 2, tags: ["Food", "Shopping"], scene: "market" },
      { name: "Meiji Shrine Forest Walk", desc: "A tranquil cypress forest in the middle of Harajuku.", cost: 0, hours: 2, tags: ["Nature", "Culture"], scene: "park" },
      { name: "teamLab Planets", desc: "Barefoot through immersive digital art pools of light.", cost: 24, hours: 2, tags: ["Culture", "Nightlife"], scene: "gallery" },
      { name: "Harajuku Vintage Hunt", desc: "Takeshita Street crepes and thrift gems.", cost: 5, hours: 3, tags: ["Shopping"], scene: "mall" },
      { name: "Onsen & Sento Evening", desc: "Soak in a traditional neighborhood bathhouse.", cost: 10, hours: 2, tags: ["Relaxation"], scene: "spa" },
      { name: "Golden Gai Bar Hop", desc: "Six-seat bars glowing in Shinjuku's back alleys.", cost: 16, hours: 2, tags: ["Nightlife"], scene: "rooftop" },
    ],
    foods: [
      { name: "Omakase Sushi Counter", desc: "Ten pieces of seasonal nigiri, served piece by piece.", cost: 30, meal: "dinner", tags: ["Food"], scene: "dining" },
      { name: "Ramen Alley Slurp", desc: "Tonkotsu broth simmered 18 hours. Extra chashu recommended.", cost: 9, meal: "any", tags: ["Food"], scene: "street-food" },
      { name: "Izakaya Izakaya Night", desc: "Yakitori skewers, highballs and counter banter.", cost: 18, meal: "dinner", tags: ["Food", "Nightlife"], scene: "street-food" },
      { name: "Depachika Bento Picnic", desc: "Basement food hall bento assembled for a park picnic.", cost: 13, meal: "lunch", tags: ["Food"], scene: "market" },
    ],
    transfers: [
      { name: "Narita Express + Metro", cost: 12, mode: "train" },
      { name: "Airport limousine bus", cost: 16, mode: "bus" },
    ],
  },
  {
    id: "bali",
    city: "Bali",
    country: "Indonesia",
    code: "DPS",
    flag: "🇮🇩",
    scene: "beach",
    image: "/destinations/bali.jpg",
    tagline: "Rice terraces, surf beaches and jungle temples",
    flightPrice: { RGN: 168, SIN: 74, HKG: 132 },
    hotels: [
      { name: "Ubud Backpacker Lodge", area: "Ubud", nightly: 14, tier: "value" },
      { name: "Tegalalang Rice Villa", area: "Tegalalang", nightly: 34, tier: "boutique" },
      { name: "Seminyak Beach Resort", area: "Seminyak", nightly: 86, tier: "premium" },
    ],
    diningPerMeal: 7,
    transitPerDay: 9,
    attractions: [
      { name: "Tegalalang Rice Terrace Trek", desc: "Walk the emerald terraces at golden hour, swing over the palms.", cost: 5, hours: 3, tags: ["Nature", "Culture"], scene: "rice" },
      { name: "Uluwatu Cliff Temple & Kecak", desc: "Fire dance at sunset on a cliff above the Indian Ocean.", cost: 12, hours: 3, tags: ["Culture", "Nightlife"], scene: "temple" },
      { name: "Ubud Art Market", desc: "Hand-carved masks, rattan bags and silver from village artisans.", cost: 3, hours: 2, tags: ["Shopping"], scene: "market" },
      { name: "Seminyak Beach Club Day", desc: "Sunbeds, swim-up bar and DJ sets until dusk.", cost: 20, hours: 4, tags: ["Relaxation", "Nightlife"], scene: "beach" },
      { name: "Mount Batur Sunrise Hike", desc: "Pre-dawn trek to a volcano crater for breakfast above the clouds.", cost: 24, hours: 5, tags: ["Nature"], scene: "volcano" },
      { name: "Balinese Spa & Flower Bath", desc: "Two-hour massage ending in a frangipani petal bath.", cost: 16, hours: 2, tags: ["Relaxation"], scene: "spa" },
      { name: "Snorkel at Nusa Penida", desc: "Manta rays and coral gardens on a day boat.", cost: 28, hours: 6, tags: ["Nature"], scene: "beach" },
      { name: "Silver-Making Workshop", desc: "Hammer your own ring in a Celuk village studio.", cost: 18, hours: 2, tags: ["Culture", "Shopping"], scene: "cooking" },
    ],
    foods: [
      { name: "Warung Nasi Campur", desc: "A banana-leaf plate of lawar, sate lilit and crispy tempeh.", cost: 6, meal: "lunch", tags: ["Food"], scene: "street-food" },
      { name: "Babib Guling Feast", desc: "Bali's legendary roast suckling pig, carved to order.", cost: 9, meal: "lunch", tags: ["Food"], scene: "street-food" },
      { name: "Sunset Seafood at Jimbaran", desc: "Tables in the sand, grilled snapper and sambal matah.", cost: 15, meal: "dinner", tags: ["Food", "Nightlife"], scene: "dining" },
      { name: "Jungle Café Brunch", desc: "Smoothie bowls and single-origin coffee above the Ayung river.", cost: 10, meal: "breakfast", tags: ["Food"], scene: "dining" },
    ],
    transfers: [
      { name: "Airport shuttle bus", cost: 6, mode: "bus" },
      { name: "Private driver transfer", cost: 15, mode: "car" },
    ],
  },
  {
    id: "seoul",
    city: "Seoul",
    country: "South Korea",
    code: "ICN",
    flag: "🇰🇷",
    scene: "city-lights",
    image: "/destinations/seoul.jpg",
    tagline: "K-beauty, palace mornings and late-night BBQ",
    flightPrice: { RGN: 236, SIN: 178, HKG: 146 },
    hotels: [
      { name: "Hongdae Stay Hostel", area: "Hongdae", nightly: 19, tier: "value" },
      { name: "Insadong Hanok Stay", area: "Insadong", nightly: 46, tier: "boutique" },
      { name: "Gangnam View Hotel", area: "Gangnam", nightly: 98, tier: "premium" },
    ],
    diningPerMeal: 9,
    transitPerDay: 6,
    attractions: [
      { name: "Gyeongbokgung Palace", desc: "Rent a hanbok, join the changing of the guard, and stroll the palace grounds.", cost: 3, hours: 3, tags: ["Culture"], scene: "palace" },
      { name: "Bukchon Hanok Village", desc: "Eight photo-worthy alleys of 600-year-old tiled rooftops.", cost: 0, hours: 2, tags: ["Culture", "Shopping"], scene: "park" },
      { name: "Myeongdong Beauty Crawl", desc: "Sheet masks, cushion compacts and free samples on every corner.", cost: 10, hours: 3, tags: ["Shopping"], scene: "mall" },
      { name: "N Seoul Tower at Dusk", desc: "Cable car up Namsan for a 360° view of the city lights.", cost: 11, hours: 2, tags: ["Nightlife"], scene: "rooftop" },
      { name: "Han River Picnic & Bike", desc: "Rent a bike, order fried chicken to your mat, watch the fountains.", cost: 8, hours: 3, tags: ["Nature", "Relaxation"], scene: "park" },
      { name: "Jjimjilbang Spa Night", desc: "Korean sauna rituals: salt rooms, ice rooms and sleeping mats.", cost: 9, hours: 3, tags: ["Relaxation"], scene: "spa" },
      { name: "DMZ Half-Day Tour", desc: "Peer into North Korea from the Dora Observatory.", cost: 32, hours: 5, tags: ["Culture"], scene: "volcano" },
      { name: "Hongdae Street Performance", desc: "K-pop buskers and indie bands in the student district.", cost: 0, hours: 2, tags: ["Nightlife", "Culture"], scene: "city-neon" },
    ],
    foods: [
      { name: "KBBQ at Mapo Galmaegi", desc: "Charcoal-grilled pork belly, ssam wraps and soju shots.", cost: 16, meal: "dinner", tags: ["Food", "Nightlife"], scene: "street-food" },
      { name: "Gwangjang Market Bites", desc: "Bindaetteok pancakes and tteokbokki from Netflix-famous stalls.", cost: 8, meal: "any", tags: ["Food"], scene: "market" },
      { name: "Chimaek by the River", desc: "Crispy fried chicken and beer, the Seoul picnic classic.", cost: 11, meal: "any", tags: ["Food"], scene: "street-food" },
      { name: "Café Street Latte", desc: "Third-wave espresso in a converted hanok.", cost: 5, meal: "breakfast", tags: ["Food"], scene: "dining" },
    ],
    transfers: [
      { name: "AREX Express + Metro", cost: 8, mode: "train" },
      { name: "Airport taxi", cost: 22, mode: "car" },
    ],
  },
  {
    id: "singapore",
    city: "Singapore",
    country: "Singapore",
    code: "SIN",
    flag: "🇸🇬",
    scene: "garden",
    image: "/destinations/singapore.jpg",
    tagline: "Garden domes, hawker legends and rooftop infinity pools",
    flightPrice: { RGN: 118, SIN: 0, HKG: 132 },
    hotels: [
      { name: "Little India Backpackers", area: "Little India", nightly: 22, tier: "value" },
      { name: "Clarke Quay River Hotel", area: "Clarke Quay", nightly: 64, tier: "boutique" },
      { name: "Marina Bay Sky Hotel", area: "Marina Bay", nightly: 154, tier: "premium" },
    ],
    diningPerMeal: 8,
    transitPerDay: 5,
    attractions: [
      { name: "Gardens by the Bay Domes", desc: "Cloud Forest waterfall and the Supertree light show.", cost: 15, hours: 3, tags: ["Nature", "Culture"], scene: "garden" },
      { name: "Marina Bay Skyline Walk", desc: "The helix bridge, Merlion and skyline reflections at blue hour.", cost: 0, hours: 2, tags: ["Nightlife", "Nature"], scene: "city-night" },
      { name: "Haji Lane Boutiques", desc: "Murals, indie labels and vintage cameras.", cost: 4, hours: 2, tags: ["Shopping"], scene: "mall" },
      { name: "Sentosa Beach Afternoon", desc: "Luge rides, cable cars and lagoon swims.", cost: 18, hours: 4, tags: ["Relaxation", "Nature"], scene: "beach" },
      { name: "National Gallery", desc: "Southeast Asian modern art in the old Supreme Court.", cost: 10, hours: 3, tags: ["Culture"], scene: "gallery" },
      { name: "Changi Jewel Vortex", desc: "The indoor waterfall — worth arriving early for.", cost: 0, hours: 2, tags: ["Nature", "Shopping"], scene: "garden" },
      { name: "Singapore Flyer at Sunset", desc: "A slow spin over the strait at golden hour.", cost: 24, hours: 1.5, tags: ["Nightlife"], scene: "rooftop" },
    ],
    foods: [
      { name: "Maxwell Hawker Feast", desc: "Hainanese chicken rice from the stall that beat Gordon Ramsay.", cost: 7, meal: "any", tags: ["Food"], scene: "street-food" },
      { name: "Newton Circus Chilli Crab", desc: "Crab in fiery tomato sauce, mantou buns for dipping.", cost: 20, meal: "dinner", tags: ["Food", "Nightlife"], scene: "street-food" },
      { name: "Katong Laksa Lunch", desc: "Spiced coconut broth noodles, cut and eaten by spoon.", cost: 6, meal: "lunch", tags: ["Food"], scene: "dining" },
      { name: "Kaya Toast Breakfast", desc: "Charcoal toast, kaya jam and a soft egg ritual.", cost: 4, meal: "breakfast", tags: ["Food"], scene: "dining" },
    ],
    transfers: [
      { name: "MRT from airport", cost: 2, mode: "train" },
      { name: "Airport taxi", cost: 14, mode: "car" },
    ],
  },
  {
    id: "chiangmai",
    city: "Chiang Mai",
    country: "Thailand",
    code: "CNX",
    flag: "🇹🇭",
    scene: "temple",
    image: "/destinations/chiangmai.jpg",
    tagline: "Lantern temples, mountain mists and slow mornings",
    flightPrice: { RGN: 142, SIN: 112, HKG: 158 },
    hotels: [
      { name: "Old City Guesthouse", area: "Old City", nightly: 11, tier: "value" },
      { name: "Nimman Garden Stay", area: "Nimmanhaemin", nightly: 27, tier: "boutique" },
      { name: "Doi Suthep View Villa", area: "Doi Suthep", nightly: 52, tier: "premium" },
    ],
    diningPerMeal: 6,
    transitPerDay: 6,
    attractions: [
      { name: "Doi Suthep Temple", desc: "Climb the 306-step naga staircase to the golden mountain temple.", cost: 3, hours: 3, tags: ["Culture"], scene: "temple" },
      { name: "Elephant Sanctuary Morning", desc: "Feed and walk with rescued elephants — ethical, no riding.", cost: 38, hours: 5, tags: ["Nature"], scene: "jungle" },
      { name: "Sunday Walking Street", desc: "Handicrafts, hill-tribe textiles and street snacks through the old city.", cost: 3, hours: 3, tags: ["Shopping", "Nightlife"], scene: "market" },
      { name: "Thai Massage at Wat Pho School", desc: "Two hours of northern-style massage by licensed students.", cost: 9, hours: 2, tags: ["Relaxation"], scene: "spa" },
      { name: "Sticky Waterfalls Hike", desc: "Climb the limestone cascades — barefoot and grippy.", cost: 6, hours: 4, tags: ["Nature"], scene: "jungle" },
      { name: "Monk Chat & Wat Chedi Luang", desc: "Conversations with young monks at a 600-year-old stupa.", cost: 0, hours: 2, tags: ["Culture"], scene: "temple" },
      { name: "Nimman Café Hop", desc: "Design cafés, artisanal ice cream and gallery walls.", cost: 7, hours: 3, tags: ["Food", "Shopping"], scene: "mall" },
      { name: "Mae Rim Zipline", desc: "Fly through the rainforest canopy on 20+ lines.", cost: 26, hours: 4, tags: ["Nature"], scene: "jungle" },
    ],
    foods: [
      { name: "Khao Soi at Khao Soi Khun Yai", desc: "The city's best coconut curry noodles, extra pickled mustard.", cost: 4, meal: "lunch", tags: ["Food"], scene: "street-food" },
      { name: "Night Bazaar Grazing", desc: "Grilled river fish, sai oua sausage and mango sticky rice.", cost: 8, meal: "dinner", tags: ["Food", "Nightlife"], scene: "market" },
      { name: "Farm-to-Table Dinner", desc: "Northern tasting menu at an organic farm restaurant.", cost: 19, meal: "dinner", tags: ["Food"], scene: "dining" },
      { name: "Baan Kang Wat Brunch", desc: "Artisan village brunch among studios and gardens.", cost: 7, meal: "breakfast", tags: ["Food"], scene: "dining" },
    ],
    transfers: [
      { name: "Airport songthaew", cost: 3, mode: "bus" },
      { name: "Private car transfer", cost: 10, mode: "car" },
    ],
  },
  {
    id: "yangon",
    city: "Yangon",
    country: "Myanmar",
    code: "RGN",
    flag: "🇲🇲",
    scene: "temple",
    image: "/destinations/Myanmar.jpg",
    tagline: "Golden pagodas, teashops and colonial charm",
    flightPrice: { SIN: 168, HKG: 196, BKK: 96, DPS: 238, ICN: 268, CNX: 118, NRT: 242 },
    hotels: [
      { name: "Downtown Heritage Hostel", area: "Downtown", nightly: 14, tier: "value" },
      { name: "Kandawgyi Lake Boutique Hotel", area: "Kandawgyi", nightly: 36, tier: "boutique" },
      { name: "Golden Valley Sky Hotel", area: "Golden Valley", nightly: 78, tier: "premium" },
    ],
    diningPerMeal: 6,
    transitPerDay: 5,
    attractions: [
      { name: "Shwedagon Pagoda at Sunset", desc: "The 99-metre golden stupa glows as the sun drops over Yangon.", cost: 10, hours: 3, tags: ["Culture"], scene: "temple" },
      { name: "Bogyoke Market Stroll", desc: "Colonial arcades of lacquerware, longyi and jade.", cost: 4, hours: 2, tags: ["Shopping"], scene: "market" },
      { name: "Circular Train Ride", desc: "A slow loop through Yangon's neighborhoods on the 1950s railway.", cost: 2, hours: 3, tags: ["Culture", "Nature"], scene: "train" },
      { name: "Kandawgyi Lake Walk", desc: "Boardwalk views of the Karaweik barge and the Shwedagon beyond.", cost: 2, hours: 2, tags: ["Nature", "Relaxation"], scene: "park" },
      { name: "Chaukhtatgyi Reclining Buddha", desc: "A 66-metre reclining Buddha in an open hall.", cost: 0, hours: 1, tags: ["Culture"], scene: "temple" },
      { name: "Pansodan Street Art Walk", desc: "Faded colonial facades, galleries and café stops downtown.", cost: 3, hours: 2, tags: ["Shopping", "Culture"], scene: "gallery" },
      { name: "Inya Lake Evening Boat", desc: "Paddle around the university lake as the city cools off.", cost: 6, hours: 2, tags: ["Relaxation"], scene: "park" },
      { name: "Traditional Puppet Show", desc: "Burmese marionettes and live saung harp at dusk.", cost: 8, hours: 2, tags: ["Nightlife", "Culture"], scene: "city-night" },
    ],
    foods: [
      { name: "Mohinga Breakfast", desc: "Rice noodles in lemongrass fish broth — Myanmar's national dish.", cost: 3, meal: "breakfast", tags: ["Food"], scene: "street-food" },
      { name: "Shan Noodle Lunch", desc: "Sticky rice noodles with marinated chicken and pickles.", cost: 4, meal: "lunch", tags: ["Food"], scene: "dining" },
      { name: "Chinatown BBQ Street", desc: "Grilled skewers and stir-fried crab under 19th Street's neon.", cost: 9, meal: "dinner", tags: ["Food", "Nightlife"], scene: "street-food" },
      { name: "Rangoon Teahouse Evening", desc: "Laphet thoke tea-leaf salad with sweet milky tea.", cost: 5, meal: "dinner", tags: ["Food"], scene: "dining" },
    ],
    transfers: [
      { name: "Airport bus", cost: 3, mode: "bus" },
      { name: "Airport taxi", cost: 12, mode: "car" },
    ],
  },
  {
    id: "hongkong",
    city: "Hong Kong",
    country: "Hong Kong",
    code: "HKG",
    flag: "🇭🇰",
    scene: "city-night",
    image: "/destinations/Hong_Kong.jpg",
    tagline: "Skyline views, dim sum and island hikes",
    flightPrice: { RGN: 196, SIN: 132, BKK: 148, DPS: 168, ICN: 156, CNX: 172, NRT: 168 },
    hotels: [
      { name: "Mong Kok Backpackers", area: "Mong Kok", nightly: 24, tier: "value" },
      { name: "Tsim Sha Tsui Harbour Hotel", area: "Tsim Sha Tsui", nightly: 68, tier: "boutique" },
      { name: "Central Skyline Grand Hotel", area: "Central", nightly: 142, tier: "premium" },
    ],
    diningPerMeal: 10,
    transitPerDay: 6,
    attractions: [
      { name: "Victoria Peak Tram", desc: "Ride the steepest funicular to the city's best skyline view.", cost: 12, hours: 3, tags: ["Nightlife", "Nature"], scene: "rooftop" },
      { name: "Star Ferry Crossing", desc: "The classic green-and-white ferry across Victoria Harbour.", cost: 1, hours: 1, tags: ["Culture"], scene: "city-night" },
      { name: "Temple Street Night Market", desc: "Fortune tellers, dai pai dong stalls and neon bargains.", cost: 6, hours: 3, tags: ["Shopping", "Nightlife"], scene: "market" },
      { name: "Dragon's Back Hike", desc: "A ridgeline trail with ocean views on both sides.", cost: 0, hours: 4, tags: ["Nature"], scene: "jungle" },
      { name: "Mong Kok Food Crawl", desc: "Curry fishballs, egg waffles and stinky tofu.", cost: 8, hours: 2, tags: ["Food", "Shopping"], scene: "street-food" },
      { name: "Tsim Sha Tsui Promenade", desc: "The Symphony of Lights over the skyline at 8pm.", cost: 0, hours: 1.5, tags: ["Nightlife", "Relaxation"], scene: "city-lights" },
      { name: "Ngong Ping 360 Cable Car", desc: "Glass-floor gondolas to the Big Buddha on Lantau.", cost: 16, hours: 4, tags: ["Nature", "Culture"], scene: "volcano" },
      { name: "Lan Kwai Fong Night", desc: "Bar-hop the expat quarter's neon stairways.", cost: 14, hours: 3, tags: ["Nightlife"], scene: "rooftop" },
    ],
    foods: [
      { name: "Dim Sum at Tim Ho Wan", desc: "Michelin-starred har gow and baked BBQ buns.", cost: 9, meal: "lunch", tags: ["Food"], scene: "dining" },
      { name: "Wonton Noodle Lunch", desc: "Springy egg noodles with shrimp wontons in clear broth.", cost: 6, meal: "lunch", tags: ["Food"], scene: "street-food" },
      { name: "Dai Pai Dong Stir-Fry", desc: "Wok hei dishes under a tin awning with an ice-cold lemon tea.", cost: 11, meal: "dinner", tags: ["Food", "Nightlife"], scene: "street-food" },
      { name: "Egg Waffle & Milk Tea", desc: "Bubbly street waffles with silky Hong Kong milk tea.", cost: 4, meal: "any", tags: ["Food"], scene: "market" },
    ],
    transfers: [
      { name: "Airport Express + MTR", cost: 10, mode: "train" },
      { name: "Airport taxi", cost: 26, mode: "car" },
    ],
  },
];

/* Unified catalog for the From / Destination pickers: origins first, then the
   full destination list (deduplicated). Both dropdowns share this dataset and
   dynamically hide the location selected in the other dropdown. */
export const LOCATIONS = [
  ...ORIGINS.filter((o) => !DESTINATIONS.some((d) => d.id === o.id)),
  ...DESTINATIONS,
];

export const PREFERENCES = [
  { id: "Food", icon: "food", color: "purple" },
  { id: "Shopping", icon: "bag", color: "pink" },
  { id: "Culture", icon: "temple", color: "blue" },
  { id: "Nightlife", icon: "moon", color: "navy" },
  { id: "Nature", icon: "leaf", color: "green" },
  { id: "Relaxation", icon: "spa", color: "amber" },
];

export const DEFAULT_PREFERENCES = ["Food", "Shopping"];

export function getDestination(id) {
  return DESTINATIONS.find((d) => d.id === id) || DESTINATIONS[0];
}

export function getOrigin(id) {
  return ORIGINS.find((o) => o.id === id) || getDestination(id);
}

/* "Singapore, Singapore" would be redundant — collapse city/country when identical. */
export function placeLabel(d) {
  return d.city === d.country ? d.city : `${d.city}, ${d.country}`;
}
