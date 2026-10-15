import {officialQuestions} from '../data/official-2024.mjs';
import {aragonQuestions} from '../data/official-aragon.mjs';
import {zaragozaQuestions} from '../data/official-zaragoza.mjs';
const originals=new Map([...officialQuestions,...aragonQuestions,...zaragozaQuestions].filter(q=>q.block!=='I'&&q.answer>=0).map(q=>[q.id,q]));
/** Solo valida contra cuestionarios originales incorporados, no contra una etiqueta «oficial». @param {import('./types.js').Question} question */
export function isOfficialTechnicalQuestion(question){const original=originals.get(question?.id);return Boolean(original&&question.examSet===original.examSet&&question.track===original.track&&question.block===original.block&&question.prompt===original.prompt&&question.answer===original.answer&&Array.isArray(question.options)&&question.options.length===original.options.length&&question.options.every((option,i)=>option===original.options[i]));}
