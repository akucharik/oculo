'use strict';

import sortBy  from 'lodash/sortBy';

const data = {
    lookups: {}
};

// ScrollTo
data.scrollItems = [{
    target: '#anchorDemo',
    trigger: '#navDemo'
}, {
    target: '#anchorGetStarted',
    trigger: '#navGetStarted'
}, {
    target: '#anchorDocumentation',
    trigger: '#navDocumentation'
}, {
    target: 0,
    trigger: '#topDemo'
}, {
    target: 0,
    trigger: '#topGetStarted'
}, {
    target: 0,
    trigger: '#topDocumentation'
}];

// Periodic Table Elements
data.elements = [
    {"atomicNumber":1,"name":"Hydrogen","symbol":"H","weight":"1.00794","metalCategory":"Nonmetal","row":1,"col":1},
    {"atomicNumber":2,"name":"Helium","symbol":"He","weight":"4.002602","metalCategory":"Nonmetal","row":18,"col":1},
    {"atomicNumber":3,"name":"Lithium","symbol":"Li","weight":"6.941","metalCategory":"Metal","row":1,"col":2},
    {"atomicNumber":4,"name":"Beryllium","symbol":"Be","weight":"9.012182","metalCategory":"Metal","row":2,"col":2},
    {"atomicNumber":5,"name":"Boron","symbol":"B","weight":"10.811","metalCategory":"Metalloid","row":13,"col":2},
    {"atomicNumber":6,"name":"Carbon","symbol":"C","weight":"12.0107","metalCategory":"Nonmetal","row":14,"col":2},
    {"atomicNumber":7,"name":"Nitrogen","symbol":"N","weight":"14.0067","metalCategory":"Nonmetal","row":15,"col":2},
    {"atomicNumber":8,"name":"Oxygen","symbol":"O","weight":"15.9994","metalCategory":"Nonmetal","row":16,"col":2},
    {"atomicNumber":9,"name":"Fluorine","symbol":"F","weight":"18.9984032","metalCategory":"Nonmetal","row":17,"col":2},
    {"atomicNumber":10,"name":"Neon","symbol":"Ne","weight":"20.1797","metalCategory":"Nonmetal","row":18,"col":2},
    {"atomicNumber":11,"name":"Sodium","symbol":"Na","weight":"22.98976...","metalCategory":"Metal","row":1,"col":3},
    {"atomicNumber":12,"name":"Magnesium","symbol":"Mg","weight":"24.305","metalCategory":"Metal","row":2,"col":3},
    {"atomicNumber":13,"name":"Aluminium","symbol":"Al","weight":"26.9815386","metalCategory":"Metal","row":13,"col":3},
    {"atomicNumber":14,"name":"Silicon","symbol":"Si","weight":"28.0855","metalCategory":"Metalloid","row":14,"col":3},
    {"atomicNumber":15,"name":"Phosphorus","symbol":"P","weight":"30.973762","metalCategory":"Nonmetal","row":15,"col":3},
    {"atomicNumber":16,"name":"Sulfur","symbol":"S","weight":"32.065","metalCategory":"Nonmetal","row":16,"col":3},
    {"atomicNumber":17,"name":"Chlorine","symbol":"Cl","weight":"35.453","metalCategory":"Nonmetal","row":17,"col":3},
    {"atomicNumber":18,"name":"Argon","symbol":"Ar","weight":"39.948","metalCategory":"Nonmetal","row":18,"col":3},
    {"atomicNumber":19,"name":"Potassium","symbol":"K","weight":"39.948","metalCategory":"Metal","row":1,"col":4},
    {"atomicNumber":20,"name":"Calcium","symbol":"Ca","weight":"40.078","metalCategory":"Metal","row":2,"col":4},
    {"atomicNumber":21,"name":"Scandium","symbol":"Sc","weight":"44.955912","metalCategory":"Metal","row":3,"col":4},
    {"atomicNumber":22,"name":"Titanium","symbol":"Ti","weight":"47.867","metalCategory":"Metal","row":4,"col":4},
    {"atomicNumber":23,"name":"Vanadium","symbol":"V","weight":"50.9415","metalCategory":"Metal","row":5,"col":4},
    {"atomicNumber":24,"name":"Chromium","symbol":"Cr","weight":"51.9961","metalCategory":"Metal","row":6,"col":4},
    {"atomicNumber":25,"name":"Manganese","symbol":"Mn","weight":"54.938045","metalCategory":"Metal","row":7,"col":4},
    {"atomicNumber":26,"name":"Iron","symbol":"Fe","weight":"55.845","metalCategory":"Metal","row":8,"col":4},
    {"atomicNumber":27,"name":"Cobalt","symbol":"Co","weight":"58.933195","metalCategory":"Metal","row":9,"col":4},
    {"atomicNumber":28,"name":"Nickel","symbol":"Ni","weight":"58.6934","metalCategory":"Metal","row":10,"col":4},
    {"atomicNumber":29,"name":"Copper","symbol":"Cu","weight":"63.546","metalCategory":"Metal","row":11,"col":4},
    {"atomicNumber":30,"name":"Zinc","symbol":"Zn","weight":"65.38","metalCategory":"Metal","row":12,"col":4},
    {"atomicNumber":31,"name":"Gallium","symbol":"Ga","weight":"69.723","metalCategory":"Metal","row":13,"col":4},
    {"atomicNumber":32,"name":"Germanium","symbol":"Ge","weight":"72.63","metalCategory":"Metalloid","row":14,"col":4},
    {"atomicNumber":33,"name":"Arsenic","symbol":"As","weight":"74.9216","metalCategory":"Metalloid","row":15,"col":4},
    {"atomicNumber":34,"name":"Selenium","symbol":"Se","weight":"78.96","metalCategory":"Nonmetal","row":16,"col":4},
    {"atomicNumber":35,"name":"Bromine","symbol":"Br","weight":"79.904","metalCategory":"Nonmetal","row":17,"col":4},
    {"atomicNumber":36,"name":"Krypton","symbol":"Kr","weight":"83.798","metalCategory":"Nonmetal","row":18,"col":4},
    {"atomicNumber":37,"name":"Rubidium","symbol":"Rb","weight":"85.4678","metalCategory":"Metal","row":1,"col":5},
    {"atomicNumber":38,"name":"Strontium","symbol":"Sr","weight":"87.62","metalCategory":"Metal","row":2,"col":5},
    {"atomicNumber":39,"name":"Yttrium","symbol":"Y","weight":"88.90585","metalCategory":"Metal","row":3,"col":5},
    {"atomicNumber":40,"name":"Zirconium","symbol":"Zr","weight":"91.224","metalCategory":"Metal","row":4,"col":5},
    {"atomicNumber":41,"name":"Niobium","symbol":"Nb","weight":"92.90628","metalCategory":"Metal","row":5,"col":5},
    {"atomicNumber":42,"name":"Molybdenum","symbol":"Mo","weight":"95.96","metalCategory":"Metal","row":6,"col":5},
    {"atomicNumber":43,"name":"Technetium","symbol":"Tc","weight":"(98)","metalCategory":"Metal","row":7,"col":5},
    {"atomicNumber":44,"name":"Ruthenium","symbol":"Ru","weight":"101.07","metalCategory":"Metal","row":8,"col":5},
    {"atomicNumber":45,"name":"Rhodium","symbol":"Rh","weight":"102.9055","metalCategory":"Metal","row":9,"col":5},
    {"atomicNumber":46,"name":"Palladium","symbol":"Pd","weight":"106.42","metalCategory":"Metal","row":10,"col":5},
    {"atomicNumber":47,"name":"Silver","symbol":"Ag","weight":"107.8682","metalCategory":"Metal","row":11,"col":5},
    {"atomicNumber":48,"name":"Cadmium","symbol":"Cd","weight":"112.411","metalCategory":"Metal","row":12,"col":5},
    {"atomicNumber":49,"name":"Indium","symbol":"In","weight":"114.818","metalCategory":"Metal","row":13,"col":5},
    {"atomicNumber":50,"name":"Tin","symbol":"Sn","weight":"118.71","metalCategory":"Metal","row":14,"col":5},
    {"atomicNumber":51,"name":"Antimony","symbol":"Sb","weight":"121.76","metalCategory":"Metalloid","row":15,"col":5},
    {"atomicNumber":52,"name":"Tellurium","symbol":"Te","weight":"127.6","metalCategory":"Metalloid","row":16,"col":5},
    {"atomicNumber":53,"name":"Iodine","symbol":"I","weight":"126.90447","metalCategory":"Nonmetal","row":17,"col":5},
    {"atomicNumber":54,"name":"Xenon","symbol":"Xe","weight":"131.293","metalCategory":"Nonmetal","row":18,"col":5},
    {"atomicNumber":55,"name":"Caesium","symbol":"Cs","weight":"132.9054","metalCategory":"Metal","row":1,"col":6},
    {"atomicNumber":56,"name":"Barium","symbol":"Ba","weight":"132.9054","metalCategory":"Metal","row":2,"col":6},
    {"atomicNumber":"57-71","name":"","symbol":"","weight":"","metalCategory":"Metal","row":3,"col":6},
    {"atomicNumber":57,"name":"Lanthanum","symbol":"La","weight":"138.90547","metalCategory":"Metal","row":4,"col":9},
    {"atomicNumber":58,"name":"Cerium","symbol":"Ce","weight":"140.116","metalCategory":"Metal","row":5,"col":9},
    {"atomicNumber":59,"name":"Praseodymium","symbol":"Pr","weight":"140.90765","metalCategory":"Metal","row":6,"col":9},
    {"atomicNumber":60,"name":"Neodymium","symbol":"Nd","weight":"144.242","metalCategory":"Metal","row":7,"col":9},
    {"atomicNumber":61,"name":"Promethium","symbol":"Pm","weight":"(145)","metalCategory":"Metal","row":8,"col":9},
    {"atomicNumber":62,"name":"Samarium","symbol":"Sm","weight":"150.36","metalCategory":"Metal","row":9,"col":9},
    {"atomicNumber":63,"name":"Europium","symbol":"Eu","weight":"151.964","metalCategory":"Metal","row":10,"col":9},
    {"atomicNumber":64,"name":"Gadolinium","symbol":"Gd","weight":"157.25","metalCategory":"Metal","row":11,"col":9},
    {"atomicNumber":65,"name":"Terbium","symbol":"Tb","weight":"158.92535","metalCategory":"Metal","row":12,"col":9},
    {"atomicNumber":66,"name":"Dysprosium","symbol":"Dy","weight":"162.5","metalCategory":"Metal","row":13,"col":9},
    {"atomicNumber":67,"name":"Holmium","symbol":"Ho","weight":"164.93032","metalCategory":"Metal","row":14,"col":9},
    {"atomicNumber":68,"name":"Erbium","symbol":"Er","weight":"167.259","metalCategory":"Metal","row":15,"col":9},
    {"atomicNumber":69,"name":"Thulium","symbol":"Tm","weight":"168.93421","metalCategory":"Metal","row":16,"col":9},
    {"atomicNumber":70,"name":"Ytterbium","symbol":"Yb","weight":"173.054","metalCategory":"Metal","row":17,"col":9},
    {"atomicNumber":71,"name":"Lutetium","symbol":"Lu","weight":"174.9668","metalCategory":"Metal","row":18,"col":9},
    {"atomicNumber":72,"name":"Hafnium","symbol":"Hf","weight":"178.49","metalCategory":"Metal","row":4,"col":6},
    {"atomicNumber":73,"name":"Tantalum","symbol":"Ta","weight":"180.94788","metalCategory":"Metal","row":5,"col":6},
    {"atomicNumber":74,"name":"Tungsten","symbol":"W","weight":"183.84","metalCategory":"Metal","row":6,"col":6},
    {"atomicNumber":75,"name":"Rhenium","symbol":"Re","weight":"186.207","metalCategory":"Metal","row":7,"col":6},
    {"atomicNumber":76,"name":"Osmium","symbol":"Os","weight":"190.23","metalCategory":"Metal","row":8,"col":6},
    {"atomicNumber":77,"name":"Iridium","symbol":"Ir","weight":"192.217","metalCategory":"Metal","row":9,"col":6},
    {"atomicNumber":78,"name":"Platinum","symbol":"Pt","weight":"195.084","metalCategory":"Metal","row":10,"col":6},
    {"atomicNumber":79,"name":"Gold","symbol":"Au","weight":"196.966569","metalCategory":"Metal","row":11,"col":6},
    {"atomicNumber":80,"name":"Mercury","symbol":"Hg","weight":"200.59","metalCategory":"Metal","row":12,"col":6},
    {"atomicNumber":81,"name":"Thallium","symbol":"Tl","weight":"204.3833","metalCategory":"Metal","row":13,"col":6},
    {"atomicNumber":82,"name":"Lead","symbol":"Pb","weight":"207.2","metalCategory":"Metal","row":14,"col":6},
    {"atomicNumber":83,"name":"Bismuth","symbol":"Bi","weight":"208.9804","metalCategory":"Metal","row":15,"col":6},
    {"atomicNumber":84,"name":"Polonium","symbol":"Po","weight":"(209)","metalCategory":"Metalloid","row":16,"col":6},
    {"atomicNumber":85,"name":"Astatine","symbol":"At","weight":"(210)","metalCategory":"Nonmetal","row":17,"col":6},
    {"atomicNumber":86,"name":"Radon","symbol":"Rn","weight":"(222)","metalCategory":"Nonmetal","row":18,"col":6},
    {"atomicNumber":87,"name":"Francium","symbol":"Fr","weight":"(223)","metalCategory":"Metal","row":1,"col":7},
    {"atomicNumber":88,"name":"Radium","symbol":"Ra","weight":"(226)","metalCategory":"Metal","row":2,"col":7},
    {"atomicNumber":"89-103","name":"","symbol":"","weight":"","metalCategory":"Metal","row":3,"col":7},
    {"atomicNumber":89,"name":"Actinium","symbol":"Ac","weight":"(227)","metalCategory":"Metal","row":4,"col":10},
    {"atomicNumber":90,"name":"Thorium","symbol":"Th","weight":"232.03806","metalCategory":"Metal","row":5,"col":10},
    {"atomicNumber":91,"name":"Protactinium","symbol":"Pa","weight":"231.0588","metalCategory":"Metal","row":6,"col":10},
    {"atomicNumber":92,"name":"Uranium","symbol":"U","weight":"238.02891","metalCategory":"Metal","row":7,"col":10},
    {"atomicNumber":93,"name":"Neptunium","symbol":"Np","weight":"(237)","metalCategory":"Metal","row":8,"col":10},
    {"atomicNumber":94,"name":"Plutonium","symbol":"Pu","weight":"(244)","metalCategory":"Metal","row":9,"col":10},
    {"atomicNumber":95,"name":"Americium","symbol":"Am","weight":"(243)","metalCategory":"Metal","row":10,"col":10},
    {"atomicNumber":96,"name":"Curium","symbol":"Cm","weight":"(247)","metalCategory":"Metal","row":11,"col":10},
    {"atomicNumber":97,"name":"Berkelium","symbol":"Bk","weight":"(247)","metalCategory":"Metal","row":12,"col":10},
    {"atomicNumber":98,"name":"Californium","symbol":"Cf","weight":"(251)","metalCategory":"Metal","row":13,"col":10},
    {"atomicNumber":99,"name":"Einstenium","symbol":"Es","weight":"(252)","metalCategory":"Metal","row":14,"col":10},
    {"atomicNumber":100,"name":"Fermium","symbol":"Fm","weight":"(257)","metalCategory":"Metal","row":15,"col":10},
    {"atomicNumber":101,"name":"Mendelevium","symbol":"Md","weight":"(258)","metalCategory":"Metal","row":16,"col":10},
    {"atomicNumber":102,"name":"Nobelium","symbol":"No","weight":"(259)","metalCategory":"Metal","row":17,"col":10},
    {"atomicNumber":103,"name":"Lawrencium","symbol":"Lr","weight":"(262)","metalCategory":"Metal","row":18,"col":10},
    {"atomicNumber":104,"name":"Rutherfordium","symbol":"Rf","weight":"(267)","metalCategory":"Metal","row":4,"col":7},
    {"atomicNumber":105,"name":"Dubnium","symbol":"Db","weight":"(268)","metalCategory":"Metal","row":5,"col":7},
    {"atomicNumber":106,"name":"Seaborgium","symbol":"Sg","weight":"(271)","metalCategory":"Metal","row":6,"col":7},
    {"atomicNumber":107,"name":"Bohrium","symbol":"Bh","weight":"(272)","metalCategory":"Metal","row":7,"col":7},
    {"atomicNumber":108,"name":"Hassium","symbol":"Hs","weight":"(270)","metalCategory":"Metal","row":8,"col":7},
    {"atomicNumber":109,"name":"Meitnerium","symbol":"Mt","weight":"(276)","metalCategory":"Metal","row":9,"col":7},
    {"atomicNumber":110,"name":"Darmstadium","symbol":"Ds","weight":"(281)","metalCategory":"Metal","row":10,"col":7},
    {"atomicNumber":111,"name":"Roentgenium","symbol":"Rg","weight":"(280)","metalCategory":"Metal","row":11,"col":7},
    {"atomicNumber":112,"name":"Copernicium","symbol":"Cn","weight":"(285)","metalCategory":"Metal","row":12,"col":7},
    {"atomicNumber":113,"name":"Nihonium","symbol":"Nh","weight":"(284)","metalCategory":"Metal","row":13,"col":7},
    {"atomicNumber":114,"name":"Flerovium","symbol":"Fl","weight":"(289)","metalCategory":"Metal","row":14,"col":7},
    {"atomicNumber":115,"name":"Moscovium","symbol":"Ms","weight":"(288)","metalCategory":"Metal","row":15,"col":7},
    {"atomicNumber":116,"name":"Livermorium","symbol":"Lv","weight":"(293)","metalCategory":"Metal","row":16,"col":7},
    {"atomicNumber":117,"name":"Tennessine","symbol":"Ts","weight":"(294)","metalCategory":"Nonmetal","row":17,"col":7},
    {"atomicNumber":118,"name":"Oganesson","symbol":"Og","weight":"(294)","metalCategory":"Nonmetal","row":18,"col":7}
];

