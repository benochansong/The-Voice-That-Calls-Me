// The order is the game's existing beat order: village -> rooftop -> Levi -> hillside, etc.
const orderedBeats=Object.keys({...beats,...laterBeats});
const replayChapters=[
 {title:'서막 · 별빛 아래의 목자들'},
 {title:'1장 · 물을 담은 손',start:null,spawn:[0,17],end:'evening'},
 {title:'2장 · 지붕에서 내려온 자리',start:'doorway',spawn:[0,7],end:'dusk'},
 {title:'3장 · 맨 뒤에 앉은 사람',start:'climb',spawn:[0,7],end:'hillEnd'},
 {title:'4장 · 배가 흔들리는 밤',start:'boarding',spawn:[0,3.6],end:'fourthEnd'},
 {title:'5장 · 길가에서 들린 이름',start:'neighbor',spawn:[0,5.8],end:'fifthEnd'},
 {title:'6장 · 성으로 들어가는 길',start:'ridge',spawn:[0,7],end:'sixthEnd'},
 {title:'7장 · 빈자리 곁에서',start:'upperDoor',spawn:[0,6],end:'seventhEnd'},
 {title:'8장 · 정원에서 아침 식탁까지',start:'gardenDawn',spawn:[0,5.7],end:'credits'}
];
const choicesByChapter=[
 [],
 [{label:'장터에서 뒤처진 아이',start:null,spawn:[4.7,-1.3],field:'child',values:{true:'아이와 동행'},miss:'아이를 지나침'}],
 [{label:'레위의 식탁에서 쉴 자리',start:'seat',spawn:[0,-1.5],field:'tableSeat',values:{court:'안뜰',bowl:'물그릇 곁'}}],
 [{label:'언덕 아래 아이의 목소리',start:'climb',spawn:[3.7,4.6],field:'hillChild',values:{true:'함께 올라감'},miss:'혼자 올라감'}],
 [{label:'풍랑 속에서 머물 자리',start:'gale',spawn:[0,.8],field:'shelter',values:{rope:'밧줄 곁',feet:'제자 곁'},miss:'그 자리에서 기다림'},
  {label:'야이로의 딸과 혈루증 여인',start:'shoreRest',spawn:[-1.65,.3],field:'shoreMemory',values:{true:'들었음'},miss:'지나친 기억'}],
 [{label:'모닥불의 잃은 양 비유',start:'embers',spawn:[-3.3,1.7],field:'lostParable',values:{true:'들었음'},miss:'지나친 비유'}],
 [{label:'예루살렘 입성 행렬',start:'procession',spawn:[-1,2],field:'entryView',values:{crowd:'군중 곁',colt:'나귀 곁'}}],
 [{label:'마지막 식사를 지켜볼 자리',start:'mealPlace',spawn:[0,1],field:'mealView',values:{door:'문간',table:'식탁 곁'}},
  {label:'재판 전 두 등불',start:'passionChoice',spawn:[0,4.6],field:'passionView',values:{brief:'짧게 보기',full:'전체 보기'}}],
 [{label:'마지막 아침의 두 자리',start:'lastRest',spawn:[.8,-3.6],field:'restSpot',values:{boat:'배 곁',table:'식탁 곁'}}]
];
function chapterForStep(step){
 const index=orderedBeats.indexOf(step);
 for(let n=replayChapters.length-1;n>=2;n--){
  if(index>=orderedBeats.indexOf(replayChapters[n].start))return n;
 }
 return 1;
}
function reachedChapter(){return save.prologue?0:chapterForStep(save.chapterStep)}
function sceneAvailable(chapter,choice){
 if(chapter!==reachedChapter())return chapter<reachedChapter();
 if(chapter===1)return Boolean(save.child||save.done);
 return orderedBeats.indexOf(save.chapterStep)>=orderedBeats.indexOf(choice.start);
}
function choiceMemory(chapter,choice){
 const saved=choice.values[save[choice.field]];
 if(saved)return '본편 · '+saved;
 if(chapter===reachedChapter()&&save.chapterStep===choice.start)return '본편 · 선택하는 중';
 return '본편 · '+(choice.miss||'기록 없음');
}
function playChapter(chapter,choice){
 if(replaying||save.prologue||chapter>reachedChapter())return;
 if(chapter===0){by('nativityReplay').click();return}
 if(choice&&!sceneAvailable(chapter,choice))return;
 const entry=choice||replayChapters[chapter];
 const checkpoint={x:entry.spawn[0],z:entry.spawn[1],drank:chapter>1||Boolean(choice),done:chapter>1,child:false};
 if(entry.start)checkpoint.chapterStep=entry.start;
 if(save.nativitySeen)checkpoint.nativitySeen=true;
 // Carry only decisions made before this entry. A previously visited optional scene is playable again.
 for(let n=1;n<=chapter;n++){
  for(const prior of choicesByChapter[n]){
   if(n===chapter&&(!choice||prior===choice||orderedBeats.indexOf(prior.start)>=orderedBeats.indexOf(choice.start)))continue;
   if(Object.hasOwn(save,prior.field))checkpoint[prior.field]=save[prior.field];
  }
 }
 history.replaceState({boriReplay:{chapter,checkpoint}},'',location.pathname+location.search+'#chapter-replay');
 location.reload();
}
function replayButton(label,onClick){
 const button=document.createElement('button');button.type='button';button.textContent=label;button.onclick=onClick;return button;
}
function renderChapterEntries(){
 const n=Number(by('chapterList').value),content=by('chapterContents');
 content.replaceChildren(replayButton(n===0?'서막 다시 보기':'이 장 처음부터 플레이',()=>playChapter(n)));
 const choices=choicesByChapter[n].filter(choice=>sceneAvailable(n,choice));
 if(!choices.length)return;
 const heading=document.createElement('h3');heading.textContent='선택 장면에서 시작';content.append(heading);
 for(const choice of choices){
  const row=document.createElement('div'),memory=document.createElement('span');
  row.className='scene-option';memory.textContent=choiceMemory(n,choice);
  row.append(replayButton(choice.label,()=>playChapter(n,choice)),memory);content.append(row);
 }
}
function showJournalSection(section){
 by('book').dataset.section=section;
 by('accessPanel').hidden=section!=='access';
 by('chapterLibrary').hidden=section!=='chapters';
 by('memory').hidden=section!=='memory';
 by('accessButton').setAttribute('aria-expanded',String(section==='access'));
 by('chooseChapter').setAttribute('aria-expanded',String(section==='chapters'));
 by('chooseChapter').textContent=section==='chapters'?'여행 기록 보기':'장 선택';
 by('accessButton').textContent=section==='access'?'설정 닫기':'접근성 설정';
 by('book').scrollTop=0;
}
function setChapterLibrary(open){
 showJournalSection(open?'chapters':'memory');
 if(open){
  const reached=reachedChapter(),list=by('chapterList');
  list.replaceChildren();
  for(let n=0;n<=reached;n++)list.add(new Option(replayChapters[n].title,String(n)));
  list.value=String(reached);renderChapterEntries();list.focus();
 }
}
function prepareChapterMenu(){
 setChapterLibrary(false);
 by('chooseChapter').hidden=replaying||Boolean(save.prologue);
 by('restart').hidden=replaying;
 by('leaveReplay').hidden=!chapterReplay;
 if(chapterReplay)by('book').querySelector('h2').textContent=replayChapters[chapterReplay.chapter].title+' · 다시 플레이';
}
function showReplayExitHint(){
 const s=save.chapterStep;
 if(s!==replayChapters[chapterReplay.chapter].end)return;
 const cue=(laterBeats[s]||beats[s]);
 if(s==='credits'||distance(cue[0],cue[1])<1.45)by('hint').textContent='E · 이 장을 마치고 원래 여정으로 돌아가기';
}
by('leaveReplay').onclick=()=>restoreMainJournal();
by('accessButton').onclick=()=>showJournalSection(by('accessPanel').hidden?'access':'memory');
by('chooseChapter').onclick=()=>setChapterLibrary(by('chapterLibrary').hidden);
by('chapterList').onchange=renderChapterEntries;
if(chapterReplay)by('menu').textContent='다시 플레이 · 여행 수첩';
