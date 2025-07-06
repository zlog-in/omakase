import { env, name, OFTData} from "./const";
import fs from 'fs';
import path from 'path';
import * as constants from "./const"

const ADDRESS_PATH = "./config/contracts.json"


export async function saveContractAddress(env: env, network: string, name: name, address: string) {
    if (fs.existsSync(ADDRESS_PATH)) {
        const data = fs.readFileSync(ADDRESS_PATH, 'utf-8');
        const oftAddress: OFTData = JSON.parse(data);
        if (!oftAddress[env]) {
            oftAddress[env] = {}
        }
        if (!oftAddress[env][network]) {
            oftAddress[env][network] = {}
        }
        oftAddress[env][network][name] = address;
        fs.writeFileSync(ADDRESS_PATH, JSON.stringify(oftAddress, null, 2));
        console.log(`Address of ${name} saved for ${name} on ${env} ${network}`)
    } else {
        throw new Error("Address file not found")
    }
 }

export async function loadContractAddress(env: env, network: string, name: name) {
 
    if (fs.existsSync(ADDRESS_PATH)) {
        const data = fs.readFileSync(ADDRESS_PATH, 'utf-8');
        const oftAddress: OFTData = JSON.parse(data);
        
        if (oftAddress[env][network][name]) {
            return oftAddress[env][network][name]
        } else {
            throw new Error(`Address for ${name} not found on ${env} ${network}`)
        }
        
    }
}

export function getLayerZeroScanLink(hash: string, isTestnet = true) {
        console.log(isTestnet ? `https://testnet.layerzeroscan.com/tx/${hash}` : `https://layerzeroscan.com/tx/${hash}`)
}

export function getLzConfig(network: string) {
    return constants.LZ_CONFIG[network]
}