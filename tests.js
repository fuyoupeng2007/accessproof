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
 ['hidden source script stays inert',()=>{delete globalThis.accessproofInjected;AccessProof.scan(fixture('<script>globalThis.accessproofInjected=true</script>'));return !globalThis.accessproofInjected}]
];
const results=cases.map(([name,check])=>{try{return {name,pass:!!check()}}catch(e){return {name,pass:false,error:e.message}}});
globalThis.regression={passed:results.filter(x=>x.pass).length,total:results.length,results};document.getElementById('result').textContent=JSON.stringify(regression,null,2);
