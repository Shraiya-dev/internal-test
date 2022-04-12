export const JobTypeOptions = [
    { label: 'Select Job Type', value: 'none' },
    { label: 'Carpenter', value: 'CARPENTER' },
    { label: 'Bar Bender', value: 'BAR_BENDER' },
    { label: 'General Helper', value: 'GENERAL_HELPER' },
    { label: 'Aluminium Fabricator', value: 'ALUMINIUM_FABRICATOR' },
    { label: 'Welder - Fitter', value: 'WELDER_FITTER' },
    { label: 'Painter', value: 'PAINTER' },
    { label: 'Mason', value: 'MASON' },
    { label: 'Stone/Tile/Marble Layer', value: 'STONE_TILE_MARBLE_LAYER' },
    { label: 'Electrical', value: 'ELECTRICAL' },
    { label: 'Gypsum', value: 'GYPSUM' },
    { label: 'HVAC', value: 'HVAC' },
    { label: 'Plumbing', value: 'PLUMBING' },
    { label: 'Shuttering Carpenter', value: 'SHUTTERING_CARPENTER' },
]

export const shiftTimingOptions = [
    { label: 'Select Shift Timing', value: 'none' },
    { label: '9am-6pm', value: '9am-6pm' },
    { label: '6pm-12am', value: '6pm-12am' },
    { label: 'other', value: 'other' },
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

export const bookingDurations = ['less than 7 days', '7 days to 45 days', '45 days to 90 days', 'more than 90 days']

export const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

export const overTimeBufferTypeOptions = [
    { label: 'Minutes', value: 'minutes' },
    { label: 'Hours', value: 'hours' },
]