data.elements = sortBy(data.elements, ['name']);

data.behaviorGroups = [{
        text: 'Move To',
        value: 'moveTo'
    }, {
        text: 'Rotate To',
        value: 'rotateTo'
    }, {
        text: 'Rotate At',
        value: 'rotateAt'
    }, {
        text: 'Zoom To',
        value: 'zoomTo'
    }, {
        text: 'Zoom At',
        value: 'zoomAt'
    }, {
        text: 'Shake',
        value: 'shake'
    }, {
        text: 'Animate',
        value: 'animate'
    }, {
        text: 'Resize',
        value: 'setSize'
    }, {
        text: 'Bounds',
        value: 'bounds'
    }
];

data.lookups.behaviorGroups = {
    'moveTo': 0,
    'rotateTo': 1,
    'rotateAt': 2,
    'zoomTo': 3,
    'zoomAt': 4,
    'shake': 5,
    'animate': 6,
    'setSize': 7,
    'bounds': 8
};

data.lookups.behaviorType = {
    move: data.behaviorGroups[0],
    rotate: data.behaviorGroups[1],
    zoom: data.behaviorGroups[2],
    effect: data.behaviorGroups[4]
};

data.bounds = {
    None: Oculo.Camera.bounds.NONE,
    World: Oculo.Camera.bounds.WORLD,
    WorldEdge: Oculo.Camera.bounds.WORLD_EDGE
};

