module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {  
    if (member.user.bot) {
     
      const adder = await member.guild.fetchAuditLogs({
        type: 28, // BOT_ADD
        limit: 1
      }).then(audit => audit.entries.first()?.executor);
      
      if (!adder) return;
      
      const isSelfRole = adder.id === client.user.id || member.guild.members.cache.get(adder.id)?.roles.cache.some(role => 
        client.ayarlar.selfRoller.includes(role.id)
      );
      
      
      if (!isSelfRole) {
        try {
          
          await member.kick('Self rol olmadan bot ekleme');
          
          
          const adderMember = await member.guild.members.fetch(adder.id);
          await adderMember.kick('İzinsiz bot ekleme');
          
          
          const logChannel = member.guild.channels.cache.get(config.logChannel);
          if (logChannel) {
            const embed = new EmbedBuilder()
              .setTitle('🛡️ Bot Koruma')
              .setDescription(`${adder.tag} izinsiz bot ekledi ve atıldı.`)
              .addFields(
                { name: 'Ekleyen', value: `${adder.tag} (${adder.id})` },
                { name: 'Eklenen Bot', value: `${member.user.tag} (${member.user.id})` }
              )
              .setColor(config.color)
              .setTimestamp();
            
            logChannel.send({ embeds: [embed] });
          }
        } catch (error) {
          console.error('Bot atma hatası:', error);
        }
      }
    }
  },
};