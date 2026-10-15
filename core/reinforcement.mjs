import {reinforcementGroups} from '../data/reinforcement-links.mjs';
import {isOfficialTechnicalQuestion} from './official-policy.mjs';
/** @param {import('./types.js').Question} original @param {import('./types.js').Question[]} bank @param {Pick<import('./types.js').LearningState,'questions'>} state @param {number} [count] @param {number} [now] */
export function relatedOfficialQuestions(original,bank,state,count=5,now=Date.now()){
 if(!isOfficialTechnicalQuestion(original)||!Number.isInteger(count)||count<1||count>50)return [];
 const links=new Set(reinforcementGroups.filter(g=>g.ids.includes(original.id)).flatMap(g=>g.ids));
 const seen=new Set();
 return bank.filter(q=>{if(q.id===original.id||seen.has(q.id)||!isOfficialTechnicalQuestion(q)||!(links.has(q.id)||q.concept===original.concept))return false;seen.add(q.id);return true;}).sort((a,b)=>{
 /** @param {import("./types.js").Question} q */
 /** @param {import("./types.js").Question} q */
 const rank=q=>{const s=state.questions[q.id];if(!s)return 3;const recent=s.lastSeenAt>now-86400000;return (recent?-4:0)+(s.dueAt<=now?2:0)+(s.recent.slice(-3).some(x=>!x)?1:0);};
 return rank(b)-rank(a)||a.id.localeCompare(b.id);
 }).slice(0,count);
}