data.boundsList = [{
        text: 'None',
        value: 'None'
    }, {
        text: 'World',
        value: 'World'
    }, {
        text: 'World Edge',
        value: 'WorldEdge'
}];

data.lookups.boundsList = {
    None: 0,
    World: 1,
    WorldEdge: 2
};

data.duration = {
    '0': 0,
    '0.5': 0.5,
    '1': 1,
    '2': 2,
    '4': 4
};

data.durationList = [{
        text: '0',
        value: '0'
    },{
        text: '0.5',
        value: '0.5'
    },{
        text: '1',
        value: '1'
    },{
        text: '2',
        value: '2'
    },{
        text: '4',
        value: '4'
    }
];

data.lookups.durationList = {
    '0': 0,
    '0.5': 1,
    '1': 2,
    '2': 3,
    '4': 4
};

// Easing
data.ease = {
    'None': '',
    'Power1.easeIn': 'Power1.easeIn',
    'Power1.easeOut': 'Power1.easeOut',
    'Power1.easeInOut': 'Power1.easeInOut',
    'Power2.easeIn': 'Power2.easeIn',
    'Power2.easeOut': 'Power2.easeOut',
    'Power2.easeInOut': 'Power2.easeInOut',
    'Power3.easeIn': 'Power3.easeIn',
    'Power3.easeOut': 'Power3.easeOut',
    'Power3.easeInOut': 'Power3.easeInOut',
    'Power4.easeIn': 'Power4.easeIn',
    'Power4.easeOut': 'Power4.easeOut',
    'Power4.easeInOut': 'Power4.easeInOut',
    'Back.easeIn': 'Back.easeIn',
    'Back.easeOut': 'Back.easeOut',
    'Back.easeInOut': 'Back.easeInOut',
    'Elastic.easeIn': 'Elastic.easeIn',
    'Elastic.easeOut': 'Elastic.easeOut',
    'Elastic.easeInOut': 'Elastic.easeInOut',
    'Bounce.easeIn': 'Bounce.easeIn',
    'Bounce.easeOut': 'Bounce.easeOut',
    'Bounce.easeInOut': 'Bounce.easeInOut',
    'Circ.easeIn': 'Circ.easeIn',
    'Circ.easeOut': 'Circ.easeOut',
    'Circ.easeInOut': 'Circ.easeInOut',
    'Expo.easeIn': 'Expo.easeIn',
    'Expo.easeOut': 'Expo.easeOut',
    'Expo.easeInOut': 'Expo.easeInOut',
    'Sine.easeIn': 'Sine.easeIn',
    'Sine.easeOut': 'Sine.easeOut',
    'Sine.easeInOut': 'Sine.easeInOut'
};

