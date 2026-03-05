f=open('index.html','r',encoding='utf-8')
c=f.read()
f.close()
ch=0
db=c.find('function drawBlock')
if db>=0 and 'BLOCKS.DOOR' not in c[db:db+600]:
    br=c.find('{',db)
    r='\nif(b===BLOCKS.DOOR){var dk=wx+","+wy;var dO=window.doorStates&&window.doorStates[dk]&&window.doorStates[dk].open;if(dO){ctx.fillStyle="rgba(139,69,19,0.3)";ctx.fillRect(sx,sy,TILE*zoom,TILE*zoom);ctx.strokeStyle="#8B4513";ctx.lineWidth=1;ctx.strokeRect(sx+1,sy+1,TILE*zoom-2,TILE*zoom-2);}else{ctx.fillStyle="#8B4513";ctx.fillRect(sx,sy,TILE*zoom,TILE*zoom);ctx.fillStyle="#A0522D";ctx.fillRect(sx+2,sy+2,TILE*zoom-4,TILE*zoom-4);ctx.fillStyle="#654321";ctx.fillRect(sx+TILE*zoom*0.7,sy+TILE*zoom*0.45,3,3);}return;}\n'
    c=c[:br+1]+r+c[br+1:]
    ch+=1
    print('Added door rendering')
ri=c.find('recipes=[')
if ri>=0 and '134' not in c[ri:ri+3000]:
    re2=c.find('];',ri)
    if re2>=0:
        c=c[:re2]+',{result:{id:134,count:1},ingredients:[{id:11,count:6}]}'+c[re2:]
        ch+=1
        print('Added door recipe')
gi=c.find('function getItemName')
if gi>=0 and '134' not in c[gi:gi+500]:
    gb=c.find('{',gi)
    c=c[:gb+1]+'if(id===134)return"Door";'+c[gb+1:]
    ch+=1
    print('Added Door in getItemName')
open('index.html','w',encoding='utf-8',newline='').write(c)
print(f'Changes:{ch}')