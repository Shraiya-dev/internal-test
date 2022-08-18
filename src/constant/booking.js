export const BookingStates = [
    { label: 'Select Status', value: 'none' },
    { label: 'Received', value: 'RECEIVED' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Allocation pending', value: 'ALLOCATION_PENDING' },
    { label: 'Allocation In Progress', value: 'ALLOCATION_IN_PROGRESS' },
    { label: 'Allocation Closed', value: 'ALLOCATION_CLOSED' },
    { label: 'RTD', value: 'READY_TO_DEPLOY' },
    { label: 'Deployed', value: 'DEPLOYED' },
    { label: 'Cancelled', value: 'CANCELLED' },
]

export const OverTimeFactor = [
    { label: 'Select Over Time Rate', value: 'none' },
    { label: '1', value: 1 },
    { label: '1.5', value: 1.5 },
    { label: '2', value: 2 },
]
export const JobTypeOptions = [
    { label: 'Job Type', value: 'none' },
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

export const BookingTypeOptions = [
    { label: 'Booking Type', value: 'none' },
    { label: 'Discovery', value: 'LIMITED_DISCOVERY' },
    { label: 'FPH', value: 'FPH' },
]

export const BookingDurations = [
    'LESS_THAN_THIRTY',
    'THIRTY_TO_FORTY_FIVE',
    'FORTY_FIVE_TO_NINETY',
    'NINETY_TO_ONE_FIFTY',
]
