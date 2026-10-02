'use strict';
const fixture=body=>'<!doctype html><html lang="en"><head><title>Test</title></head><body><main>'+body+'</main></body></html>';
const has=(body,rule)=>AccessProof.scan(fixture(body)).issues.some(x=>x.rule===rule);
const cases=[
 ['missing alt found',()=>has('<img src="missing.png">','image-alt')],
 ['decorative image not flagged',()=>!has('<img alt="">','image-alt')],
 ['explicit label accepted',()=>!has('<label for="email">Email</label><input id="email">','control-label')],
 ['placeholder not treated as label',()=>has('<input placeholder="Email">','control-label')],
 ['hidden ancestor excluded',()=>!has('<div hidden><img><input><button></button></div>','image-alt')],
 ['aria-labelledby resolves meaningful text',()=>!has('<span id="name">Search</span><input aria-labelledby="name">','control-label')],
 ['empty explicit label not accepted',()=>has('<label for="email"></label><input id="email">','control-label')],
 ['image-only button gets image name',()=>!has('<button><img alt="Search"></button>','button-name')],
 ['duplicate id reported',()=>has('<input id="same" aria-label="First"><input id="same" aria-label="Second">','duplicate-id')],
 ['untitled iframe prompts a name',()=>has('<iframe src="https://example.invalid"></iframe>','frame-title')],
 ['heading skip is review not certificate failure',()=>has('<h1>Main</h1><h3>Section</h3>','heading-order')],
 ['hidden source script stays inert',()=>{delete globalThis.accessproofInjected;AccessProof.scan(fixture('<script>globalThis.accessproofInjected=true</script>'));return !globalThis.accessproofInjected}],
 ['review identity survives an unrelated new issue',()=>{const old=AccessProof.scan(fixture('<img src="one">'));const issue=old.issues.find(x=>x.rule==='image-alt');issue.reviewed=true;issue.note='Discuss alt with author';const next=AccessProof.merge(AccessProof.scan(fixture('<input><img src="one">')),old);const same=next.issues.find(x=>x.rule==='image-alt');return same.id===issue.id&&same.reviewed&&same.note===issue.note}],
 ['changed element evidence resets review',()=>{const old=AccessProof.scan(fixture('<img src="one">'));old.issues[0].reviewed=true;old.issues[0].note='Old evidence';const next=AccessProof.merge(AccessProof.scan(fixture('<img src="two">')),old);return !next.issues[0].reviewed&&!next.issues[0].note}],
 ['JSON import recomputes findings instead of trusting supplied rules',()=>{const report=AccessProof.restore({source:fixture('<input>'),issues:[{id:'fake',rule:'fake',reviewed:true,note:'False finding'}]});return report.issues.some(x=>x.rule==='control-label')&&!report.issues.some(x=>x.rule==='fake')}],
 ['comparison records disappeared source findings',()=>{const old=AccessProof.scan(fixture('<img>')),next=AccessProof.scan(fixture('<img alt="">'));const delta=AccessProof.compare(old,next);return delta.resolved.length===1&&delta.added.length===0}],
 ['exports retain human decisions and full source',()=>{const report=AccessProof.scan(fixture('<img>'));report.issues[0].note='Ask volunteer for informative alt';report.issues[0].reviewed=true;const md=AccessProof.markdown(report);return md.includes(report.issues[0].note)&&md.includes('Reviewed by local user: yes')&&md.includes('> <!doctype html>')}],
 ['unquoted language valid and commented fake language ignored',()=>{const valid=AccessProof.scan('<html lang=en><title>Test</title><main></main></html>'),bad=AccessProof.scan('<!-- <html lang="en"> --><html><title>Test</title></html>');return !valid.issues.some(x=>x.rule==='document-lang')&&bad.issues.some(x=>x.rule==='document-lang')}]
];
const results=cases.map(([name,check])=>{try{return {name,pass:!!check()}}catch(e){return {name,pass:false,error:e.message}}});
globalThis.regression={passed:results.filter(x=>x.pass).length,total:results.length,results};document.getElementById('result').textContent=JSON.stringify(regression,null,2);
