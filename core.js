(function(root){
 'use strict';
 const text=n=>n?.textContent?.trim()||'';
 function hidden(n){for(let p=n;p?.nodeType===1;p=p.parentElement)if(p.hasAttribute('hidden')||p.hasAttribute('inert')||p.getAttribute('aria-hidden')==='true'||/display\s*:\s*none|visibility\s*:\s*hidden/i.test(p.getAttribute('style')||''))return true;return false;}
 function readable(n){if(!n||hidden(n))return '';if(n.nodeType===3)return n.textContent;return [...n.childNodes].map(readable).join(' ').trim();}
 function name(n,doc){
  const references=(n.getAttribute('aria-labelledby')||'').trim().split(/\s+/).filter(Boolean);
  if(references.length){const resolved=references.map(id=>doc.getElementById(id)).map(text).join(' ').trim();if(resolved)return resolved;}
  if(n.getAttribute('aria-label')?.trim())return n.getAttribute('aria-label').trim();
  const labels=[...(n.id?doc.querySelectorAll('label[for="'+CSS.escape(n.id)+'"]'):[]),...(n.closest('label')?[n.closest('label')]:[])].map(text).join(' ').trim();if(labels)return labels;
  if(n.tagName==='INPUT'&&['button','submit','reset','image'].includes(n.type))return n.type==='image'?n.getAttribute('alt')?.trim()||'':n.value.trim()||(['submit','reset'].includes(n.type)?n.type:'');
  if(['BUTTON','A'].includes(n.tagName))return readable(n)||[...n.querySelectorAll('img[alt]')].filter(x=>!hidden(x)).map(x=>x.getAttribute('alt').trim()).join(' ')||n.getAttribute('title')?.trim()||'';
  return n.getAttribute('title')?.trim()||'';
 }
 function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16);}
 function location(n){const parts=[];for(let p=n;p?.tagName;p=p.parentElement){const siblings=p.parentNode?.children?[...p.parentNode.children].filter(x=>x.tagName===p.tagName):[];parts.unshift(p.tagName.toLowerCase()+(siblings.length>1?':nth-of-type('+(siblings.indexOf(p)+1)+')':''));}return parts.join(' > ')||'document';}
 function scan(input,lang='en'){
  lang=lang==='zh'?'zh':'en';
  const source=String(input||'');if(!source.trim())throw Error('empty');if(source.length>100000)throw Error('size');
  const template=document.createElement('template');template.innerHTML=source;
  const doc=template.content,issues=[],say=(z,e)=>lang==='zh'?z:e;
  const keyCounts=new Map();
  const add=(rule,node,title,why,fix,severity='error')=>{const full=node?.outerHTML||'',base=rule+'-'+hash(full),ordinal=keyCounts.get(base)||0;keyCounts.set(base,ordinal+1);issues.push({id:base+'-'+ordinal,rule,severity,title,why,fix,evidence:full.slice(0,800),truncated:full.length>800,selector:location(node),reviewed:false,note:''});};
  const metadata=source.replace(/<!--[\s\S]*?-->/g,'').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,'');
  const html=metadata.match(/<html\b[^>]*>/i)?.[0]||'',language=html.match(/\s+lang\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  if(!language||!language.slice(1).some(x=>x?.trim()))add('document-lang',null,say('页面缺少语言','Document language missing'),say('屏幕阅读器需要知道文本语言。','Screen readers need the document language.'),'<html lang="en">');
  if(!text(doc.querySelector('title')))add('document-title',null,say('页面标题为空','Page title missing'),say('浏览器标签和辅助技术需要有意义的标题。','Tabs and assistive tools need a meaningful page title.'),'<title>Describe this page</title>');
  for(const img of doc.querySelectorAll('img'))if(!hidden(img)&&!img.hasAttribute('alt'))add('image-alt',img,say('图片缺少替代文本','Image has no alt attribute'),say('为有信息的图片描述内容；装饰图片使用空 alt。','Describe informative images; use empty alt for decoration.'),'<img src="..." alt="Describe what matters">');
  for(const input of doc.querySelectorAll('input,select,textarea')){if(input.type==='hidden'||hidden(input)||['button','submit','reset','image'].includes(input.type))continue;if(!name(input,doc)){const placeholder=!!input.getAttribute('placeholder')?.trim();add('control-label',input,placeholder?say('仅有占位符，需检查持久标签','Placeholder-only field needs a persistent label'):say('表单控件缺少标签','Form control has no label'),placeholder?say('占位符可能提供可访问名称，但输入后会消失；请检查可见且持久的标签。','A placeholder can provide a name, but disappears during input. Review the persistent visible label.'):say('控件需要说明用途的可访问名称。','The control needs an accessible name describing its purpose.'),'<label for="field">Field name</label>\n<input id="field">',placeholder?'review':'error');}}
  for(const button of doc.querySelectorAll('button,input[type="button"],input[type="submit"],input[type="reset"],input[type="image"]'))if(!hidden(button)&&!name(button,doc))add('button-name',button,say('按钮缺少名称','Button has no name'),say('图标按钮也需要可读名称。','Icon buttons need a readable name.'),'<button aria-label="Describe action">...</button>');
  const ids=new Set();for(const n of doc.querySelectorAll('[id]')){if(ids.has(n.id))add('duplicate-id',n,say('重复的 ID','Duplicate identifier'),say('重复 ID 可能破坏标签或 ARIA 引用。','Repeated IDs can break label and ARIA references.'),say('为元素设置唯一 ID，并同步引用。','Assign a unique ID and update references.'),'review');ids.add(n.id);}
  for(const frame of doc.querySelectorAll('iframe'))if(!hidden(frame)&&!frame.getAttribute('title')?.trim()&&!name(frame,doc))add('frame-title',frame,say('嵌入页面缺少名称','Embedded frame has no name'),say('提供标题以说明嵌入内容的用途。','Name the embedded content so users can identify its purpose.'),'<iframe title="Describe embedded content">...</iframe>');
  for(const link of doc.querySelectorAll('a[href]'))if(!hidden(link)&&!name(link,doc))add('link-name',link,say('链接缺少名称','Link has no name'),say('链接需要说明目的地。','A link needs an identifiable destination.'),'<a href="...">Describe the destination</a>');
  let level=0;for(const heading of doc.querySelectorAll('h1,h2,h3,h4,h5,h6')){if(hidden(heading))continue;const next=Number(heading.tagName[1]);if(level&&next>level+1)add('heading-order',heading,say('标题层级可能跳跃','Heading level skips a step'),say('检查层级是否准确表达内容结构。','Review whether heading levels reflect the content structure.'),say('检查前后标题，选择符合层级的级别。','Review adjacent headings and use the appropriate level.'),'review');level=next;}
  if(!doc.querySelector('main,[role="main"]'))add('main-landmark',null,say('建议设置主要内容区域','Main landmark not found'),say('主要内容区域有助于定位页面。','A main landmark helps users navigate the page.'),'<main>...</main>','review');
  return {version:3,lang,source,issues};
 }
 function merge(next,old){if(!old||!Array.isArray(old.issues))return next;for(const issue of next.issues){const prev=old.issues.find(x=>x?.id===issue.id&&x.evidence===issue.evidence&&x.rule===issue.rule)|| (old.version<3?old.issues.find(x=>x?.evidence===issue.evidence&&x.rule===issue.rule):null);if(prev){issue.note=typeof prev.note==='string'?prev.note.slice(0,3000):'';issue.reviewed=prev.reviewed===true;}}return next;}
 function restore(saved,lang){if(!saved||typeof saved.source!=='string'||saved.source.length>100000)throw Error('invalid');return merge(scan(saved.source,lang||saved.lang),saved);}
 function compare(before,after){const old=before?.issues||[];return {resolved:old.filter(x=>!after.issues.some(y=>y.id===x.id)),added:after.issues.filter(x=>!old.some(y=>y.id===x.id)),retained:after.issues.filter(x=>old.some(y=>y.id===x.id))};}
 function markdown(report){return '# AccessProof — static HTML preflight\n\nNot a compliance certificate. Test the rendered page and keyboard behavior separately.\n\n'+report.issues.map(x=>`## ${x.title}\n\nRule: ${x.rule}\nLocation: ${x.selector}\nReviewed by local user: ${x.reviewed?'yes':'no'}\nDecision: ${x.note||'Unrecorded'}\n\n${x.why}\n\nEvidence${x.truncated?' (excerpt)':''}:\n\n\`\`\`html\n${x.evidence}\n\`\`\`\n\nSuggested pattern:\n\n\`\`\`html\n${x.fix}\n\`\`\`\n`).join('\n')+'\n## Full source\n\n'+report.source.split('\n').map(x=>'> '+x).join('\n')+'\n';}
 root.AccessProof={scan,markdown,merge,restore,compare};
})(globalThis);