data.easeList = [
    { text: 'None', value: 'None' },
    { text: 'Power1.easeIn', value: 'Power1.easeIn' },
    { text: 'Power1.easeOut', value: 'Power1.easeOut' },
    { text: 'Power1.easeInOut', value: 'Power1.easeInOut' },
    { text: 'Power2.easeIn', value: 'Power2.easeIn' },
    { text: 'Power2.easeOut', value: 'Power2.easeOut' },
    { text: 'Power2.easeInOut', value: 'Power2.easeInOut' },
    { text: 'Power3.easeIn', value: 'Power3.easeIn' },
    { text: 'Power3.easeOut', value: 'Power3.easeOut' },
    { text: 'Power3.easeInOut', value: 'Power3.easeInOut' },
    { text: 'Power4.easeIn', value: 'Power4.easeIn' },
    { text: 'Power4.easeOut', value: 'Power4.easeOut' },
    { text: 'Power4.easeInOut', value: 'Power4.easeInOut' },
    { text: 'Back.easeIn', value: 'Back.easeIn' },
    { text: 'Back.easeOut', value: 'Back.easeOut' },
    { text: 'Back.easeInOut', value: 'Back.easeInOut' },
    { text: 'Elastic.easeIn', value: 'Elastic.easeIn' },
    { text: 'Elastic.easeOut', value: 'Elastic.easeOut' },
    { text: 'Elastic.easeInOut', value: 'Elastic.easeInOut' },
    { text: 'Bounce.easeIn', value: 'Bounce.easeIn' },
    { text: 'Bounce.easeOut', value: 'Bounce.easeOut' },
    { text: 'Bounce.easeInOut', value: 'Bounce.easeInOut' },
    { text: 'Circ.easeIn', value: 'Circ.easeIn' },
    { text: 'Circ.easeOut', value: 'Circ.easeOut' },
    { text: 'Circ.easeInOut', value: 'Circ.easeInOut' },
    { text: 'Expo.easeIn', value: 'Expo.easeIn' },
    { text: 'Expo.easeOut', value: 'Expo.easeOut' },
    { text: 'Expo.easeInOut', value: 'Expo.easeInOut' },
    { text: 'Sine.easeIn', value: 'Sine.easeIn' },
    { text: 'Sine.easeOut', value: 'Sine.easeOut' },
    { text: 'Sine.easeInOut', value: 'Sine.easeInOut' }
];

data.lookups.easeList = {
    'None': 0,
    'Power1.easeIn': 1,
    'Power1.easeOut': 2,
    'Power1.easeInOut': 3,
    'Power2.easeIn': 4,
    'Power2.easeOut': 5,
    'Power2.easeInOut': 6,
    'Power3.easeIn': 7,
    'Power3.easeOut': 8,
    'Power3.easeInOut': 8,
    'Power4.easeIn': 9,
    'Power4.easeOut': 10,
    'Power4.easeInOut': 11,
    'Back.easeIn': 12,
    'Back.easeOut': 13,
    'Back.easeInOut': 14,
    'Elastic.easeIn': 15,
    'Elastic.easeOut': 16,
    'Elastic.easeInOut': 17,
    'Bounce.easeIn': 18,
    'Bounce.easeOut': 19,
    'Bounce.easeInOut': 20,
    'Circ.easeIn': 21,
    'Circ.easeOut': 22,
    'Circ.easeInOut': 23,
    'Expo.easeIn': 24,
    'Expo.easeOut': 25,
    'Expo.easeInOut': 26,
    'Sine.easeIn': 27,
    'Sine.easeOut': 28,
    'Sine.easeInOut': 29
};

data.fields = {
    duration: {
        tag: 'input',
        type: 'number'
    },
    easeIn: {
        tag: 'select'
    },
    easeOut: {
        data: com.greensock.easing,
        tag: 'select'
    },
    intensity: {
        tag: 'input',
        type: 'number'
    },
    origin: {
        tag: 'input',
        type: 'text'
    },
    position: {
        tag: 'input',
        type: 'text'
    },
    rotation: {
        tag: 'input',
        type: 'text'
    },
    zoom: {
        tag: 'input',
        type: 'number'
    }
};

