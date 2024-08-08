// ---------------------------------------------- Main Engine Generator v3 ------------------------------------------------- //
// ------------- Constants ---------------- //
const SEEDS = [
    {
        puzzle: 'g--d--caf---g----ii-f--hg-bb-iaedhgc--afcg--d-g-b-----f-d--abc---b------c--h-bfia',
        solution: 'gbhdiecafacegbfdhiidfcahgebbfiaedhgcehafcgibddgcbhiafefidegabchhabifcedgceghdbfia',
        difficulty: 'easy',
    },
    {
        puzzle: 'bf-hiac-g-gi------a-hf-g---g-a-fi--ddef---i-b--b-a-g-ff---gbh--hac---------e-cfd-',
        solution: 'bfdhiacegegicbdafhachfegdbighabfiecddefgchiabcibdaeghffdeagbhichacidfbgeibgehcfda',
        difficulty: 'easy',
    },
    {
        puzzle: 'hgad-e--b-cbf-ge---df-aih-----i-------d-ecai-g---fa----igadf----fe-i-----h-eg-fd-',
        solution: 'hgadceifbicbfhgeadedfbaihcgcahibdgeffbdgecaihgeihfadbcbigadfchedfecihbgaahcegbfdi',
        difficulty: 'easy',
    },
    {
        puzzle: '-fbe-c----e-----a---g-ihb--gb-fhdc-eid-g-eahbch-----f-----ef-ga-g----e-i--hi-----',
        solution: 'afbegcidhheidfbgacdcgaihbefgbafhdcieidfgceahbchebaidfgbidcefhgafgchdaebieahibgfcd',
        difficulty: 'easy',
    },
    {
        puzzle: 'c--d-fgeb---g--i-hg-ih--da-a-g-b-cde-edc--a--b--------i-e-cd-ha-fb-h-e-ch--e-----',
        solution: 'cahdifgebedfgabichgbihecdafahgfbicdefedcghabibicadehfgigebcdfhadfbihaegchcaefgbid',
        difficulty: 'easy',
    },
    {
        puzzle: 'bi---ec--eg--h-fbdf--------i-hba-dfe----ehbig--bf-d-h--f-e-a-c-----g-e--cde--f--a',
        solution: 'bidgfecahegcahifbdfhadcbgeiichbagdfedafcehbiggebfidahchfgedaicbabihgcedfcdeibfhga',
        difficulty: 'easy',
    },
    {
        puzzle: '-----ef-ha--bf--ecfe-gc---a----gbch--a--df-b--bi----f-h-af-gidbdf----g--i--c--ha-',
        solution: 'bicdaefghahgbfidecfedgchbiaedfagbchicahidfebggbiehcafdhcafegidbdfbhiagceigecbdhaf',
        difficulty: 'easy',
    },
    {
        puzzle: '--fg--hec-ebc-------h-dfgabb--h-a-fg-g-df-i--f-a---b--hf----ad---if----hc-ea---bi',
        solution: 'dafgbihecgebcahdifichedfgabbidhcaefgegcdfbihafhaigebcdhfgbicadeabifedcghcdeahgfbi',
        difficulty: 'easy',
    },
    {
        puzzle: '-----b-f-e-aih----bi----a----e---i---g-bf--a-----cihg-ic-fdhg-a--h---f-cgef-iad-b',
        solution: 'dhcgabefiefaihcbdgbigdefachcaehgdibfhgibfecadfbdacihgeicbfdhgeaadhebgficgefciadhb',
        difficulty: 'easy',
    },
    {
        puzzle: 'e--f-b-------eid-f--h----b-ge-c-fadhab-ihgfe-hc--d----d-g---cf---eg--h-bf---i----',
        solution: 'edcfgbihabgaheidcfifhdcaebggeicbfadhabdihgfechcfadebgidigbahcfecaegfdhibfhbeicgad',
        difficulty: 'easy',
    },
    {
        puzzle: 'g-hedcf---i-f--a--e--a-----c--i-deh-i-------g--g--e---a----f--c-cf-e-gi-b-------e',
        solution: 'gahedcfbidicfbgaehefbaihcgdcbaigdehfihebfadcgfdghceiabaeighfbdchcfdebgiabgdcaihfe',
        difficulty: 'medium',
    },
    {
        puzzle: '-di--ac---b-cid-h---h--b-d-----f----h-d----fca---c-i--d----i-e-bh---cd-g-g---fac-',
        solution: 'fdighacbeebgcidfhacahfebgdigecifhbadhidabgefcafbdceighdcabgihefbhfeacdigigehdfacb',
        difficulty: 'medium',
    },
    {
        puzzle: '--ac-i------ah-d---e----i---a-e-bc----g--f--ad---gae--ig-fa------hd-e-g-c-d-b----',
        solution: 'hdaceigfbbifahgdcegecbfdiahfaiedbchgehgicfbdadcbhgaeifigefachbdabhdiefgccfdgbhaei',
        difficulty: 'medium',
    },
    {
        puzzle: 'fg----i---h--f-e--e-bd--afh-f--hg--ic------b----f-c-----c-------eiac-gdf-b-----e-',
        solution: 'fgaebhicdihdcfaegbecbdgiafhdfebhgcaicahidefbgbigfacdhegdchefbiaheiacbgdfabfgidhec',
        difficulty: 'medium',
    },
    {
        puzzle: '--d-g-fi---e-ci-d-a----eg-----i---f---bg--ec-e--d--haig----f----ha--------ch-g-e-',
        solution: 'cbdaghfiehgefciadbaifbdeghcdahiecbfgifbghaecdecgdfbhaigeicafdbhbhaeidcgffdchbgiea',
        difficulty: 'medium',
    },
    {
        puzzle: '----d-a---a-ie---di------h-d-e--cg-b-b-e--i----c-i--dh--h-gf--c------b-g--i-ce-a-',
        solution: 'ehfcdgabicabiehfgdigdfbachediehacgfbhbgefdicaafcgibedhbehagfdicfcadhibeggdibcehaf',
        difficulty: 'medium',
    },
    {
        puzzle: '---cfa-ibf---i-------g---f--i--h-cd-gdf--------cd--fb-------bc--gb---dhi---he--g-',
        solution: 'dhecfagibfbgeidhaccaigbhefdbiafhecdggdfbaciehhecdgifbaafhidgbceegbacfdhiicdhebagf',
        difficulty: 'medium',
    },
    {
        puzzle: 'a------g-b--di-a-f--e--ahi----a------bae--------ichbaei---de------c-igd-d-h----ci',
        solution: 'aidhefcgbbhgdicaeffcebgahidheiabgdfccbaefdihggdfichbaeiacgdefbhefbchigdadghfabeci',
        difficulty: 'medium',
    },
    {
        puzzle: '----g-------ci--bg-i-de-af-------beh-----fgdi---eb-f----ah--ig---hg-d---cd--a----',
        solution: 'hacfgbdieefdciahbggibdehafcagfidcbehbceahfgdidhiebgfcafbahceigdiehgfdcabcdgbaiehf',
        difficulty: 'medium',
    },
    {
        puzzle: 'gfbc---dh-a-------d--a--fi--daifc--ech------f-------c-f---e--b---d-----i--igh-d--',
        solution: 'gfbcieadhiahbdfcegdceaghfibbdaifcghechgebdiafeifhagbcdfgcdeihbahbdfcaegiaeighbdfc',
        difficulty: 'medium',
    },
    {
        puzzle: '-e-fh--a-g----ed---a--b-f---ih----dc--------a----g----b---i---dhc-gf-----g------e',
        solution: 'debfhciagghfiaedcbcaidbgfehaihbefgdcfbgcdiehaedchgabifbfaeihcgdhcegfdabiigdacbhfe',
        difficulty: 'hard',
    },
    {
        puzzle: '----i-b---fc--a-h-eb----i-fcieg--ad---hd-e----d--a----f---b-e-i-------b--h--e----',
        solution: 'hageifbcdifcbdagheebdchgiafciegfbadhaghdcefibbdfiahcegfcahbdegideifgchbaghbaeidfc',
        difficulty: 'hard',
    },
    {
        puzzle: '-------hg-----h-d-a-g---ei--ce--dg--dbf---------bfid--hg---f----d--h---c--a-eg---',
        solution: 'bedfiachgficeghbdaahgdbceificehadgfbdbfgceiahgahbfidcehgbcdfaeiediahbfgccfaieghbd',
        difficulty: 'hard',
    },
    {
        puzzle: 'h---f------------i--e---a-h-dhe---a---fh-b----i--c---gf-ga-di--a-i---d-bce------a',
        solution: 'hgcifabdedabgehfciifebdcaghbdheigcafgcfhabeideiadcfhbgfbgahdiecahicgedfbcedfbigha',
        difficulty: 'hard',
    },
    {
        puzzle: 'f----dha----b------a------dic---h------c--egb-----------a-----ed--f-ec-g-fg------',
        solution: 'febigdhachdcbfageigaiehcbfdicegbhadfahfcdiegbbgdaefichcbadigfhedihfaecbgefghcbdia',
        difficulty: 'hard',
    },
    {
        puzzle: 'c-a---i---b--c--ede----g--c-e---dga--c---b--i--gf-----b-----ei------a-cg--ie----a',
        solution: 'cfahdeigbgbhacifedeidbfgahchebcidgafacfgebhdiidgfahcbebacdgfeihfheibadcgdgiehcbfa',
        difficulty: 'hard',
    },
    {
        puzzle: '--a-i---cc-g-------h--e--a--a---ib---d--f--h-----------i---d-f------g-c-dg---b--h',
        solution: 'beagifhdccfghdaibeihdbecfaghafcgibedgdbafechiecidbhagfaihecdgfbfbeihgdcadgcfabeih',
        difficulty: 'hard',
    },
    {
        puzzle: 'i--f--ec------a-fbg-b-i---h-d---ihg-----b---fe---a------d-----i---ie-b-------g---',
        solution: 'iahfdbecgdcehgaifbgfbeicdahbdacfihgechgdbeaifeifgahcbdhbdacfgeifgciedbhaaeibhgfdc',
        difficulty: 'hard',
    },
    {
        puzzle: '--e---c------i--g-------d-hbaf--------cfhe--ie------f-h-d-c-----f-h----c---i-ga--',
        solution: 'fdegbhciaacheidfgbibgcfadehbafdgihcedgcfhebaiehibacgfdhidacfebggfahebidccebidgahf',
        difficulty: 'hard',
    },
    {
        puzzle: '--f-d-i---g--b-a-d--c-a-----c-i---e---eh--g---------ac---------b---i-e----gf--d--',
        solution: 'abfcdhigehgiebfacddecgaibhfgcdifahebfaehcbgdiihbdegfacefabgdcihbdhaicefgcigfhedba',
        difficulty: 'hard',
    },
    {
        puzzle: '-ica------------bh----g--f--g---a---i-e----c-a---f------d--bg------c---e-fg----id',
        solution: 'ficabhdeggeaidfcbhdhbegcifabgfceahdiidebhgacfachdfiegbeadfibghchbigcdfaecfghaebid',
        difficulty: 'expert',
    },
    {
        puzzle: '-h-i------i---------f--bh--b---a--ed-ca------i--f---h--------c----he--f-ab--df---',
        solution: 'ehbicdgafdigafhcbecafegbhdibghcaifedfcadheigbiedfbgahchfebiadcggdihecbfaabcgdfeih',
        difficulty: 'expert',
    },
    {
        puzzle: '-h--c-f-ice-------b--ia--------g-h------e---ff--h---i----b---eh----------ga--f--c',
        solution: 'ahgdcefbiceigfbahdbfdiahcgediefgchabgbhaeidcffachbdeigicfbdagehedbchgifahgaeifbdc',
        difficulty: 'expert',
    },
    {
        puzzle: 'a----db---g-c----f--e-f--i---------i----h-f-d--g---ch---b--e-c-ca------h-d-------',
        solution: 'afchidbegigdcebhafhbegfadicfehdgcabibcaehifgddigbafcheghbfdeicacafibgedhediachgfb',
        difficulty: 'expert',
    },
    {
        puzzle: '------c--g-b--a---------g-h---e----gb--id-----i-f---eb----i---c-he-f-d--a------h-',
        solution: 'edhbgicfagfbchaeidicadefgbhhafebcidgbegidhacfdicfaghebfgdhiebaccheafbdgiabigcdfhe',
        difficulty: 'expert',
    },
    {
        puzzle: '---bf-i-------hc-aa----------g------h--c-e----i----bh----f---g--f-----e---hig-a--',
        solution: 'chebfaidgfgdeihcbaabidcgefhbeghdifachafcbegiddicgafbheicafedhgbgfbahcdeiedhigbacf',
        difficulty: 'expert',
    },
    {
        puzzle: '--c-----d---g-i--h-i----b--ace------d--bh----b--f---------e---------bea--d--a--c-',
        solution: 'gecabhifdfbagdicehhidefcbgaaceigdhbfdgfbheaicbhifcagdeiagcefdhbcfhdibeagedbhagfci',
        difficulty: 'expert',
    },
    {
        puzzle: '-----d-h--h-----a-gb------i-----a--g----eh-c--i--d-----ge---a--d----f-----ab--i--',
        solution: 'iacefdghbehdgibcafgbfhacedicehfbadigfdgiehbcaaibcdgfehbgedhiafcdciagfhbehfabceigd',
        difficulty: 'expert',
    },
    {
        puzzle: '-bi-------c----e---------af---eba-----a-i-g------c--i----h-e--d-e------gc-b--f---',
        solution: 'fbiaegdhcachdfbegiedgchibafgicebafdhbhafidgcedfegchaibiafhgecbdhedbacifgcgbidfhea',
        difficulty: 'expert',
    },
    {
        puzzle: '---i--h-bc----b----g----a----gd-----e--h-f------b---ac-c------ha-----id--i--gd---',
        solution: 'deficahgbchagfbdeibgiedhacffagdicbheebchafgididhbegfacgcdabiefhafbcheidghiefgdcba',
        difficulty: 'expert',
    },
];
const BASE_LAYOUT = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42, 43, 44],
    [45, 46, 47, 48, 49, 50, 51, 52, 53],
    [54, 55, 56, 57, 58, 59, 60, 61, 62],
    [63, 64, 65, 66, 67, 68, 69, 70, 71],
    [72, 73, 74, 75, 76, 77, 78, 79, 80],
];

