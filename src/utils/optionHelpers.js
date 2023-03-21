export const JobTypeOptions = [
    { label: 'Gypsum', value: 'GYPSUM' },
    { label: 'Painter', value: 'PAINTER' },
    { label: 'Carpenter', value: 'CARPENTER' },
    { label: 'Electrical', value: 'ELECTRICAL' },
    { label: 'Mason', value: 'MASON' },
    { label: 'Bar Bender', value: 'BAR_BENDER' },
    { label: 'Shuttering Carpenter', value: 'SHUTTERING_CARPENTER' },
    { label: 'Welder Fitter', value: 'WELDER_FITTER' },
    { label: 'General Helper', value: 'GENERAL_HELPER' },
    { label: 'Hvac', value: 'HVAC' },
    { label: 'Plumbing', value: 'PLUMBING' },
    { label: 'Aluminium Fabricator', value: 'ALUMINIUM_FABRICATOR' },
    { label: 'Stone Tile Marble Layer', value: 'STONE_TILE_MARBLE_LAYER' },
]

export const tags = {
    CARPENTER: ['Modular Furniture', 'Wooden Doors & Windows', 'Solid Wood Furniture', 'Plywood Furniture'],
    BAR_BENDER: ['Manual Barbending', 'Barbending Machine Operator'],
    GENERAL_HELPER: ['Housekeeping', 'Loading/Offloading'],
    ALUMINIUM_FABRICATOR: ['Windows & Doors', 'Partition Works'],
    WELDER_FITTER: ['Structural Fabrication', 'Pre-Engineered Building Structures'],
    PAINTER: [
        'Internal Painting - Plain',
        'External Painting - High Rise',
        'Stucco Painting',
        'Internal Decorative/Texture Painting',
        'Polish & Varnish',
        'Metal Painting',
        'PU/Duco Painting',
    ],
    MASON: [
        'Slab/Column Casting',
        'Concreting/Foundation - PCC/RCC/RMC',
        'External Plastering - High Rise',
        'AAC Blockwork',
        'Brickwork',
        'Plastering',
    ],
    STONE_TILE_MARBLE_LAYER: [
        'Floor & Wall Tiling',
        'Granite & Stone Works',
        'Marble Laying',
        'Intricate Flooring/Wall Stone Works',
    ],
    ELECTRICAL: [
        'Internal Wiring & Terminations',
        'High Side - Panel Erection & Commissioning',
        'Transformer & Switchgear',
        'Low Voltage Works',
    ],
    GYPSUM: ['Drywall Partition', 'False Ceiling', 'Gypsum Punning', 'Decorative Gypsum Works'],
    HVAC: [
        'VRV Works',
        'Duct Fabrication & Erection',
        'DX Works',
        'Ducting Insulation',
        'AHU Erection & Commissioning',
    ],
    PLUMBING: [
        'Internal Plumbing',
        'External Plumbing - High Rise',
        'Fixtures Installation',
        'Pumps Erection & Commissioning',
    ],
    SHUTTERING_CARPENTER: [
        'Aluminium Formwork',
        'Steel Formwork',
        'Plywood Formwork',
        'Fabric Formwork',
        'Timber Formwork',
        'Plastic Formwork',
    ],
}

export const ShiftTime = [
    {
        label: 'Select Shift Time',
        value: 'none',
    },
    {
        label: '9am-6pm',
        value: '9am-6pm',
    },
    {
        label: '6pm-12am',
        value: '6pm-12am',
    },
    {
        label: 'Other',
        value: 'other',
    },
]

export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
}

// Object.keys(object).map((key) => {
//     return {
//         label: object[key]
//             .split('_')
//             .join(' ')
//             .toLowerCase()
//             .replace(/\b\w/g, (l) => l.toUpperCase()),
//         value: object[key],
//     }
// })
