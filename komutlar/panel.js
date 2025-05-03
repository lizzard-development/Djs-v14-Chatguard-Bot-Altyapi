const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'panel',
  aliases: [],
  execute(message, args, client) {
    if (!message.member.permissions.has('ADMINISTRATOR') && message.author.id !== config.owner) {
      return message.reply('Bu komutu kullanmak için yönetici yetkisine sahip olmalısın!');
    }

    const embed = new EmbedBuilder()
      .setTitle('📌 Guard Yönetim Paneli')
      .setDescription('❕ **Ares Code** guard yönetim paneline hoş geldiniz 🎉\n\n📍 Aşağıdaki butonlar aracılığıyla tüm guard bot fonksiyonlarını ayarlayabilirsin.\n\n⚠️ **Not**: **Self Rol** butonu üzerinden ekleyeceğin role sahip olmayan birisi sunucudan **kanal silemez, rol silemez ve bot ekleyemez** lütfen dikkat edin.')
      .setColor(config.color)
      .addFields(
        { name: '📂 Dosya Engel', value: client.ayarlar.dosyaEngel.durum ? '✅ Aktif' : '❌ Devre Dışı', inline: true },
        { name: '🤬 Küfür Engel', value: client.ayarlar.kufurEngel.durum ? '✅ Aktif' : '❌ Devre Dışı', inline: true },
        { name: '🏷 Etiket Engel', value: Object.keys(client.ayarlar.etiketEngel.kullanicilar).length > 0 ? '✅ Aktif Kullanıcılar Var' : '❌ Devre Dışı', inline: true },
        { name: '👥 Everyone/Here Engel', value: client.ayarlar.everyoneEngel.durum ? '✅ Aktif' : '❌ Devre Dışı', inline: true },
        { name: '🔗 Reklam Engel', value: Object.keys(client.ayarlar.reklamEngel.kanallar).length > 0 ? '✅ Aktif Kanallar Var' : '❌ Devre Dışı', inline: true },
        { name: '👑 Self Rol', value: client.ayarlar.selfRoller.length > 0 ? '✅ Ayarlı' : '❌ Ayarlanmadı', inline: true }
      )
      .setFooter({ text: `${message.guild.name} Guard`, iconURL: message.guild.iconURL() })
      .setTimestamp();

    const row1 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('dosya_engel')
          .setLabel('Dosya Engel')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('📂'),
        new ButtonBuilder()
          .setCustomId('kufur_engel')
          .setLabel('Küfür Engel')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🤬'),
        new ButtonBuilder()
          .setCustomId('etiket_engel')
          .setLabel('Etiket Engel')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🏷')
      );

    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('everyone_engel')
          .setLabel('Everyone/Here Engel')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('👥'),
        new ButtonBuilder()
          .setCustomId('reklam_engel')
          .setLabel('Reklam Engel')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🔗'),
        new ButtonBuilder()
          .setCustomId('self_rol')
          .setLabel('Self Rol')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('👑')
      );


    
    message.channel.send({ embeds: [embed], components: [row1, row2] });
  },
};
