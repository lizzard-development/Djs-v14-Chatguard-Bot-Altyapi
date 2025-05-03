const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'roleDelete',
  async execute(role, client) {
    try {
      
      const audit = await role.guild.fetchAuditLogs({
        type: 32, // ROLE_DELETE
        limit: 1
      }).then(audit => audit.entries.first());
      
      if (!audit || audit.executor.id === client.user.id) return;
      
    
      const isSelfRole = audit.executor.id === client.user.id || role.guild.members.cache.get(audit.executor.id)?.roles.cache.some(r => 
        client.ayarlar.selfRoller.includes(r.id)
      );
      
      
      if (!isSelfRole) {
        try {         
          const member = await role.guild.members.fetch(audit.executor.id);
          await member.kick('İzinsiz rol silme');
          
          
          const logChannel = role.guild.channels.cache.get(config.logChannel);
          if (logChannel) {
            const embed = new EmbedBuilder()
              .setTitle('🛡️ Rol Koruma')
              .setDescription(`${audit.executor.tag} izinsiz rol sildi ve atıldı.`)
              .addFields(
                { name: 'Kullanıcı', value: `${audit.executor.tag} (${audit.executor.id})` },
                { name: 'Silinen Rol', value: `${role.name} (${role.id})` }
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
      console.error('Rol silme log hatası:', error);
    }
  },
};