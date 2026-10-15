import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {brotliCompress,gzip,constants} from 'node:zlib';
import {promisify} from 'node:util';
const br=promisify(brotliCompress),gz=promisify(gzip);
const cache=new Map();
/** @param {string|undefined} header */
export function encodingFor(header){const accepted=new Map((header??'').toLowerCase().split(',').map(part=>{const [name,...params]=part.trim().split(';');const raw=params.find(p=>p.trim().startsWith('q='));const quality=raw?Number(raw.trim().slice(2)):1;return [name,Number.isFinite(quality)&&quality>=0&&quality<=1?quality:0];}));const quality=name=>accepted.get(name)??accepted.get('*')??0;return quality('br')>0&&quality('br')>=quality('gzip')?'br':quality('gzip')>0?'gzip':'identity';}
/** @param {string} file @param {string} mime @param {string|undefined} accepted */
export async function readAsset(file,mime,accepted){const info=await stat(file);const version=info.mtimeMs+':'+info.size;let entry=cache.get(file);if(!entry||entry.version!==version){const raw=await readFile(file);entry={version,variants:new Map([['identity',raw]])};cache.set(file,entry);if(cache.size>160)cache.delete(cache.keys().next().value);}
const encoding=mime.startsWith('text/')?encodingFor(accepted):'identity';let data=entry.variants.get(encoding);if(!data){const raw=entry.variants.get('identity');data=encoding==='br'?await br(raw,{params:{[constants.BROTLI_PARAM_QUALITY]:4}}):await gz(raw,{level:6});entry.variants.set(encoding,data);}
return {data,encoding,etag:'"'+createHash('sha256').update(data).digest('hex')+'"'};}