// ------------- Helper ----------------- //
const boardToSequence = (board) => board.map((row) => row.join('')).join('');
const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];
const getSequence = (layout, seedSequence, tokenMap) => boardToSequence(populateLayout(layout, replaceTokens(seedSequence, tokenMap)));
const replaceTokens = (sequence, tokenMap) => sequence.split('').map((token) => tokenMap[token] || token).join('');
const sortRandom = () => (Math.random() < 0.5 ? 1 : -1);


// -------------- Layout ---------------- //
const getLayout = (baseLayout) => shuffleLayout(rotateLayout(baseLayout));
const getLayoutBands = (layout) => [
    [layout[0], layout[1], layout[2]],
    [layout[3], layout[4], layout[5]],
    [layout[6], layout[7], layout[8]],
];
const populateLayout = (layout, sequence) => layout.map((row) => row.map((cell) => sequence[cell]));
const rotateLayout = (layout) => getRandomItem([rotateLayout0, rotateLayout90, rotateLayout180, rotateLayout270])(layout);
const rotateLayout0 = (layout) => layout;
const rotateLayout90 = (layout) => layout[0].map((_row, index) => layout.map((row) => row[index]).reverse());
const rotateLayout180 = (layout) => layout.map((row) => [...row].reverse()).reverse();
const rotateLayout270 = (layout) => layout[0].map((_row, index) => layout.map((row) => [...row].reverse()[index]));
const shuffleLayout = (layout) => shuffleLayoutColumns(shuffleLayoutRows(shuffleLayoutStacks(shuffleLayoutBands(layout))));
const shuffleLayoutBands = (layout) => getLayoutBands(layout).sort(sortRandom).flat();
const shuffleLayoutColumns = (layout) => rotateLayout270(shuffleLayoutRows(rotateLayout90(layout)));
const shuffleLayoutRows = (layout) => getLayoutBands(layout)
        .map((rows) => rows.sort(sortRandom))
        .flat();
