Fullscreen Plugin v1.0.0
==========================================

This plugin brings the (HTML 5 FullScreen API)[https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode] feature to Kiwi.JS. This plugin does its best to support as many browsers as it can (so if you spot a bug, or if it doesn't work in a particular browser/device then say so!), but beware that not all modern browsers fully supporting the API yet.


*Doesn't work in CocoonJS:* This plugin is designed for browsers/devices that support the FullScreen API, and because of that it will not work in CocoonJS. If you are wanting Fullscreen support in CocoonJS, then Kiwi supports that normally. 


----------------------------------------------------------------------------------------
##Versions

KiwiJS last version test: 1.1.1


----------------------------------------------------------------------------------------
##Files/Folders of Note 

* docs/ - Documentation generated by yuidocs.
* examples/ - Examples of the in-app purchase plugin in action. 
* src/ - The source files for the plugin. 
* libs/ - External Libraries that this plugin requires.
* dist/ - All folders / files that will be zipped for distribution. Example file structure below.
* assets/ - any non code files required for the plugin, such as images, audio, e.t.c.


----------------------------------------------------------------------------------------
##How to Include: 

Copy either the fullscreen-x.x.x.js or the fullscreen-x.x.x.min.js file (they should be in the src folder) into your project directory. We recommend that you save the files under a plugin directory that lives inside of your project directory so that you can easily manage all of the plugins but that is not required.

Then link in the JavaScript file fullscreen-x.x.x.js (or the min version of the file) into your HTML file. Make sure you link it in underneath the link to the main Kiwi.js file AND underneath the Cocoon files.

Now that the plugin is included, the next step is to tell the game to use this plugin. To do so you need to add the name of the plugin ('Fullscreen') to the game objects 'plugin' property on its configuration object. Example below.

	var game = new Kiwi.Game('domElement', 'GameName', null, { plugins: ["Fullscreen"]});

Just make sure if you are wanting to use other plugins that you pass their names also.

Your game should now have access to the plugin. 


----------------------------------------------------------------------------------------
##How to use.

###Checking Support
To check to see if a device supports the fullscreen API you can access the 'supported' property

	this.game.fullscreen.supported; //Will give you a boolean indicating support or not.


###Activating FullScreen
To launch the fullscreen api you can use the 'launchFullscreen' method. *Note:* that this is best used in a user-input event (Mouse/Touch) otherwise it may not execute.

	this.game.fullscreen.launchFullscreen(); //Will start the fullscreen plugin


###Deactivating FullScreen
To close the fullscreen api you can use the 'exitFullscreen' method.

	this.game.fullscreen.exitFullscreen(); //Minise fullscreen.


###Events to Subscribe to

	this.game.fullsceen.onEnter.add(this.functionToCallWhenFullscreenLaunches, this);
	this.game.fullsceen.onLeave.add(this.functionToCallWhenFullscreenStopsAndWasOn, this);
	

----------------------------------------------------------------------------------------
##Contribute
If you discover a bug or find yourself just wanting to jump on in and help make this blueprint even better please file and issue and get stuck in. We're a friendly bunch and hope people find themselves wanting to get involved.

https://github.com/gamelab/Fullscreen-Plugin/issues/new