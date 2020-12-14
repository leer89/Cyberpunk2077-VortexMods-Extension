//Import some assets from Vortex we'll need.
const path = require('path');
const { fs, log, util } = require('vortex-api');

// Nexus Mods domain for the game. e.g. nexusmods.com/bloodstainedritualofthenight
const GAME_ID = 'cyberpunk2077';

//Steam Application ID, you can get this from https://steamdb.info/apps/
const STEAMAPP_ID = '1091500';

//GOG Application ID, you can get this from https://www.gogdb.org/
const GOGAPP_ID = '	1423049311';

  //Add this to the top of the file
const winapi = require('winapi-bindings');

function main(context) {
	//This is the main function Vortex will run when detecting the game extension. 
	context.registerGame({
    id: GAME_ID,
    name: 'Cyberpunk 2077',
    mergeMods: true,
    queryPath: findGame,
    supportedTools: [],
    queryModPath: () => 'Cyberpunk2077/Content/Paks/~mods',
    logo: 'gameart.jpg',
    executable: () => 'Cyberpunk2077.exe',
    requiredFiles: [
      'Cyberpunk2077.exe',
      'C:\Program Files (x86)\Steam\steamapps\common\Cyberpunk 2077\bin\x64\Cyberpunk2077.exe'
    ],
    setup: prepareForModding,
    environment: {
      SteamAPPId: STEAMAPP_ID,
    },
    details: {
      steamAppId: STEAMAPP_ID,
      gogAppId: GOGAPP_ID,
    },
  });
  
	return true
}

module.exports = {
    default: main,
  };
 
function findGame() {
  try {
    const instPath = winapi.RegGetValue(
      'HKEY_LOCAL_MACHINE',
      'SOFTWARE\\WOW6432Node\\GOG.com\\Games\\' + GOGAPP_ID,
      'PATH');
    if (!instPath) {
      throw new Error('empty registry key');
    }
    return Promise.resolve(instPath.value);
  } catch (err) {
    return util.GameStoreHelper.findByAppId([STEAMAPP_ID, GOGAPP_ID])
      .then(game => game.gamePath);
  }
}