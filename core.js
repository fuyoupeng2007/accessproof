(function(root){
 'use strict';
 const text=n=>n?.textContent?.trim()||'';
 function scan(input,lang='en'){
  const source=String(input||'');if(!source.trim())throw Error('empty');if(source.length>100000)throw Error('size');
  const template=document.createElement('template');template.innerHTML=source;
  const doc=template.content,issues=[],say=(z,e)=>lang==='zh'?z:e;
  const add=(rule,node,title,why,fix,severity='error')=>issues.push({id:rule+'-'+issues.length,rule,severity,title,why,fix,evidence:node?.outerHTML?.slice(0,800)||'',selector:node?.id?'#'+node.id:node?.tagName?.toLowerCase()||'document'});
  if(!/<html\b[^>]*\blang\s*=\s*["'][^"']+["']/i.test(source))add('document-lang',null,say('页面缺少语言','Document language missing'),say('屏幕阅读器需要知道文本语言。','Screen readers need the document language.'),'<html lang="en">');
  if(!text(doc.querySelector('title')))add('document-title',null,say('页面标题为空','Page title missing'),say('浏览器标签和辅助技术需要有意义的标题。','Tabs and assistive tools need a meaningful page title.'),'<title>Describe this page</title>');
  for(const img of doc.querySelectorAll('img'))if(!img.hasAttribute('alt'))add('image-alt',img,say('图片缺少替代文本','Image has no alt attribute'),say('为有信息的图片描述内容；装饰图片使用空 alt。','Describe informative images; use empty alt for decoration.'),'<img src="..." alt="Describe what matters">');
  for(const input of doc.querySelectorAll('input,select,textarea')){if(input.type==='hidden')continue;const labelled=input.getAttribute('aria-label')||input.id&&doc.querySelector('label[for="'+CSS.escape(input.id)+'"]')||input.closest('label');if(!labelled)add('control-label',input,say('表单控件缺少标签','Form control has no label'),say('占位符不能替代可访问名称。','A placeholder does not replace an accessible label.'),'<label for="field">Field name</label>\n<input id="field">');}
  for(const button of doc.querySelectorAll('button'))if(!text(button)&&!button.getAttribute('aria-label'))add('button-name',button,say('按钮缺少名称','Button has no name'),say('图标按钮也需要可读名称。','Icon buttons need a readable name.'),'<button aria-label="Describe action">...</button>');
  if(!doc.querySelector('main,[role="main"]'))add('main-landmark',null,say('建议设置主要内容区域','Main landmark not found'),say('主要内容区域有助于定位页面。','A main landmark helps users navigate the page.'),'<main>...</main>','review');
  return {version:1,lang,source,issues};
 }
 function markdown(report){return '# AccessProof — static HTML preflight\n\nNot a compliance certificate. Test the rendered page and keyboard behavior separately.\n\n'+report.issues.map(x=>`## ${x.title}\n\nRule: ${x.rule}\n\n${x.why}\n\nEvidence:\n\n\`\`\`html\n${x.evidence}\n\`\`\`\n\nSuggested pattern:\n\n\`\`\`html\n${x.fix}\n\`\`\`\n`).join('\n');}
 root.AccessProof={scan,markdown};
})(globalThis);
