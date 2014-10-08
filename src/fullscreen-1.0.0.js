/**
* Contains the Fullscreen Plugin.
*
* @module Kiwi
* @submodule Plugins
* @namespace Kiwi.Plugins
* @class Fullscreen
*/
Kiwi.Plugins.Fullscreen = {
  

  /**
  * The name of this plugin.
  * @property name
  * @type String
  * @default 'Fullscreen'
  * @public
  */
  name:'Fullscreen',


  /**
  * The version of this plugin.
  * @property version
  * @type String
  * @default '1.0.0'
  * @public
  */
  version:'1.0.0',
   

  /**
  * The minimum version of Kiwi.js required to run this plugin in semver (semantic versioning) format
  * @property minimumKiwiVersion
  * @type String
  * @public
  */
  minimumKiwiVersion:'1.1.0'


};



//Registers this plugin with the Global Kiwi Plugins Manager if it is avaiable.
Kiwi.PluginManager.register(Kiwi.Plugins.Fullscreen);



/**
* This create method is executed when Kiwi Game that has been told to use this plugin reaches the boot stage of the game loop.
* @method create
* @param game {Kiwi.Game} The game that is current in the boot stage.
* @private 
*/
Kiwi.Plugins.Fullscreen.create = function( game ) {
      	
  game.fullscreen = new Kiwi.Plugins.Fullscreen.Main( game );

  return game.fullscreen;
}



/**
* 
* @module Plugins
* @submodule Fullscreen
* @class Main
* @constructor
* @param game {Kiwi.Game} The game that this 
*/
Kiwi.Plugins.Fullscreen.Main = function( game ) {



  /**
  * The game that this Fullscreen Plugin current exists on. 
  * @property game
  * @type Kiwi.Game
  * @public
  */
  this.game = game;



  /**
  * If the Fullscreen API is support
  * @property supported
  * @type boolean
  * @public
  */
  this.supported = false;



  /**
  * Used when checking to see if the Fullscreen API is supported.
  * If support is found, then this will maintain a reference to the correct method for requesting fullscreen. 
  * @property _requestFullscreen
  * @type string
  * @private
  */
  this._requestFullscreen = null;



  /**
  * Used when checking to see if the Fullscreen API is supported.
  * If support is found, then this will maintain a reference to the correct method for canceling fullscreen.
  * @property _cancelFullscreen
  * @type string
  * @private
  */
  this._cancelFullscreen = null;



  /**
  * When set to true, this will force Kiwi to recalculate the offset/scale of the container. 
  * Implemented currently as a fix, since changing css styles do not take effect immediately.
  * @property _updateStage
  * @type booleab
  * @private
  */
  this._updateScale = false;



  /**
  * Dispatches events when the game enters fullscreen.
  * @property onEnter
  * @type Kiwi.Signal
  * @public
  */
  this.onEnter = new Kiwi.Signal();



  /**
  * Dispatches events when the game leaves fullscreen.
  * @property onLeave
  * @type Kiwi.Signal
  * @public
  */
  this.onLeave = new Kiwi.Signal();


}



/**
* If the game is currently in fullscreen mode or not. This is READ ONLY.
* @property isFullscreen
* @type boolean
* @public
*/ 
Object.defineProperty( Kiwi.Plugins.Fullscreen.Main.prototype, "isFullscreen", {
    get: function () {
        if (  document['fullscreenElement'] || 
              document['mozFullScreenElement'] || 
              document['webkitFullscreenElement'] || 
              document['msFullscreenElement'] ) {

          return true;

        } else {

          return false;

        }
    },
    enumerable: true,
    configurable: true
});



/**
* Returns the width of the window. This is the innerWidth/Height of the browser.
* READ ONLY.
* @property width
* @type boolean
* @public
*/ 
Object.defineProperty(Kiwi.Plugins.Fullscreen.Main.prototype, "width", {
    get: function () {
        return window.innerWidth;
    },
    enumerable: true,
    configurable: true
});



/**
* Returns the height of the window. This is the innerWidth/Height of the browser.
* READ ONLY.
* @property height
* @type boolean
* @public
*/ 
Object.defineProperty(Kiwi.Plugins.Fullscreen.Main.prototype, "height", {
    get: function () {
        return window.innerHeight;
    },
    enumerable: true,
    configurable: true
});



/**
* Executed when the DOM and all core Game managers have been loaded.
* Checks for support of the fullscreen API.
* @method boot
* @private
*/
Kiwi.Plugins.Fullscreen.Main.prototype.boot = function() {
  
  /**
  * A reference back to the container element that the game currently exists inside.
  * @property container
  * @type HTMLElement
  * @public
  */
  this.container = this.game.stage.container;


  /**
  * The targeted element that the fullScreen API will apply to. 
  * This will only take affect when the fullScreen API is supported, and if you change the targetted element then the game will not be constraited to the browser window.
  * @property targetElement
  * @type HTMLElement
  * @public
  */
  this.targetElement = this.container;


  //No fullscreen support in CocoonJS, because CocoonJS already can go fullscreen through use of the Stage/ScaleManager
  if ( this.game.deviceTargetOption === Kiwi.TARGET_COCOON ) { 
    this.supported = false;
    return;
  }


  // Checks to see if the fullscreen API is supported and then gets the correct events.
  this.checkSupport();


  var that = this;

  //Add Events for fullscreen changing.
  document.addEventListener( 'webkitfullscreenchange', function ( event ) {
      return that._onChange(event);
  }, false);

  document.addEventListener( 'mozfullscreenchange', function ( event ) {
      return that._onChange(event);
  }, false);

  document.addEventListener( "MSFullscreenChange", function ( event ) {
      return that._onChange(event);
  }, false);

  document.addEventListener( 'fullscreenchange', function ( event ) {
      return that._onChange(event);
  }, false);

  //Events for when the game/window is resized.
  this.game.stage.onResize.add( this._checkPositionChanges, this );
  this.game.stage.onWindowResize.add( this._checkPositionChanges, this );

}


