import { DevEnvConfig } from './dev'
import { ProdEnvConfig } from './prod'
import { StageEnvConfig } from './stage'

const VITE_PUBLIC_APP_ENV = import.meta.env.VITE_PUBLIC_APP_ENV ?? 'DEV'

const AppEnvConfig = {
    DEV: DevEnvConfig,
    STAGE: StageEnvConfig,
    PROD: ProdEnvConfig,
}
export const envs = AppEnvConfig[VITE_PUBLIC_APP_ENV]
