const MAIN_URL="https://semicolonxss.github.io/Formwheel/";
const firebaseConfig={apiKey:"AIzaSyBreTSe1m0-xlbF4aupnU5isRZCihR25IE",authDomain:"formwheel.firebaseapp.com",databaseURL:"https://formwheel-default-rtdb.firebaseio.com",projectId:"formwheel",storageBucket:"formwheel.firebasestorage.app",messagingSenderId:"431583088241",appId:"1:431583088241:web:74e0e34ea1e3e1170c55d0"};
firebase.initializeApp(firebaseConfig);const db=firebase.database();
const CONFIG={easy:{questions:4,time:180},normal:{questions:3,time:120},hard:{questions:2,time:90}};
const categories={
daily:["학교","병원","도서관","호텔","공원","놀이터","헬스장","화장실","사무실","회의실","회사 로비","공장","창고","학원","유치원","교실","운동장","옥상","세탁소","미용실","찜질방","목욕탕","사우나","캠핑장","놀이방","주차장","지하 주차장","호텔 로비","호텔 수영장","호텔 식당","농장","목장","과수원","온실"],
food:["카페","편의점","식당","마트","백화점","시장","빵집","분식집","패스트푸드점","노래방","야시장","식당 주방","카페 테라스","편의점 창고","마트 계산대","백화점 식품관","시장 골목","경매장","푸드코트","디저트 가게","치킨집","피자집","한식당","중식당","일식당"],
transport:["공항","기차역","지하철역","버스터미널","고속도로 휴게소","주유소","자동차 정비소","세차장","택시 승강장","항구","부두","등대","기차 안","버스 안","지하철 안","비행기 안","배 안","택시 안","엘리베이터","에스컬레이터","계단","공항 관제탑","비행기 격납고","선박 조종실","선박 기관실","철도 관제실","지하철 관제실","터널 관리실"],
culture:["영화관","수영장","PC방","결혼식장","동물원","체육관","수련원","박물관","미술관","과학관","전시회장","공연장","콘서트장","연극장","대학교","오락실","볼링장","당구장","스키장","골프장","야구장","농구장","테니스장","배드민턴장","스케이트장","경기장","탈의실","샤워실","촬영 스튜디오","뉴스룸","편집실","녹음실","무대 뒤편","오페라 극장","발레 연습실","음악 연습실","미술 작업실","조각 작업실","박람회장","컨벤션센터","국제회의장"],
nature:["해변","동굴","폭포","산 정상","등산로","강변","호수","섬","사막","정글","숲","계곡","온천","수족관","동물 보호소","유원지","골프장","농장","목장","과수원","온실"],
special:["경찰서","소방서","약국","은행","우체국","법원","교도소","국회의사당","대법원","헌법재판소","청와대","국립중앙박물관","국립과학수사연구원","기상청","천문대","관측소","연구소","데이터센터","서버실","관제센터","통제실","방송국","대사관","영사관","세관","검역소","발전소","변전소","정수장","하수처리장","폐기물 처리장","냉동 창고","물류센터","우편물 분류장","인쇄소","제철소","공사장"],
chaos:["화장실에서 몰래 통화하는 곳","엄마가 부르는 곳","친구가 돈 빌리는 곳","시험 전날 공부하는 곳","시험 끝나고 후회하는 곳","숙제 안 해서 숨는 곳","몰래 간식 먹는 곳","선생님 몰래 자는 곳","친구가 고백하는 곳","친구랑 싸우는 곳","친구가 삐진 곳","단체사진 찍는 곳","길 잃고 헤매는 곳","휴대폰 찾으러 가는 곳","지갑 두고 오는 곳","우산 잃어버리는 곳","충전기 빌리는 곳","와이파이 찾는 곳","자리 맡아놓고 사라지는 곳","줄 서다가 포기하는 곳","메뉴 고르는데 30분 걸리는 곳","사진만 찍고 나오는 곳","한 명만 늦는 곳","약속 시간에 아무도 없는 곳","친구가 갑자기 춤추는 곳","갑자기 노래 부르는 곳","아무도 안 웃는데 웃긴 곳","어색하게 침묵하는 곳","모두가 휴대폰 보는 곳","갑자기 뛰어가는 곳","비 오는 날 우산 없는 곳","양말 젖는 곳","신발 벗고 후회하는 곳","배고픈 사람이 많은 곳","다이어트 실패하는 곳","돈이 순식간에 사라지는 곳","계획 없이 들어가는 곳","나오고 나서 후회하는 곳","친구가 길을 잘못 알려준 곳","부모님에게 들키면 안 되는 곳","친구가 비밀을 말하는 곳","몰래 간식 사는 곳","갑자기 사람이 몰리는 곳","줄이 제일 긴 곳","시간이 멈춘 것 같은 곳","나가기 싫어지는 곳","집에 가고 싶은 곳","집에 가기 싫은 곳","친구가 갑자기 사라지는 곳","아무도 목적을 모르는 곳","당신은 라이어입니다","라이어","Formwheel","오류 404"]
};
let roomCode="",myId="",myName="",isHost=false,roomRef=null,roomData=null,localRole="",localSecret="",selectedVote="",timerHandle=null,joined=false;
const getParam=()=>{let s=location.search;if(s.startsWith("?="))return s.slice(2,8).toUpperCase();return new URLSearchParams(s).get("code")?.toUpperCase()||""};
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function goHome(){location.href=MAIN_URL}
function show(id){["home","lobby","game"].forEach(x=>document.getElementById(x).classList.toggle("hidden",x!==id))}
function setStatus(t){document.getElementById("connStatus").textContent=t}
function randCode(){return Math.random().toString(36).slice(2,8).toUpperCase()}
function getId(){let x=localStorage.getItem("formwheel_spy_player_id");if(!x){x="p_"+Math.random().toString(36).slice(2,12);localStorage.setItem("formwheel_spy_player_id",x)}return x}
function allWords(cat){return cat==="all"?Object.values(categories).flat():categories[cat]||categories.daily}
function pickSecret(cat){let a=allWords(cat);return a[Math.floor(Math.random()*a.length)]}
function renderPlayers(){let ps=roomData?.players||{};let arr=Object.values(ps);document.getElementById("count").textContent=arr.length;document.getElementById("players").innerHTML=arr.map(p=>`<div class="player">👤 ${esc(p.name)}${p.id===roomData.hostId?" · HOST":""}</div>`).join("")}
function updateSettings(){if(!roomData)return;let c=CONFIG[roomData.difficulty]||CONFIG.normal;let modeText=roomData.mode==="offline"?"👥 오프라인 · 질문 없음":"🌐 원격 · 질문 가능";document.getElementById("settingsView").innerHTML=`${modeText} · 난이도: <b>${roomData.difficulty==="easy"?"쉬움":roomData.difficulty==="hard"?"어려움":"보통"}</b> · ${roomData.mode==="offline"?"질문 없음":`질문 ${c.questions}회`} · ${c.time}초 · 장소 ${esc(roomData.category==="all"?"전체":roomData.category)}`}
function roomLink(){return location.origin+location.pathname+"?="+roomCode}
function copyRoomLink(){navigator.clipboard?.writeText(roomLink()).then(()=>alert("게임 링크를 복사했어요!")).catch(()=>prompt("이 링크를 복사하세요.",roomLink()))}
function attachRoom(){
 if(roomRef)roomRef.off();roomRef=db.ref("spyRooms/"+roomCode);
 roomRef.child("players/"+myId).onDisconnect().remove();
 roomRef.on("value",snap=>{roomData=snap.val();if(!roomData){setStatus("방이 존재하지 않아요.");return}if(!roomData.players?.[roomData.hostId]||(roomData.phase!=="lobby"&&roomData.phase!=="result"&&(Object.keys(roomData.players||{}).length<3||!roomData.players?.[roomData.spyId]))){
  roomRef.transaction(cur=>{if(!cur)return null;const ids=Object.keys(cur.players||{});if(!ids.length)return null;if(cur.players?.[cur.hostId]&&(cur.phase==="lobby"||cur.phase==="result"||ids.length>=3&&cur.players?.[cur.spyId]))return;cur.hostId=cur.players?.[cur.hostId]?cur.hostId:ids[0];if(cur.phase!=="lobby"&&(ids.length<3||!cur.players?.[cur.spyId])){cur.phase="result";cur.result={type:"disconnect"};}return cur},undefined,false);}
 joined=true;renderPlayers();updateSettings();applyRoomState()});
 db.ref(".info/connected").on("value",s=>setStatus(s.val()?"Firebase 연결됨":"Firebase 연결 끊김"));
}
async function createRoom(){
 myName=document.getElementById("hostName").value.trim();if(!myName)return alert("닉네임을 입력해주세요.");
 roomCode=randCode();myId=getId();isHost=true;
 const difficulty=document.getElementById("difficulty").value,category=document.getElementById("category").value,mode=document.getElementById("gameMode").value;
 const obj={hostId:myId,phase:"lobby",round:0,difficulty,category,mode,players:{},createdAt:firebase.database.ServerValue.TIMESTAMP};
 obj.players[myId]={id:myId,name:myName,joinedAt:firebase.database.ServerValue.TIMESTAMP};
 await db.ref("spyRooms/"+roomCode).set(obj);history.replaceState({}, "", "?="+roomCode);attachRoom();document.getElementById("roomCode").textContent=roomCode;document.getElementById("hostControls").classList.remove("hidden");document.getElementById("guestWait").classList.add("hidden");show("lobby");
}
let joiningRoom=false;
async function joinRoom(){
 if(joiningRoom)return;
 const name=document.getElementById("joinName").value.trim().slice(0,12),code=document.getElementById("roomInput").value.trim().toUpperCase();
 if(!name||!/^[A-Z0-9]{6}$/.test(code))return alert("닉네임과 6자리 방 코드를 입력해주세요.");
 joiningRoom=true;
 try{
  const id=getId(),ref=db.ref("spyRooms/"+code);
  const result=await ref.transaction(cur=>{
   // An empty local cache is not proof that the server room is missing.
   // Returning null lets Firebase compare with the server and retry.
   if(cur===null)return null;
   if(cur.players?.[id])return cur;
   if(cur.phase!=="lobby"||Object.keys(cur.players||{}).length>=20)return;
   cur.players=cur.players||{};
   cur.players[id]={id,name,joinedAt:firebase.database.ServerValue.TIMESTAMP};return cur;
  },undefined,false);
  const data=result.snapshot.val();
  if(!data)return alert("방을 찾을 수 없어요. 방 코드를 확인해주세요.");
  if(!result.committed||!data.players?.[id]){
   if(data.phase!=="lobby")return alert("이미 시작한 방이에요. 호스트가 새 방을 만든 뒤 참가해주세요.");
   if(Object.keys(data.players||{}).length>=20)return alert("방이 가득 찼어요. 최대 20명까지 참가할 수 있어요.");
   return alert("방 상태가 변경되어 참가하지 못했어요. 다시 시도해주세요.");
  }
  myId=id;myName=data.players[id].name;roomCode=code;roomData=data;isHost=data.hostId===id;
  history.replaceState({}, "", "?="+roomCode);attachRoom();applyRoomState();
 }catch(error){
  console.error("Spy room join failed",error);
  const denied=/permission/i.test(error.code||error.message||"");
  alert(denied?"방 접근 권한 오류예요. Firebase Database Rules를 확인해주세요.":"방에 연결하지 못했어요. 연결 상태를 확인하고 다시 시도해주세요.");
 }finally{joiningRoom=false}
}
async function startGame(){
 if(!isHost||Object.keys(roomData.players||{}).length<3)return alert("최소 3명이 필요해요.");
 const ids=Object.keys(roomData.players),spy=ids[Math.floor(Math.random()*ids.length)],secret=pickSecret(roomData.category),c=CONFIG[roomData.difficulty]||CONFIG.normal;
 const roles={};ids.forEach(id=>roles[id]=id===spy?"spy":"citizen");
 const updates={phase:roomData.mode==="offline"?"question":"question",round:(roomData.round||0)+1,secret,spyId:spy,roles,questions:{},votes:{},caught:false,spyGuess:"",result:null,startedAt:firebase.database.ServerValue.TIMESTAMP,endsAt:Date.now()+c.time*1000};
 await roomRef.update(updates);
}
function applyRoomState(){
 if(!roomData)return;document.getElementById("roomCode").textContent=roomCode;updateSettings();
 if(roomData.hostId===myId){isHost=true;document.getElementById("hostControls").classList.toggle("hidden",roomData.phase!=="lobby");}else{isHost=false;document.getElementById("hostControls").classList.add("hidden")}
 if(roomData.phase==="lobby"){document.getElementById("guestWait").classList.toggle("hidden",isHost);show("lobby");return}
 if(roomData.phase==="question"||roomData.phase==="voting"||roomData.phase==="guess"||roomData.phase==="result"){show("game");renderGame();if(isHost&&roomData.phase==="voting")checkVotes().catch(console.error)}
}
function renderGame(){
 localRole=roomData.roles?.[myId]||"";localSecret=localRole==="citizen"?roomData.secret||"":"";const box=document.getElementById("roleBox");
 if(localRole==="spy"){box.className="role spy";box.innerHTML='<div class="big">🕵️ SPY</div><div>당신은 Spy입니다.</div><div style="margin-top:14px">제시어를 모르므로 질문과 답변을 보고 추리하세요.</div>'}
 else{box.className="role citizen";box.innerHTML='<div class="big">👤 시민</div><div>당신은 시민입니다.</div><div style="margin-top:14px">제시어는</div><div class="secret">'+esc(localSecret)+'</div>'}
 document.getElementById("roundLabel").textContent=`ROUND ${roomData.round||1}`;
 const remote=roomData.mode!=="offline";
 document.getElementById("questionCard").classList.toggle("hidden",roomData.phase!=="question"||!remote);
 document.getElementById("offlineCard").classList.toggle("hidden",roomData.phase!=="question"||remote);
 document.getElementById("answerCard").classList.add("hidden");
 if(remote){renderQuestionLog();renderTargets();}else{document.getElementById("questionLeft").textContent="—";}
 renderTimer();
 document.getElementById("questionCard").classList.toggle("hidden",roomData.phase!=="question"||!remote);
 document.getElementById("voteCard").classList.toggle("hidden",roomData.phase!=="voting");
 document.getElementById("hostGameControls").classList.toggle("hidden",!(isHost&&roomData.phase==="question"));
 document.getElementById("spyGuessCard").classList.toggle("hidden",!(roomData.phase==="guess"&&localRole==="spy"&&!roomData.spyGuess));
 document.getElementById("resultCard").classList.toggle("hidden",roomData.phase!=="result");
 if(roomData.phase==="voting")buildVotes();if(roomData.phase==="guess"&&roomData.caught)document.getElementById("gameNotice").textContent="Spy가 제시어를 맞힐 마지막 기회입니다.";if(roomData.phase==="result")showResult();
}
function renderTimer(){clearInterval(timerHandle);if(!roomData?.endsAt||roomData.phase!=="question"){document.getElementById("timer").textContent=roomData?.phase==="voting"?"투표 중":"--:--";let ot=document.getElementById("offlineTimer");if(ot)ot.textContent=roomData?.phase==="voting"?"투표 중":"--:--";return}const tick=()=>{let n=Math.max(0,Math.ceil((roomData.endsAt-Date.now())/1000));let txt=Math.floor(n/60)+":"+String(n%60).padStart(2,"0");document.getElementById("timer").textContent=txt;document.getElementById("timer").classList.toggle("warn",n<=15);let ot=document.getElementById("offlineTimer");if(ot){ot.textContent=txt;ot.classList.toggle("warn",n<=15)}if(n<=0){clearInterval(timerHandle);if(isHost&&roomData.phase==="question")showVoting()}};tick();timerHandle=setInterval(tick,500)}
function renderTargets(){let ps=Object.values(roomData.players||{}).filter(p=>p.id!==myId);document.getElementById("questionTarget").innerHTML=ps.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("")}
function renderQuestionLog(){let qs=Object.values(roomData.questions||{});document.getElementById("questionLog").innerHTML=qs.length?qs.map(q=>`<div class="logitem"><b>${esc(q.askerName)}</b> → <b>${esc(q.targetName)}</b><br>${esc(q.text)}${q.answer?`<br>↳ ${esc(q.answer)}`:"<br><span class='small'>답변 대기 중</span>"}</div>`).join(""):"<div class='small'>아직 질문이 없어요.</div>";let limit=CONFIG[roomData.difficulty]?.questions||3;let used=qs.filter(q=>q.askerId===myId).length;document.getElementById("questionLeft").textContent=Math.max(0,limit-used);let pending=qs.filter(q=>q.targetId===myId&&!q.answer);document.getElementById("answerCard").classList.toggle("hidden",roomData.mode==="offline"||roomData.phase!=="question"||pending.length===0);if(pending.length){let q=pending[pending.length-1];document.getElementById("answerPrompt").innerHTML=`<b>${esc(q.askerName)}</b>님의 질문:<br><br>“${esc(q.text)}”`}}
async function submitQuestion(){
 if(roomData.phase!=="question"||roomData.mode==="offline")return;let text=document.getElementById("questionText").value.trim(),target=document.getElementById("questionTarget").value;if(!text||!target)return alert("질문할 사람과 질문 내용을 입력해주세요.");
 let limit=CONFIG[roomData.difficulty]?.questions||3,used=Object.values(roomData.questions||{}).filter(q=>q.askerId===myId).length;if(used>=limit)return alert("질문 횟수를 모두 사용했어요.");
 const qid=roomRef.child("questions").push().key,tn=roomData.players[target]?.name||"";
 await roomRef.child("questions/"+qid).set({askerId:myId,askerName:myName,targetId:target,targetName:tn,text,createdAt:firebase.database.ServerValue.TIMESTAMP});
 document.getElementById("questionText").value="";
}
async function submitAnswer(){if(roomData.mode==="offline")return;let qs=Object.entries(roomData.questions||{}).filter(([id,q])=>q.targetId===myId&&!q.answer);if(!qs.length)return alert("답변할 질문이 없어요.");let [id]=qs[qs.length-1],a=document.getElementById("answerText").value.trim();if(!a)return alert("답변을 입력해주세요.");await roomRef.child("questions/"+id+"/answer").set(a);document.getElementById("answerText").value=""}
function showVoting(){if(!isHost)return;roomRef.update({phase:"voting",votes:{},voteStartedAt:firebase.database.ServerValue.TIMESTAMP})}
function buildVotes(){let ps=Object.values(roomData.players||{}).filter(p=>p.id!==myId);document.getElementById("voteGrid").innerHTML=ps.map(p=>`<button class="vote ${selectedVote===p.id?"selected":""}" onclick="selectVote('${p.id}')">${esc(p.name)}</button>`).join("");document.getElementById("voteBtn").disabled=!selectedVote}
function selectVote(id){selectedVote=id;buildVotes()}
async function submitVote(){if(!selectedVote)return;await roomRef.child("votes/"+myId).set(selectedVote);selectedVote="";document.getElementById("voteBtn").disabled=true;document.getElementById("voteStatus").classList.remove("hidden");document.getElementById("voteStatus").textContent="투표가 제출되었습니다. 다른 사람을 기다리는 중...";if(isHost)checkVotes()}
async function checkVotes(){let snap=await roomRef.child("votes").once("value"),v=snap.val()||{},count=Object.keys(roomData.players||{}).length;if(Object.keys(v).length<count)return;let tally={};Object.values(v).forEach(x=>tally[x]=(tally[x]||0)+1);let max=Math.max(...Object.values(tally));let winners=Object.keys(tally).filter(x=>tally[x]===max);if(winners.length!==1)return roomRef.update({phase:"result",result:{type:"tie",secret:roomData.secret,spyName:roomData.players[roomData.spyId]?.name||""}});let winner=winners[0],caught=winner===roomData.spyId;if(caught)await roomRef.update({phase:"guess",caught:true,caughtPlayer:winner});else await roomRef.update({phase:"result",result:{type:"spy",secret:roomData.secret,spyName:roomData.players[roomData.spyId]?.name||""}})}
function submitSpyGuess(){let g=document.getElementById("spyGuess").value.trim();if(!g)return alert("제시어를 입력해주세요.");let correct=g===roomData.secret;roomRef.update({spyGuess:g,phase:"result",result:{type:correct?"spyGuess":"citizen",secret:roomData.secret,spyName:roomData.players[roomData.spyId]?.name||"",guess:g}})}
function endAsSpyWin(){if(isHost)roomRef.update({phase:"result",result:{type:"spy",secret:roomData.secret,spyName:roomData.players[roomData.spyId]?.name||""}})}
function showResult(){let d=roomData.result||{},html="";if(d.type==="disconnect")html=`<div class="winner"><h2>연결 종료로 게임 종료</h2><p>참가자가 3명 미만이 되어 게임을 마쳤습니다.</p></div>`;else if(d.type==="citizen")html=`<div class="winner">🎉<h2>시민팀 승리!</h2><p>Spy가 제시어를 맞히지 못했습니다.</p><p>Spy: <b>${esc(d.spyName)}</b><br>제시어: <b>${esc(d.secret)}</b></p></div>`;else if(d.type==="spyGuess")html=`<div class="winner">🕵️<h2>Spy 역전승!</h2><p>검거된 Spy가 제시어를 정확히 맞혔습니다.</p><p>Spy: <b>${esc(d.spyName)}</b><br>제시어: <b>${esc(d.secret)}</b></p></div>`;else if(d.type==="tie")html=`<div class="winner">⚖️<h2>투표 동률!</h2><p>누구도 검거되지 않았습니다. Spy 승리!</p><p>Spy: <b>${esc(d.spyName)}</b><br>제시어: <b>${esc(d.secret)}</b></p></div>`;else html=`<div class="winner">🕵️<h2>Spy 승리!</h2><p>Spy <b>${esc(d.spyName)}</b>가 검거되지 않았습니다.</p><p>제시어: <b>${esc(d.secret)}</b></p></div>`;document.getElementById("result").innerHTML=html}
function newRound(){if(!isHost)return alert("호스트만 다음 라운드를 시작할 수 있어요.");startGame()}
async function leaveRoom(){if(roomRef){await roomRef.child("players/"+myId).remove();roomRef.off();}roomRef=null;roomData=null;joined=false;clearInterval(timerHandle);show("home");history.replaceState({}, "", location.pathname)}
window.addEventListener("beforeunload",()=>{});
async function boot(){myId=getId();let code=getParam();if(!code)return;roomCode=code;roomRef=db.ref("spyRooms/"+roomCode);let snap=await roomRef.once("value");if(!snap.exists()){history.replaceState({}, "", location.pathname);return}roomData=snap.val();let saved=roomData.players?.[myId];if(saved){myName=saved.name;isHost=roomData.hostId===myId;attachRoom();show(roomData.phase==="lobby"?"lobby":"game");}else{document.getElementById("roomInput").value=code}}
boot();
