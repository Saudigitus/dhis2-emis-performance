import { atom } from "recoil";


export const AllTeisSchema = atom<string[]>({
    key: 'all-teis-schema',
    default: []
})