// Shake
data.shakeDirection = {
    'Both': 0,
    'Horizontal': 1,
    'Vertical': 2
};

data.shakeDirectionList = [
    { text: 'Both', value: 'Both' }, 
    { text: 'Horizontal', value: 'Horizontal' },
    { text: 'Vertical', value: 'Vertical' }
];

data.lookups.shakeDirectionList = {
    'Both': 0,
    'Horizontal': 1,
    'Vertical': 2
};

data.shakeIntensity = {
    '0': 0,
    '0.01': 0.01,
    '0.03': 0.03,
    '0.05': 0.05,
    '0.1': 0.1,
    '0.2': 0.2
};

data.shakeIntensityList = [
    { text: '0', value: '0' }, 
    { text: '0.01', value: '0.01' }, 
    { text: '0.03', value: '0.03'}, 
    { text: '0.05', value: '0.05'}, 
    { text: '0.1', value: '0.1' }, 
    { text: '0.2', value: '0.2' }
];

data.lookups.shakeIntensityList = {
    '0.01': 0,
    '0.01': 1,
    '0.03': 2,
    '0.05': 3,
    '0.1': 4,
    '0.2': 5
};

// Target
data.target = {
    '#box100': '#box100',
    '200,200': { x:200, y:200 }
};

data.elements.forEach((item) => {
    if (item.name) {
        data.target[item.name] = '#' + item.name;
    }
});

data.targetList = [];

data.elements.forEach((item) => {
    if (item.name) {
        data.targetList.push({ text: item.name, value: item.name });
    }
});

data.lookups.targetList = {};

data.targetList.forEach((item, index) => {
    data.lookups.targetList[item.value] = index;
});

// Origin
data.origin = {
    'Auto': 'auto'
};

data.elements.forEach((item) => {
    if (item.name) {
        data.origin[item.name] = '#' + item.name;
    }
});

data.originList = [{ text: 'Auto', value: 'auto'}];

data.elements.forEach((item) => {
    if (item.name) {
        data.originList.push({ text: item.name, value: item.name });
    }
});

data.lookups.originList = {};

data.originList.forEach((item, index) => {
    data.lookups.originList[item.value] = index;
});

export default data;