const shuffleLayoutStacks = (layout) =>
    rotateLayout270(shuffleLayoutBands(rotateLayout90(layout)));

// --------------- Seed ------------------ //
const getSeedsByDifficulty = (seeds, difficulty) => seeds.filter((seed) => !difficulty || seed.difficulty === difficulty);
const getSeed = (seeds, difficulty) => getRandomItem(getSeedsByDifficulty(seeds, difficulty));

// ----------------- Token --------------- //
const getTokenMap = () =>
    'abcdefghi'
        .split('')
        .sort(sortRandom)
        .reduce(
            (acc, token, index) => ({
                ...acc,
                [token]: String(index + 1),
            }),
            {},
        )

// ------------------- Convert Sudoku String to Sudoku Array ------------------------- //
function convertSudokuStringToArray(sudokuString) {
    const sudokuArray = Array.from({ length: 9 }, () => Array(9).fill(0));

    for (let i = 0; i < sudokuString.length; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const char = sudokuString[i];

        if (char >= '1' && char <= '9') {
            sudokuArray[row][col] = parseInt(char, 10);
        }
    }

    return sudokuArray;
}

// ------------------ Generate Sudoku with seed fast transformations algorithm ----------------- //
function getSudoku(difficulty){
    const seed = getSeed(SEEDS, difficulty);
    const layout = getLayout(BASE_LAYOUT);
    const tokenMap = getTokenMap();

    const puzzle = convertSudokuStringToArray(getSequence(layout, seed.puzzle, tokenMap));
    const solution = convertSudokuStringToArray(getSequence(layout, seed.solution, tokenMap));

    return {
        puzzle,
        solution,
        difficulty: seed.difficulty,
    };
}

// --------------- Sudoku Generation with Levels of Difficulty -------------- //
function generateSudoku(difficulty, numbers = initialNumbers) {

    let dif;

    switch (difficulty) {
        case 1:
            dif = 'easy';
            break;
        case 2:
            dif = 'medium';
            break;
        case 3:
            dif = 'hard';
            break;
        case 4:
            dif = 'expert';
            break;
        case 5:
            dif = 'expert';
            break;
        default:
            dif = 'medium'; // Medium by default
            break;
    }

    const sudoku = getSudoku(dif);

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            numbers[row][col] = sudoku.puzzle[row][col];
        }
    }

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            solution[row][col] = sudoku.solution[row][col];
        }
    }

}