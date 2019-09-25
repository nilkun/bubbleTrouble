'use strict'
import AssetManager from "./helpers/AssetManager.js"
import loadAssetsAndStart from "./helpers/Assets.js"
import Game from "./gameStates/Game.js"

// Load the assets and then start the game
// The game loop is in States.js

const assetManager = new AssetManager;

loadAssetsAndStart(assetManager, () => new Game(assetManager));