/**
* Launches the game into Fullscreen mode.
* @method launchFullscreen
* @public
*/ 
Kiwi.Plugins.Fullscreen.Main.prototype.launchFullscreen = function( ) {

  if ( this.supported ) {

    if (this.fullscreenKeyboard ) {
      this.targetElement[ this._requestFullscreen ]( Element.ALLOW_KEYBOARD_INPUT );
    } else {
      this.targetElement[ this._requestFullscreen ]();
    }

  } 

}


/**
* Exits the game from Fullscreen mode. 
* @method exitFullscreen
* @public
*/ 
Kiwi.Plugins.Fullscreen.Main.prototype.exitFullscreen = function() {
  
  if ( !this.isFullscreen ) return;

  if ( this.supported ) {
    document[ this._cancelFullscreen ]();

  } 

}


/**
* Toggles the FullScreen state.
* @method toggleFullscreen
* @public
*/
Kiwi.Plugins.Fullscreen.Main.prototype.toggleFullscreen = function( ) {

  if ( this.isFullscreen ) {
    this.exitFullscreen();

  } else {
    this.launchFullscreen( );

  }

}


/**
* Executed when the fullscreen state changes. 
* This method is excuted by change events of the browser and should as such should not be called directly.
* @method _onChange
* @param event {Event}
* @private
*/
Kiwi.Plugins.Fullscreen.Main.prototype._onChange = function( event ) {
  
  if ( this.isFullscreen ) {
    this._recalculateStyles();
    this.onEnter.dispatch(); 
  
  } else {
    this._removeStyles();
    this.onLeave.dispatch();

  }

  this._updateScale = true;

}


/**
* Called when an event that has affected the sizing of the Game during fullscreen has occured. 
* This method is charged with recalcuating any coordinates/styles needed.
* @method _checkPositionChanges
* @private
*/
Kiwi.Plugins.Fullscreen.Main.prototype._checkPositionChanges = function() {

  if ( this.isFullscreen ) {
    this._recalculateStyles();
  } 

}


/**
* Recalculates and applys styles that need to occur onto the targetElement (only if the targetElement is the game container).
* Note that it is assumed that the browser is in fullscreen mode when this method is called. 
* Method used for internal calls only.
* @method _recalculateStyles
* @private
*/
Kiwi.Plugins.Fullscreen.Main.prototype._recalculateStyles = function() {

  if ( this.targetElement === this.game.stage.container ) {

    this.targetElement.style.margin = '0 auto';

    //Makes sure the height does not extend past the windows. 
    if ( this.game.stage.scaleType === Kiwi.Stage.SCALE_FIT ) {

      //Is the height greater than the window?
      var ch = parseInt( this.targetElement.style.height );

      if ( ch > this.height ) {

        this.targetElement.style.maxHeight = this.height + 'px';

        //Calculate how wide the container needs to be 
        this.targetElement.style.minWidth = String( this.game.stage.width * ( this.height / this.game.stage.height ) ) + 'px'; 

        this._updateStageScale();

      }


    }


  }

}

/**
* Recalculates the scale on the stage, which is used by the Pointer.
* This is a workaround.
* @method _updateStageScale
* @private
*/
Kiwi.Plugins.Fullscreen.Main.prototype._updateStageScale = function() {

  this.game.stage.offset = this.game.stage.getOffsetPoint(this.container);

  this.game.stage._scale.x = this.game.stage._width / this.container.clientWidth;
  this.game.stage._scale.y = this.game.stage._height / this.container.clientHeight;

}


/**
* Removes all styles that may have been applied because of going into fullscreen mode. 
* @method _removeStyles
* @private
*/
Kiwi.Plugins.Fullscreen.Main.prototype._removeStyles = function() {
  this.targetElement.style.maxHeight = '';
  this.targetElement.style.margin = '';
}


/**
* The update loop for this Plugin. 
* @method update
* @private
*/
Kiwi.Plugins.Fullscreen.Main.prototype.update = function() {

  if ( this._updateScale ) {
    this.game.stage._calculateContainerScale(); 
    this._updateScale = false;

  }

}



/**
* Checks support of the fullscreen API. 
* If support is found, then it maintains the correct methods for enabling/disabling FullScreen.
* @method checkSupport
* @public
*/
Kiwi.Plugins.Fullscreen.Main.prototype.checkSupport = function() {

  var fs = [
      'requestFullscreen',
      'requestFullScreen',
      'webkitRequestFullscreen',
      'webkitRequestFullScreen',
      'msRequestFullscreen',
      'msRequestFullScreen',
      'mozRequestFullScreen',
      'mozRequestFullscreen'
  ];

  for ( var i = 0;  i < fs.length;  i++ ) {
      if ( this.container[ fs[ i ] ] ) {
          this.supported = true;
          this._requestFullscreen = fs[i];
          break;
      }
  }

  var cfs = [
      'cancelFullScreen',
      'exitFullscreen',
      'webkitCancelFullScreen',
      'webkitExitFullscreen',
      'msCancelFullScreen',
      'msExitFullscreen',
      'mozCancelFullScreen',
      'mozExitFullscreen'
  ];

  if ( this.supported ) {
      for ( var i = 0;  i < cfs.length;  i++ ) {
          if ( document[ cfs[ i ] ] ) {
              this._cancelFullscreen = cfs[i];
              break;
          }
      }
  }

  //  Keyboard Input?
  if ( window['Element'] && Element['ALLOW_KEYBOARD_INPUT'] ) {
      this.fullscreenKeyboard = true;
  }

}