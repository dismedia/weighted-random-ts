import { distributionFactory, PoolSize, Weight } from "./weightedRandom/weightedRandomDistribution";


export type Rng = Iterator<number,number>

export type WeightedRandomDistribution = <T>(elements: T[], probability: (element: T) => Weight) => {
    next: (random?: number) => T
    add: (elements: T[]) => PoolSize
    remove: (elements: T[]) => PoolSize
    reevaluate: () => PoolSize

}

export const weightedRandom = distributionFactory;