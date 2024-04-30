import {max as maxFn} from './max'
import {min as minFn} from './min'

export const minmax = (min: number, value: number, max: number) => minFn(min, maxFn(value, max))
