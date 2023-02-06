///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
namespace Harvest {
  import ƒ = FudgeCore;

  export let graph: ƒ.Node;
  export let playerstate: UserInterface;
  export let cmpField: ƒ.ComponentMesh;
  export let spriteNode: ƒ.Node;
  export let onField:boolean;
  export let stamina: number;
  export let vitality: number;
  

  let viewport: ƒ.Viewport;
  let cmpCamera: ƒ.ComponentCamera
  let cmpBgAudio:ƒ.ComponentAudio;
  let avatar: Avatar;
  
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent): Promise<void> {
    let response: Response = await fetch("config.json");
    let config: {[key: string]: number} = await response.json();
    stamina= config.stamina;
    vitality= config.vitality;

    playerstate= new UserInterface(config);
    //console.log("P",playerstate);
    viewport = _event.detail;
    graph = viewport.getBranch();
    cmpCamera = viewport.camera;
    spriteNode= graph.getChildrenByName("Player")[0]; // get Sprite by name

   //TODO: camera at an angle 
    cmpCamera.mtxPivot.rotateY(180);
    cmpCamera.mtxPivot.rotateX(20);
    cmpCamera.mtxPivot.translation = new ƒ.Vector3(0,8,25);

    cmpField =graph.getChildrenByName("Ground")[0].getChildrenByName("Field")[0].getComponent(ƒ.ComponentMesh);
    //console.log("Field",cmpField);

    await hndLoad();
    bgAudio();

  }
  

  async function hndLoad(): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Images/PlayerSprite.png");

    avatar = new Avatar();
    avatar.initializeAnimations(imgSpriteSheet);
    avatar.act(ACTION.DOWN);
    avatar.act(ACTION.IDLE);
    spriteNode.addChild(avatar);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  function updateCamera():void{
    //TODO: camera walking with character
  }

  async function bgAudio():Promise<void> {
    let bgMusic: ƒ.Audio = new ƒ.Audio("Audio/BGM_Spring.mp3");

    cmpBgAudio = new ƒ.ComponentAudio(bgMusic,true,true);
    cmpBgAudio.connect(true);
    cmpBgAudio.volume=4;
  }

  function update(_event: Event): void {
    
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      spriteNode.mtxLocal.rotation = ƒ.Vector3.Y(0);
      avatar.act(ACTION.LEFTRIGHT);
      avatar.walkleftright(deltaTime);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      spriteNode.mtxLocal.rotation = ƒ.Vector3.Y(180);
      avatar.act( ACTION.LEFTRIGHT);
      avatar.walkleftright(deltaTime);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])){
      spriteNode.mtxLocal.rotation = ƒ.Vector3.Y(0);
      avatar.act(ACTION.UP);
      avatar.walkupdown(deltaTime);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])){
      spriteNode.mtxLocal.rotation = ƒ.Vector3.Y(180);
      avatar.act(ACTION.DOWN);
      avatar.walkupdown(deltaTime);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.E])){
      avatar.act(ACTION.INTERACTION);
      if(onField){
        playerstate.stamina= playerstate.stamina-5;
      }
      
      //TODO:action gießen, hacken, etc. mit musik
      
    }
    else{
      avatar.act(ACTION.IDLE);
    }  
    viewport.draw();
    updateCamera();
  }
}