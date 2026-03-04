import re
f=open('index.html','r',encoding='utf-8');c=f.read();f.close()
css='''#save-screen,#load-screen{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:1000;color:#fff;font-family:monospace;overflow-y:auto;}
.sl-container{max-width:220px;margin:20px auto;text-align:center;}
.sl-title{font-size:14px;margin:10px 0;color:#4f4;}
    .sl-input{width:90%;padding:4px;font-size:10px;background:#333;color:#fff;border:1px solid #4f4;margin:5px 0;box-sizing:border-box;}
        .sl-btn{display:inline-block;padding:5px 10px;margin:4px;font-size:9px;background:#2a2;color:#fff;border:none;cursor:pointer;border-radius:3px;}
            .sl-btn:hover{background:#3c3;}
                .sl-btn.red{background:#a22;}.sl-btn.red:hover{background:#c33;}
                    .sl-btn.blue{background:#22a;}.sl-btn.blue:hover{background:#33c;}
                        .sl-list{text-align:left;margin:8px 0;max-height:150px;overflow-y:auto;}
                        .sl-item{padding:4px 6px;margin:2px 0;background:#333;border:1px solid #555;cursor:pointer;font-size:8px;border-radius:2px;}
                            .sl-item:hover{background:#444;border-color:#4f4;}
                                .sl-item.selected{border-color:#4f4;background:#353;}
                                    .sl-mode{font-size:7px;color:#aaa;float:right;}
                                        .sl-msg{font-size:9px;color:#ff4;margin:5px 0;}
                                            #save-btn-hud{position:absolute;top:2px;right:2px;z-index:10;font-size:7px;background:#2a2;color:#fff;border:none;padding:2px 5px;cursor:pointer;border-radius:2px;}
                                                #save-btn-hud:hover{background:#3c3;}'''
                                                    c=c.replace('</style>',css+'\n</style>')
                                                    print('1. CSS added')
                                                    save_html='<div id="save-screen"><div class="sl-container"><div class="sl-title">SAVE GAME</div><div id="save-msg" class="sl-msg"></div><input id="save-name" class="sl-input" type="text" placeholder="Enter map name..." maxlength="30"><br><div class="sl-btn" onclick="confirmSave()">Save</div><div class="sl-btn red" onclick="closeSaveScreen()">Cancel</div><div class="sl-title" style="font-size:10px;margin-top:10px;">Existing Saves:</div><div id="save-existing" class="sl-list"></div></div></div>'
                                                    load_html='<div id="load-screen"><div class="sl-container"><div class="sl-title">LOAD GAME</div><div id="load-msg" class="sl-msg"></div><div id="load-list" class="sl-list"></div><div class="sl-btn blue" onclick="confirmLoad()">Load Selected</div><div class="sl-btn red" onclick="closeLoadScreen()">Cancel</div><div class="sl-btn red" onclick="deleteSelectedSave()" style="margin-top:6px;">Delete Selected</div></div></div>'
                                                    c=c.replace('<canvas id="game"',save_html+'\n'+load_html+'\n<canvas id="game"')
                                                    print('2. HTML screens added')
                                                    c=c.replace('<div id="craft-btn"','<button id="save-btn-hud" onclick="openSaveScreen()">&#x1F4BE; Save</button>\n<div id="craft-btn"')
                                                    print('3. Save HUD button added')
                                                    