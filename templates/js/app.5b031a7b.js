(function(t){function e(e){for(var a,i,n=e[0],l=e[1],c=e[2],u=0,p=[];u<n.length;u++)i=n[u],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&p.push(o[i][0]),o[i]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(t[a]=l[a]);d&&d(e);while(p.length)p.shift()();return r.push.apply(r,c||[]),s()}function s(){for(var t,e=0;e<r.length;e++){for(var s=r[e],a=!0,n=1;n<s.length;n++){var l=s[n];0!==o[l]&&(a=!1)}a&&(r.splice(e--,1),t=i(i.s=s[0]))}return t}var a={},o={app:0},r=[];function i(e){if(a[e])return a[e].exports;var s=a[e]={i:e,l:!1,exports:{}};return t[e].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=t,i.c=a,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)i.d(s,a,function(e){return t[e]}.bind(null,a));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="";var n=window["webpackJsonp"]=window["webpackJsonp"]||[],l=n.push.bind(n);n.push=e,n=n.slice();for(var c=0;c<n.length;c++)e(n[c]);var d=l;r.push([0,"chunk-vendors"]),s()})({0:function(t,e,s){t.exports=s("56d7")},"011c":function(t,e,s){"use strict";s.r(e);const{desktopCapturer:a}=window.require("electron");class o{async render(t){let e=await a.getSources({types:["window","screen"]}),s=await this.getStream(e);s.error?console.log(s.error):(this.from=t.from,this.to=t.to,this.task_id=t.task_id,this.project_id=t.project_id,this.date=(new Date).toISOString().substr(0,10),this.createImage(s.stream))}async getStream(t){let e,s;for(let o of t)if("Entire Screen"==o.name)try{return s=await navigator.mediaDevices.getUserMedia({audio:!1,video:{mandatory:{chromeMediaSource:"desktop",chromeMediaSourceId:o.id,minWidth:1280,maxWidth:4e3,minHeight:720,maxHeight:4e3}}}),e={error:!1,stream:s},e}catch(a){return e={error:a,stream:null},e}}createImage(t){let e="image/png",s=this;var a=document.createElement("video");a.style.cssText="position:absolute;top:-10000px;left:-10000px;",a.onloadedmetadata=function(){a.style.height=this.videoHeight+"px",a.style.width=this.videoWidth+"px",a.play();var t=document.createElement("canvas");t.width=this.videoWidth,t.height=this.videoHeight;var o=t.getContext("2d");o.drawImage(a,0,0,t.width,t.height);let r=t.toDataURL(e);s.send(r),a.remove()},a.srcObject=t,document.body.appendChild(a)}send(t){let e=this.project_id,s={from:this.from,to:this.to,date:this.date,task_id:this.task_id,image:t};axios.post("new-screenshot/"+e,s).then(t=>{let e=t.data.messag;console.log(e)}).catch(t=>{ErrorHandler.render(t)})}}e["default"]=new o},"0b3c":function(t,e,s){},"190a":function(t,e,s){"use strict";s.r(e);var a=s("3d20"),o=s.n(a);const r=o.a.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3,onOpen:t=>{t.addEventListener("mouseenter",o.a.stopTimer),t.addEventListener("mouseleave",o.a.resumeTimer)}}),i={simpleSuccess:t=>{r.fire({icon:"success",title:t})},simpleError:t=>{r.fire({icon:"error",title:t})},successAlert(t,e){o.a.fire({icon:"success",title:t,text:e})},errorAlert(t,e){o.a.fire({icon:"error",title:t,text:e})},sesionExpire(t){o.a.fire({icon:"info",title:t,showConfirmButton:!1})},async confirm(t){let e=await o.a.fire({title:t,icon:"question",showCancelButton:!0,confirmButtonText:"Si",cancelButtonText:"No"});return!!e.value}};e["default"]=i},4165:function(t,e,s){"use strict";s.r(e);class a{render(t){t.response?this.checkResponse(t.response):this.errorDefault()}errorDefault(){let t="Error desconocido.",e="si el problema persiste comuniquese con nosotros.";NotificationHandler.errorAlert(t,e)}checkResponse(t){console.log(t);let e=t.data,s=t.status,a=e.message,o="Error "+s;if(401==s&&"Unauthenticate."==a){let t="Si sesion ha expirdado, por favor acceda nuevamente.";this.sesionExpire(t)}else e.errors&&this.errorMultiple(o,e.errors),a&&!e.errors&&this.showError(a)}showError(t){NotificationHandler.errorAlert("Error",t)}errorMultiple(t,e){let s="";$.each(e,(function(t,e){$.each(e,(function(t,e){s+="-"+e+"\n"}))})),NotificationHandler.errorAlert(t,s)}sesionExpire(t){NotificationHandler.sesionExpire(t),localStorage.removeItem("token"),localStorage.removeItem("logged"),localStorage.removeItem("isAdmin"),axios.defaults.headers.common["Authorization"]=null,setTimeout(()=>{window.location.reload()},2e3)}}e["default"]=new a},"49a4":function(t,e,s){"use strict";class a{login(t,e){axios.post("login",e).then(e=>{let s=e.data.access;e.data.user;localStorage.setItem("token",s),window.axios.defaults.headers.common["Authorization"]=s,t.$router.push({name:"dashboard"})}).catch(e=>{t.password=null,t.$refs.login_form.resetValidation(),t.busy=!1,ErrorHandler.render(e)})}async logout(){try{let t=await axios.get("logout");return t.data.message&&NotificationHandler.simpleSuccess(t.data.message),t}catch(t){return!0}}}e["a"]=new a},"56d7":function(t,e,s){"use strict";s.r(e);var a=s("2b0e"),o=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-app",[s("router-view")],1)},r=[],i={name:"App"},n=i,l=s("2877"),c=s("6544"),d=s.n(c),u=s("7496"),p=Object(l["a"])(n,o,r,!1,null,null,null),m=p.exports;d()(p,{VApp:u["a"]});var h=s("8c4f");const v=(t,e,s)=>{let a=localStorage.getItem("token");a?s():s({name:"login"})};var f=v;const g=(t,e,s)=>{let a=localStorage.getItem("token");a?s({name:"dashboard"}):s()};var k=g;const b=[{path:"",redirect:{name:"login"}},{path:"/login",name:"login",beforeEnter:k,component:s("6555").default},{path:"/dashboard",name:"dashboard",beforeEnter:f,component:s("b18a").default}];var y=b;a["a"].use(h["a"]);const w=new h["a"]({routes:y});var S=w,T=s("2f62");a["a"].use(T["a"]);var _=new T["a"].Store({state:{},mutations:{},actions:{},modules:{}}),x=s("f309");s("15f5");const j={theme:{themes:{light:{primary:"#0D47A1"}}},icons:{iconfont:"fa"}};var P=j;a["a"].use(x["a"]);var C=new x["a"](P);a["a"].use(window.require("vue-electron"));const I="http://timetracker.vnddev.com/api/desktop/";window.$=window.jQuery=s("1157"),window.axios=s("bc3a"),window.axios.defaults.baseURL=I,window.axios.defaults.headers.common["Authorization"]=localStorage.getItem("token"),a["a"].config.productionTip=!1,window.NotificationHandler=s("190a").default,window.ErrorHandler=s("4165").default,window.CaptureHandler=s("011c").default,new a["a"]({router:S,store:_,vuetify:C,render:function(t){return t(m)}}).$mount("#app")},6555:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-content",[s("v-container",{staticClass:"fill-height",attrs:{fluid:""}},[s("v-row",{attrs:{justify:"center",align:"center"}},[s("v-col",{attrs:{cols:"10",sm:"8",md:"6",lg:"4"}},[s("v-form",{ref:"login_form",on:{submit:function(e){return e.preventDefault(),t.login(e)}},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[s("v-sheet",[s("v-toolbar",{attrs:{flat:""}},[s("v-spacer"),s("v-toolbar-title",[t._v(" Login ")]),s("v-spacer")],1),s("v-card-text",[s("v-text-field",{attrs:{label:"Username",disabled:t.busy,rules:t.rules.username,required:""},model:{value:t.username,callback:function(e){t.username=e},expression:"username"}}),s("v-text-field",{attrs:{disabled:t.busy,label:"Password",type:"password",rules:t.rules.password,required:""},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}})],1),s("v-card-actions",[s("v-spacer"),s("v-btn",{attrs:{disabled:t.noCan,type:"submit",color:"primary",depressed:""}},[t._v(" Access ")]),s("v-spacer")],1)],1)],1)],1)],1),s("v-dialog",{attrs:{persistent:"",width:"300"},model:{value:t.busy,callback:function(e){t.busy=e},expression:"busy"}},[s("v-card",{attrs:{color:"primary",dark:""}},[s("v-card-text",[t._v(" Accessing... "),s("v-progress-linear",{staticClass:"mb-0",attrs:{indeterminate:"",color:"white"}})],1)],1)],1)],1)],1)},o=[],r=s("49a4"),i={data(){return{valid:!0,username:null,password:null,busy:!1,rules:{username:[t=>!!t||"The username is required."],password:[t=>!!t||"The password is required."]}}},computed:{noCan(){return!(this.valid&&!this.busy)}},methods:{login(){this.busy=!0;let t={username:this.username,password:this.password};r["a"].login(this,t)}}},n=i,l=(s("d8dd"),s("2877")),c=s("6544"),d=s.n(c),u=s("8336"),p=s("b0af"),m=s("99d9"),h=s("62ad"),v=s("a523"),f=s("a75b"),g=s("169a"),k=s("4bd4"),b=s("8e36"),y=s("0fd9"),w=s("8dd9"),S=s("2fa4"),T=s("8654"),_=s("71d9"),x=s("2a7f"),j=Object(l["a"])(n,a,o,!1,null,null,null);e["default"]=j.exports;d()(j,{VBtn:u["a"],VCard:p["a"],VCardActions:m["a"],VCardText:m["b"],VCol:h["a"],VContainer:v["a"],VContent:f["a"],VDialog:g["a"],VForm:k["a"],VProgressLinear:b["a"],VRow:y["a"],VSheet:w["a"],VSpacer:S["a"],VTextField:T["a"],VToolbar:_["a"],VToolbarTitle:x["b"]})},b18a:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("v-dialog",{attrs:{persistent:"",width:"300"},model:{value:t.closing,callback:function(e){t.closing=e},expression:"closing"}},[s("v-card",{attrs:{color:"primary",dark:""}},[s("v-card-text",[t._v(" Closing... "),s("v-progress-linear",{staticClass:"mb-0",attrs:{indeterminate:"",color:"white"}})],1)],1)],1),s("v-navigation-drawer",{attrs:{width:"520",permanent:"",app:""}},[s("v-toolbar",{attrs:{color:t.timerColor,dark:"",flat:"",dense:""}},[s("v-spacer"),s("v-toolbar-title",[t._v(" Time Work Counter ")]),s("v-spacer")],1),s("v-toolbar",{attrs:{flat:""}},[s("v-toolbar-items",[t.working?s("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var a=e.on;return[s("v-btn",t._g({attrs:{icon:""},on:{click:function(e){t.working=!1}}},a),[s("v-icon",{attrs:{color:t.timerColor}},[t._v(" far fa-stop-circle ")])],1)]}}],null,!1,1111771408)},[s("span",[t._v(" Stop ")])]):s("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var a=e.on;return[s("v-btn",t._g({attrs:{icon:"",disabled:!t.project||t.busy},on:{click:function(e){t.working=!0}}},a),[s("v-icon",{attrs:{color:"primary"}},[t._v(" far fa-play-circle ")])],1)]}}])},[s("span",[t._v(" Start ")])])],1),s("v-spacer"),s("v-text-field",{staticClass:"counter-timer",attrs:{"prepend-inner-icon":"far fa-clock","append-icon":t.pauseIcon,"background-color":t.timerColor,dark:"",outlined:"","hide-details":"",dense:"",readonly:""},on:{"click:append":function(e){t.stoping=!t.stoping}},model:{value:t.timerCounter,callback:function(e){t.timerCounter=e},expression:"timerCounter"}}),s("v-spacer")],1),s("v-divider"),s("v-toolbar",{attrs:{flat:"",dense:""}},[s("v-spacer"),s("v-toolbar-title",[s("h3",[t._v(" "+t._s(t.company.name)+" ")])]),s("v-spacer")],1),s("v-toolbar",{attrs:{flat:"",dense:""}},[s("v-spacer"),s("v-toolbar-title",[s("v-subheader",[t._v(" Total worked today "+t._s(t.timeWorked)+" ")])],1),s("v-spacer")],1),s("v-toolbar",{attrs:{flat:"",dense:""}},[s("v-text-field",{attrs:{"prepend-inner-icon":"fa-search",label:"Search project",outlined:"",dense:"","hide-details":"",color:"info"},model:{value:t.searchProject,callback:function(e){t.searchProject=e},expression:"searchProject"}})],1),s("v-toolbar",{staticClass:"mt-2",attrs:{flat:"",dense:"",dark:""}},[s("v-toolbar-title",[t._v(" Projects list: ")]),s("v-spacer"),s("v-tooltip",{attrs:{right:""},scopedSlots:t._u([{key:"activator",fn:function(e){var a=e.on;return[s("v-btn",t._g({attrs:{disabled:t.busy,icon:""},on:{click:t.getProjects}},a),[s("v-icon",[t._v(" fa-redo-alt ")])],1)]}}])},[s("span",[t._v(" Update List ")])])],1),s("v-divider",{staticClass:"mb-2"}),s("v-data-table",{attrs:{loading:t.busyProject,headers:[{text:"",value:"title"}],search:t.searchProject,height:"330",items:t.projectsList,"items-per-page":t.projectsList.length,"hide-default-footer":"","hide-default-header":"","loading-text":"Loading..."},scopedSlots:t._u([{key:"item.title",fn:function(e){var a=e.item;return[s("v-toolbar",{attrs:{flat:"",dense:"",dark:t.projectSelected=="project-sel-"+a.id}},[s("v-toolbar-items",[t.working&&t.projectSelected=="project-sel-"+a.id&&!t.stoping?s("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var a=e.on;return[s("v-btn",t._g({attrs:{icon:""},on:{click:function(e){t.stoping=!0}}},a),[s("v-icon",[t._v(" fa-pause ")])],1)]}}],null,!0)},[s("span",[t._v(" Stop ")])]):s("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[s("v-btn",t._g({attrs:{icon:""},on:{click:function(e){return t.selectProject(a,!0)}}},o),[s("v-icon",[t._v(" fa-play ")])],1)]}}],null,!0)},[s("span",[t._v(" Start ")])])],1),s("v-list-item",{attrs:{link:""},on:{click:function(e){return t.selectProject(a,!1)}}},[s("v-toolbar-title",[s("h6",[t._v(" "+t._s(a.title)+" ")])]),s("v-spacer"),s("v-chip",{staticClass:"mr-2"},[t._v(" "+t._s(a.time)+" ")])],1)],1)]}}])})],1),s("v-content",[s("v-toolbar",{attrs:{dark:"",flat:"",dense:""}},[s("v-toolbar-title",[t._v(" Tasks ")]),s("v-spacer"),s("v-toolbar-items",[s("v-menu",{attrs:{"offset-y":""},scopedSlots:t._u([{key:"activator",fn:function(e){var a=e.on;return[s("v-btn",t._g({attrs:{text:""}},a),[s("v-icon",[t._v(" fa-ellipsis-v ")])],1)]}}])},[s("v-list",[s("v-list-item",{attrs:{link:""},on:{click:t.logout}},[s("v-list-item-icon",[s("v-icon",[t._v(" fa-sign-out-alt ")])],1),s("v-list-item-content",[s("v-list-item-title",[t._v(" Sign Out ")])],1)],1)],1)],1)],1)],1),s("v-container",{attrs:{fluid:""}},[s("v-sheet",[s("v-subheader",[s("b",{staticClass:"mr-2"},[t._v("Project:")]),t._v(t._s(t.projectTitle)+" ")]),s("v-row",{attrs:{justify:"space-around"}},[s("v-col",{attrs:{cols:"4"}},[s("v-select",{attrs:{label:"See Tasks:","hide-details":"",dense:"",outlined:"",items:t.tasksItemsPerPageList},model:{value:t.tasksItemsToShow,callback:function(e){t.tasksItemsToShow=e},expression:"tasksItemsToShow"}})],1),s("v-col",{staticClass:"pt-1",attrs:{cols:"3"}},[s("v-checkbox",{staticClass:"pt-0",attrs:{label:"Show completed","hide-details":""},model:{value:t.tasksCompleted,callback:function(e){t.tasksCompleted=e},expression:"tasksCompleted"}})],1),s("v-col",{attrs:{cols:"4"}},[s("v-text-field",{attrs:{"prepend-inner-icon":"fa-search",label:"Search task:","hide-details":"",dense:"",outlined:""},model:{value:t.searchTask,callback:function(e){t.searchTask=e},expression:"searchTask"}})],1)],1)],1)],1),s("v-divider"),s("v-container",[t.busyTask||0!=t.tasksList.length?t._e():s("v-row",{attrs:{align:"center"}},[s("v-col",{attrs:{cols:"12"}},[s("v-row",{attrs:{justify:"center"}},[s("v-icon",{attrs:{"x-large":""}},[t._v(" fa-tasks ")])],1),s("v-row",{attrs:{justify:"center"}},[s("v-subheader",[t._v(" There're not tasks avaliable. ")])],1)],1)],1),t.busyTask?s("v-row",{attrs:{justify:"center"}},[s("v-col",{attrs:{cols:"8"}},[s("v-progress-linear",{attrs:{indeterminate:""}}),s("v-row",{attrs:{justify:"center"}},[s("v-subheader",[t._v(" Loading... ")])],1)],1)],1):t._e(),!t.busyTask&&t.tasksList.length>0?s("v-row",[s("v-col",{attrs:{cols:"12"}},[s("v-toolbar",{attrs:{flat:"",dense:""}},[s("v-spacer"),"all"!=t.tasksItemsToShow?s("v-pagination",{attrs:{length:t.totalTasksPages},model:{value:t.tasksPage,callback:function(e){t.tasksPage=e},expression:"tasksPage"}}):t._e(),s("v-spacer")],1),s("v-sheet",[s("v-row",[s("v-col",{attrs:{cols:"12"}},[s("v-data-table",{attrs:{page:t.tasksPage,headers:t.tasksTableHeaders,search:t.searchTask,height:"370",items:t.tasksList,"items-per-page":t.taskItemsPerPage,"hide-default-footer":""},on:{"update:page":function(e){t.tasksPage=e}},scopedSlots:t._u([{key:"item.title",fn:function(e){var a=e.item;return[s("v-list-item",{attrs:{dense:"",link:"",disabled:!t.stoping&&t.working||1==a.completed},on:{click:function(e){return t.selectTask(a,!1)}}},[t.taskSelected=="task-sel-"+a.id?s("v-icon",{staticClass:"mr-2",attrs:{color:"success",small:""}},[t._v(" fa-check-circle ")]):t._e(),s("v-list-item-title",[t._v(" "+t._s(a.title)+" ")])],1)]}},{key:"item.details",fn:function(e){var a=e.item;return[s("v-menu",{attrs:{"max-width":"200","offset-y":"","nudge-left":"10"},scopedSlots:t._u([{key:"activator",fn:function(e){var a=e.on;return[s("v-btn",t._g({attrs:{icon:""}},a),[s("v-icon",{attrs:{color:"info"}},[t._v(" fa-info-circle ")])],1)]}}],null,!0)},[s("v-card",[s("v-card-title",[t._v(" Description: ")]),s("v-card-text",[t._v(" "+t._s(a.description)+" ")])],1)],1)]}},{key:"item.completed",fn:function(e){var a=e.item;return[s("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[1==a.completed?s("v-icon",t._g({attrs:{color:"success"}},o),[t._v(" fa-check-double ")]):t._e()]}}],null,!0)},[s("span",[t._v(" Completed ")])]),s("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[0==a.completed?s("v-icon",t._g({attrs:{color:"warning"}},o),[t._v(" fa-exclamation-triangle ")]):t._e()]}}],null,!0)},[s("span",[t._v(" Pending ")])])]}},{key:"item.actions",fn:function(e){var a=e.item;return[a.completed?t._e():s("div",[!t.stoping&&t.taskSelected=="task-sel-"+a.id&&t.working?s("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var a=e.on;return[s("v-btn",t._g({staticClass:"mr-2",attrs:{icon:""},on:{click:function(e){t.stoping=!0}}},a),[s("v-icon",{attrs:{color:"warning"}},[t._v(" fa-pause ")])],1)]}}],null,!0)},[s("span",[t._v(" Pause ")])]):s("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[s("v-btn",t._g({staticClass:"mr-2",attrs:{disabled:!t.stoping&&t.taskSelected&&t.taskSelected!=="task-sel-"+a.id&&t.working&&t.taskSelected,icon:""},on:{click:function(e){return t.selectTask(a,!0)}}},o),[s("v-icon",{attrs:{color:"primary"}},[t._v(" fa-play ")])],1)]}}],null,!0)},[s("span",[t._v(" Start ")])]),s("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[s("v-btn",t._g({attrs:{disabled:t.working&&t.taskSelected!=="task-sel-"+a.id&&!t.stoping||!t.stoping&&t.working&&t.taskSelected=="task-sel-"+a.id,icon:""},on:{click:function(e){return t.completeTask(a)}}},o),[s("v-icon",{attrs:{color:"info"}},[t._v(" fa-check ")])],1)]}}],null,!0)},[s("span",[t._v(" Mark as completed ")])])],1)]}}],null,!1,2208703758)})],1)],1)],1)],1)],1):t._e()],1)],1),s("v-footer",{attrs:{app:""}},[s("v-spacer"),s("v-subheader",[t._v(" © Copyright 2020 ")]),s("v-spacer")],1)],1)},o=[],r=s("49a4");class i{index(t){axios.get("projects-list").then(e=>{t.projectsList=e.data.list,t.$nextTick(()=>{t.getProjectsTimeToday(),t.busyProject=!1})}).catch(e=>{ErrorHandler.render(e),t.busyProject=!1})}tasks(t,e){axios.get("project-tasks-list/"+e).then(e=>{t.$nextTick(()=>{let s=e.data.list;if(t.tasksCompleted)t.tasksList=s;else{let e=[];$.each(s,(t,s)=>{s.completed||e.push(s)}),t.tasksList=e}t.totalTasks=s,t.busyTask=!1})}).catch(e=>{ErrorHandler.render(e),t.busyTask=!1})}async completeTask(t){try{let e=await axios.get("complete-task/"+t);return e}catch(e){return ErrorHandler.render(e),null}}}var n=new i;function l(){let t,e=JSON.parse(localStorage.getItem("totalWorkedToday")),s=(new Date).toISOString().substr(0,10);return e&&e.date==s?e:(t={date:s,hours:0,mins:0},localStorage.setItem("totalWorkedToday",JSON.stringify(t)),t)}function c(){let t=JSON.parse(localStorage.getItem("projectsWorkedToday")),e=(new Date).toISOString().substr(0,10);return t&&e==t.date||(t={date:e,items:[]},localStorage.setItem("projectsWorkedToday",JSON.stringify(t))),t}function d(){let t=JSON.parse(localStorage.getItem("timePassed")),e=(new Date).toISOString().substr(0,10);return t&&e==t.date||(t={date:e,time:0},localStorage.setItem("projectsWorkedToday",JSON.stringify(t))),t}const u={totalWorkedToday:l(),projectsWorkedToday:c(),timePassed:d(),tasksItemsPerPageList:[{text:"All tasks",value:"all"},{text:"5",value:5},{text:"10",value:10},{text:"20",value:20},{text:"50",value:50},{text:"100",value:100}],tasksTableHeaders:[{text:"Title",value:"title"},{text:"Details",value:"details",sortable:!1},{text:"Status",value:"completed",sortable:!1,align:"center"},{text:"",value:"actions",sortable:!1}]};var p=u,m={async beforeRouteEnter(t,e,s){try{let t=await axios.get("user"),e=t.data.user,a=t.data.company;s(t=>t.getUserDetails(e,a))}catch(a){ErrorHandler.render(a),localStorage.removeItem("token"),window.axios.defaults.headers.common["Authorization"]=null,s({name:"login"})}},data(){return{closing:!1,working:!1,stoping:!1,totalWorkedToday:p.totalWorkedToday,timePassed:p.timePassed,lastScreenshot:0,timer:{h:0,m:0,s:0,passed:0},busyProject:!1,projectSelected:null,projectsList:[],searchProject:null,projectsWorkedToday:p.projectsWorkedToday,project:null,busyTask:!1,tasksItemsToShow:20,tasksList:[],totalTasks:[],tasksTableHeaders:p.tasksTableHeaders,tasksItemsPerPageList:p.tasksItemsPerPageList,tasksCompleted:!1,tasksPage:1,searchTask:null,taskSelected:null,task:null,completingTask:!1,company:{},user:{}}},created(){this.getProjects()},watch:{timePassed(t){localStorage.setItem("projectsWorkedToday",JSON.stringify(t))},tasksCompleted(t){let e=this.totalTasks;if(t)this.tasksList=e;else{let t=[];$.each(e,(e,s)=>{s.completed||t.push(s)}),this.tasksList=t}},timeScreen(t){localStorage.setItem("timeScreen",t)},async working(t){if(this.working){this.stoping=!1,this.start();let t=this.$electron.remote.getCurrentWindow();t.minimize()}else{this.stoping=!0;let t="Do you want to stop really?",e=await NotificationHandler.confirm(t);e?this.stop():(this.stoping=!1,this.working=!0)}}},computed:{busy(){return!!(this.busyProject||this.working||this.busyTask)},timeWorked(){let t=this.totalWorkedToday.hours,e=this.totalWorkedToday.mins,s=e<10?"0"+e:e;return t+":"+s},projectTitle(){return this.project?this.project.title:"No Selected project"},taskItemsPerPage(){let t=this.tasksItemsToShow;return"all"==t?this.tasksList.length:t},totalTasksPages(){let t=this.tasksList.length,e=this.taskItemsPerPage,s=t/e;if(s<0)return 0;{let t=Math.round(s);return s>t?t+1:t}},timerCounter(){let t=this.timer.h,e=this.timer.m,s=this.timer.s,a=t<10?"0"+t:t,o=e<10?"0"+e:e,r=s<10?"0"+s:s;return a+":"+o+":"+r},timerColor(){return this.working&&!this.stoping?"warning":this.working&&this.working?"success":"primary"},pauseIcon(){return this.working&&!this.stoping?"fa-pause":this.working&&this.stoping?"fa-play":""}},methods:{getUserDetails(t,e){this.user=t,this.company=e},getProjects(){this.busyProject=!0,this.tasksList=[],this.totalTasks=[],this.project=null,this.projectSelected=null,this.projectsList=[],n.index(this)},selectProject(t,e){let s=this.projectSelected;if(s!=="project-sel-"+t.id){this.projectSelected="project-sel-"+t.id,this.project=t;let e=t.id;this.getTasks(e)}e?(this.working=!0,this.stoping=!1):this.stoping=!0},selectTask(t,e){let s=this.taskSelected;s!=="task-sel-"+t.id&&(this.taskSelected="task-sel-"+t.id,this.task=t),e?(this.working=!0,this.stoping=!1):this.stoping=!0},async completeTask(t){let e="Are you sure the task is complete?",s=await NotificationHandler.confirm(e);if(s){let e=t.id,s=await n.completeTask(e);if(s){let t=s.data.message;this.taskSelected=null,this.task=null,NotificationHandler.simpleSuccess(t),$.each(this.totalTasks,(t,s)=>{s.id==e&&(s.completed=!0)}),this.$nextTick(()=>{this.tasksList=[];let t=this.totalTasks;if(this.tasksCompleted)this.tasksList=t;else{let e=[];$.each(t,(t,s)=>{s.completed||e.push(s)}),this.tasksList=e}})}}},getTasks(t){this.busyTask=!0,n.tasks(this,t)},start(){setTimeout(()=>{this.runing()},1e3)},stop(){this.stoping=!1,this.timer.h=0,this.timer.m=0,this.timer.s=0,this.timer.passed=0},runing(){this.working&&(this.stoping||(this.changeTimer(),this.$nextTick(()=>{let t=this.timer.passed,e=this.company.time;if(t==e){let t;NotificationHandler.simpleSuccess("Captured"),this.timer.passed=0,t=this.task?this.task.id:null;let e={from:this.lastScreenshot,to:this.timePassed.time,task_id:t,project_id:this.project.id};CaptureHandler.render(e),this.lastScreenshot=this.timePassed.time}})),setTimeout(()=>{this.runing()},1e3))},changeTimeToProject(){let t,e,s,a=this.project,o=a.time.split(":"),r=parseInt(o[0]),i=parseInt(o[1]);i++,i>59?(t=0,r++):t=i,s=t<10?"0"+t:t,e=r+":"+s,a.time=e;let n,l=this.projectsWorkedToday.items,c=!1;if(l.length>0){for(let t of l){if(t.id==a.id){c=!0,t.time=e;break}c=!1}c||(n={id:a.id,time:e},l.push(n))}else n={id:a.id,time:e},l.push(n);localStorage.setItem("projectsWorkedToday",JSON.stringify(this.projectsWorkedToday))},getProjectsTimeToday(){for(let t of this.projectsList){let e,s=this.projectsWorkedToday.items;if(s.length>0)for(let a of s){if(a.id==t.id){e=a.time,t.time=e;break}e="0:00",t.time=e}else e="0:00",t.time=e}},changeTimer(){this.timer.s+=1;this.timer.h;let t=this.timer.m,e=this.timer.s;if(e>59){this.timer.s=0,this.timer.m+=1,this.changeTimeToProject();let t=this.totalWorkedToday.mins+=1;t>59&&(this.totalWorkedToday.mins=0,this.totalWorkedToday.hours+=1),localStorage.setItem("totalWorkedToday",JSON.stringify(this.totalWorkedToday))}t>59&&(this.timer.s=0,this.timer.m=0,this.timer.h+=1),this.timer.passed+=1,this.timePassed.time+=1},async logout(){let t="Do you want sign out?",e=await NotificationHandler.confirm(t);if(e){this.closing=!0;await r["a"].logout(this);localStorage.removeItem("token"),window.axios.defaults.headers.common["Authorization"]=null,this.$router.push({name:"login"})}}}},h=m,v=(s("b453"),s("2877")),f=s("6544"),g=s.n(f),k=s("8336"),b=s("b0af"),y=s("99d9"),w=s("ac7c"),S=s("cc20"),T=s("62ad"),_=s("a523"),x=s("a75b"),j=s("8fea"),P=s("169a"),C=s("ce7e"),I=s("553a"),V=s("132d"),L=s("8860"),W=s("da13"),O=s("5d23"),E=s("34c3"),H=s("e449"),N=s("f774"),D=s("891e"),A=s("8e36"),M=s("0fd9"),J=s("b974"),q=s("8dd9"),U=s("2fa4"),B=s("e0c7"),R=s("8654"),z=s("71d9"),F=s("2a7f"),Q=s("3a2f"),G=Object(v["a"])(h,a,o,!1,null,null,null);e["default"]=G.exports;g()(G,{VBtn:k["a"],VCard:b["a"],VCardText:y["b"],VCardTitle:y["c"],VCheckbox:w["a"],VChip:S["a"],VCol:T["a"],VContainer:_["a"],VContent:x["a"],VDataTable:j["a"],VDialog:P["a"],VDivider:C["a"],VFooter:I["a"],VIcon:V["a"],VList:L["a"],VListItem:W["a"],VListItemContent:O["a"],VListItemIcon:E["a"],VListItemTitle:O["b"],VMenu:H["a"],VNavigationDrawer:N["a"],VPagination:D["a"],VProgressLinear:A["a"],VRow:M["a"],VSelect:J["a"],VSheet:q["a"],VSpacer:U["a"],VSubheader:B["a"],VTextField:R["a"],VToolbar:z["a"],VToolbarItems:F["a"],VToolbarTitle:F["b"],VTooltip:Q["a"]})},b453:function(t,e,s){"use strict";var a=s("c901"),o=s.n(a);o.a},c901:function(t,e,s){},d8dd:function(t,e,s){"use strict";var a=s("0b3c"),o=s.n(a);o.a}});
//# sourceMappingURL=app.5b031a7b.js.map