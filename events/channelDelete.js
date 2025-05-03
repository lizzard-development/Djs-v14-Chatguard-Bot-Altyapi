module.exports = {
  name: 'channelDelete',
  async execute(channel, client) {
    try {
      const audit = await channel.guild.fetchAuditLogs({
        type: 12, // CHANNEL_DELETE
        limit: 1
      }).then(audit => audit.entries.first());
      
      if (!audit || audit.executor.id === client.user.id) return;
      
      const isSelfRole = audit.executor.id === client.user.id || channel.guild.members.cache.get(audit.executor.id)?.roles.cache.some(role => 
        client.ayarlar.selfRoller.includes(role.id)
      );
      
      
      if (!isSelfRole) {
        try {        
          const member = await channel.guild.members.fetch(audit.executor.id);
          await member.kick('İzinsiz kanal silme');
          
          
          const logChannel = channel.guild.channels.cache.get(config.logChannel);
          if (logChannel) {
            const embed = new EmbedBuilder()
              .setTitle('🛡️ Kanal Koruma')
              .setDescription(`${audit.executor.tag} izinsiz kanal sildi ve atıldı.`)
              .addFields(
                { name: 'Kullanıcı', value: `${audit.executor.tag} (${audit.executor.id})` },
                { name: 'Silinen Kanal', value: `${channel.name} (${channel.id})` }
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
      console.error('Kanal silme log hatası:', error);
    }
  },
};