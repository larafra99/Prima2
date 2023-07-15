namespace Runner {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Runner);  // Register the namespace to FUDGE for serialization
  
    export class RemoveOpponentScript extends ƒ.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(RemoveOpponentScript);
      // Properties may be mutated by users in the editor via the automatically created user interface
  
      constructor() {
        super();
  
        // Don't start when running in editor
        if (ƒ.Project.mode == ƒ.MODE.EDITOR)
          return;
  
        // Listen to this component being added to or removed from a node
        this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
        this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
        this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
      }
  
      // Activate the functions of this component as response to events
      public hndEvent = (_event: Event): void => {
        switch (_event.type) {
            case ƒ.EVENT.COMPONENT_ADD:
                // ƒ.Debug.log( this.node);
                this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.update);
                break;
            case ƒ.EVENT.COMPONENT_REMOVE:
                this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
                this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
                break; 
            case ƒ.EVENT.NODE_DESERIALIZED:
                // this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.update);
                this.node.addEventListener("Hit", this.removeAfterHit);
                break;
            }   
            
        }
      private update = (_event: Event): void => {
        // TODO: Remove Zahl auch -7 setzen, werden erst removed, wenn sie aus dem Bild sind 
        if (this.node.mtxLocal.translation.x < -6-OpponentsTrans[0]) {
            console.log("Opponent removed");
            Opponents.removeChild(this.node);
        }
      }
      private removeAfterHit(_event: Event): void {
        console.log("I've been hit");

      }
     
  
      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }