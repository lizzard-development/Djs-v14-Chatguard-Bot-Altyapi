const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../config');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    
    if (message.author.bot || !message.guild) return;

    
    const isSelfRole = message.member.roles.cache.some(role => 
      client.ayarlar.selfRoller.includes(role.id)
    );

   
    if (isSelfRole) return;

    // Dosya engel kontrolü
    if (client.ayarlar.dosyaEngel.durum && 
        client.ayarlar.dosyaEngel.kanallar.includes(message.channel.id) && 
        message.attachments.size > 0) {
      
      await message.delete().catch(console.error);
      
      
      try {
        await message.member.timeout(60000, 'Dosya engel ihlali');
        
        
        const logChannel = message.guild.channels.cache.get(config.logChannel);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setTitle('🛡️ Dosya Engel')
            .setDescription(`${message.author} dosya gönderdi ve engellendi.`)
            .addFields(
              { name: 'Kullanıcı', value: `${message.author.tag} (${message.author.id})` },
              { name: 'Kanal', value: `${message.channel.name} (${message.channel.id})` }
            )
            .setColor(config.color)
            .setTimestamp();
          
          logChannel.send({ embeds: [embed] });
        }
      } catch (error) {
        console.error('Timeout hatası:', error);
      }
      
      return;
    }

    // Küfür engel kontrolü
    if (client.ayarlar.kufurEngel.durum && 
        client.ayarlar.kufurEngel.kanallar.includes(message.channel.id)) {
      
      // Küfür listesini yükle
      const kufurListesi = fs.readFileSync(path.join(__dirname, '../küfürler.txt'), 'utf-8')
        .split('\n')
        .filter(word => word.trim() !== '');
      
      
      const messageContent = message.content.toLowerCase();
      const containsBadWord = kufurListesi.some(word => 
        messageContent.includes(word.toLowerCase().trim())
      );
      
      if (containsBadWord) {
        await message.delete().catch(console.error);
        
        
        try {
          await message.member.timeout(60000, 'Küfür engel ihlali');
          
          
          const logChannel = message.guild.channels.cache.get(config.logChannel);
          if (logChannel) {
            const embed = new EmbedBuilder()
              .setTitle('🛡️ Küfür Engel')
              .setDescription(`${message.author} küfür içeren bir mesaj gönderdi ve engellendi.`)
              .addFields(
                { name: 'Kullanıcı', value: `${message.author.tag} (${message.author.id})` },
                { name: 'Kanal', value: `${message.channel.name} (${message.channel.id})` }
              )
              .setColor(config.color)
              .setTimestamp();
            
            logChannel.send({ embeds: [embed] });
          }
        } catch (error) {
          console.error('Timeout hatası:', error);
        }
        
        return;
      }
    }

    // Etiket engel kontrolü
    if (message.mentions.users.size > 0) {
      for (const [id, user] of message.mentions.users) {
        if (client.ayarlar.etiketEngel.kullanicilar[id]) {
          await message.delete().catch(console.error);
          
          
          try {
            await message.member.timeout(60000, 'Etiket engel ihlali');
            
            
            const logChannel = message.guild.channels.cache.get(config.logChannel);
            if (logChannel) {
              const embed = new EmbedBuilder()
                .setTitle('🛡️ Etiket Engel')
                .setDescription(`${message.author} korunan bir kullanıcıyı etiketledi ve engellendi.`)
                .addFields(
                  { name: 'Kullanıcı', value: `${message.author.tag} (${message.author.id})` },
                  { name: 'Etiketlenen', value: `${user.tag} (${user.id})` },
                  { name: 'Kanal', value: `${message.channel.name} (${message.channel.id})` }
                )
                .setColor(config.color)
                .setTimestamp();
              
              logChannel.send({ embeds: [embed] });
            }
          } catch (error) {
            console.error('Timeout hatası:', error);
          }
          
          break;
        }
      }
    }

    // Everyone/Here engel kontrolü
    if (client.ayarlar.everyoneEngel.durum && 
        (message.content.includes('everyone') || message.content.includes('here')) && 
        !message.member.permissions.has(PermissionsBitField.Flags.MentionEveryone)) {
      
      await message.delete().catch(console.error);
      
      
      try {
        await message.member.timeout(60000, 'Everyone/Here engel ihlali');
        
        
        const logChannel = message.guild.channels.cache.get(config.logChannel);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setTitle('🛡️ Everyone/Here Engel')
            .setDescription(`${message.author} everyone/here kullandı ve engellendi.`)
            .addFields(
              { name: 'Kullanıcı', value: `${message.author.tag} (${message.author.id})` },
              { name: 'Kanal', value: `${message.channel.name} (${message.channel.id})` }
            )
            .setColor(config.color)
            .setTimestamp();
          
          logChannel.send({ embeds: [embed] });
        }
      } catch (error) {
        console.error('Timeout hatası:', error);
      }
      
      return;
    }

    // Reklam engel kontrolü
    if (client.ayarlar.reklamEngel.kanallar[message.channel.id]) {
      
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      
      if (urlRegex.test(message.content)) {
        await message.delete().catch(console.error);
        
        
        try {
          await message.member.timeout(60000, 'Reklam engel ihlali');
          
          
          const logChannel = message.guild.channels.cache.get(config.logChannel);
          if (logChannel) {
            const embed = new EmbedBuilder()
              .setTitle('🛡️ Reklam Engel')
              .setDescription(`${message.author} reklam içeren bir mesaj gönderdi ve engellendi.`)
              .addFields(
                { name: 'Kullanıcı', value: `${message.author.tag} (${message.author.id})` },
                { name: 'Kanal', value: `${message.channel.name} (${message.channel.id})` }
              )
              .setColor(config.color)
              .setTimestamp();
            
            logChannel.send({ embeds: [embed] });
          }
        } catch (error) {
          console.error('Timeout hatası:', error);
        }
        
        return;
      }
    }

    
    if (!message.content.startsWith(config.prefix)) return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
    
    if (!command) return;
    
    try {
      command.execute(message, args, client);
    } catch (error) {
      console.error('Komut çalıştırma hatası:', error);
      message.reply('Komut çalıştırılırken bir hata oluştu!');
    }
  },
};