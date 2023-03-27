import Analytics from 'analytics'
import segmentPlugin from '@analytics/segment'
import { envs } from '../env'

export const analytics = Analytics({
    app: 'awesome-app',
    plugins: [
        segmentPlugin({
            writeKey: envs.SEGMENT_KEY,
        }),
    ],
})
