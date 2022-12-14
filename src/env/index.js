import { DevEnvConfig } from './dev'
import { ProdEnvConfig } from './prod'
import { StageEnvConfig } from './stage'

//removing default value until migrating to new GKE cluster
export const VITE_PUBLIC_APP_ENV = import.meta.env.VITE_PUBLIC_APP_ENV ?? 'STAGE'

const AppEnvConfig = {
    DEV: DevEnvConfig,
    STAGE: StageEnvConfig,
    PROD: ProdEnvConfig,
}
export const envs = AppEnvConfig[VITE_PUBLIC_APP_ENV]
