const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'guildBanAdd',
  async execute(ban, client) {
    try {      
      const audit = await ban.guild.fetchAuditLogs({
        type: 22, // MEMBER_BAN_ADD
        limit: 1
      }).then(audit => audit.entries.first());
      
      if (!audit || audit.executor.id === client.user.id) return;
      
      const isSelfRole = audit.executor.id === client.user.id || ban.guild.members.cache.get(audit.executor.id)?.roles.cache.some(role => 
        client.ayarlar.selfRoller.includes(role.id)
      );
       
      if (!isSelfRole) {
        try {
          const member = await ban.guild.members.fetch(audit.executor.id);
          await member.kick('İzinsiz ban atma');
          
     
          await ban.guild.bans.remove(ban.user.id, 'İzinsiz ban atıldı, geri alındı');
          
      
          const logChannel = ban.guild.channels.cache.get(config.logChannel);
          if (logChannel) {
            const embed = new EmbedBuilder()
              .setTitle('🛡️ Ban Koruma')
              .setDescription(`${audit.executor.tag} izinsiz ban attı ve atıldı. Ban geri alındı.`)
              .addFields(
                { name: 'Kullanıcı', value: `${audit.executor.tag} (${audit.executor.id})` },
                { name: 'Banlanan', value: `${ban.user.tag} (${ban.user.id})` }
              )
              .setColor(config.color)
              .setTimestamp();
            
            logChannel.send({ embeds: [embed] });
          }
        } catch (error) {
          console.error('Kullanıcı atma hatası:', error);
        }
      }
    } catch (error) {
      console.error('Ban log hatası:', error);
    }
  },
};