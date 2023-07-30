interface ConfigType {
  debug: boolean;
  // add other properties of Config as needed
}

const Diceroll = (
  spell_difficulty: number,
  Config: ConfigType,
  spell_name: string
): boolean => {
  let diceroll = Math.floor(Math.random() * 100);
  if(Config.debug){
      console.log(`Difficulty: ${spell_difficulty}`);
      console.log(`Diceroll: ${diceroll}`);
    }

  if(diceroll > spell_difficulty){
    if(Config.debug)
      console.log(`Successfully cast ${spell_name}`);
    return true;
  } else {
    if(Config.debug)
      console.log(`Spell ${spell_name} failed`);
    return false;
  }
}

export { Diceroll };
