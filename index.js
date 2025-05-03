const config = require('./config');
const { token, intents, partials } = config;
const { Client, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');


const client = new Client({
  intents: intents,
  partials: partials,
  allowedMentions: {
    parse: ['users', 'roles'],
    repliedUser: true
  }
});


client.commands = new Collection();
client.aliases = new Collection();

client.ayarlar = require('./ayarlar');


const commandsPath = path.join(__dirname, 'komutlar');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('name' in command && 'execute' in command) {
    client.commands.set(command.name, command);
    console.log(`[KOMUT] ${command.name} yüklendi!`);
    
    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach(alias => {
        client.aliases.set(alias, command.name);
      });
    }
  } else {
    console.log(`[UYARI] ${file} komut dosyasında name veya execute eksik!`);
  }
}


const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  
  console.log(`[EVENT] ${event.name} yüklendi!`);
}


client.saveSettings = () => {
  fs.writeFileSync('./ayarlar.js', `module.exports = ${JSON.stringify(client.ayarlar, null, 2)};`);
};


client.once('ready', () => {
  console.log(`${client.user.tag} giriş yaptı`);
  client.user.setActivity(`Ares Code v14 Guard Bot`);
});


client.login(token);
