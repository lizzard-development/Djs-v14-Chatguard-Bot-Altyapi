const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ModalBuilder, 
  TextInputBuilder,
  StringSelectMenuBuilder, 
  RoleSelectMenuBuilder, 
  UserSelectMenuBuilder, 
  TextInputStyle, 
  ChannelType,
  PermissionsBitField 
} = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isButton()) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && 
          interaction.user.id !== config.owner) {
        return interaction.reply({
          content: 'Bu işlemi yapmak için yönetici yetkisine sahip olmalısın!',
          ephemeral: true
        });
      }
      
      
      if (interaction.customId === 'dosya_engel') {
        const modal = new ModalBuilder()
          .setCustomId('dosya_engel_modal')
          .setTitle('Dosya Engel Ayarları');
        
        const channelInput = new TextInputBuilder()
          .setCustomId('kanal_id')
          .setLabel('Kanal ID (Birden fazla için virgülle ayırın)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Örn: 123456789,987654321')
          .setRequired(true);
        
        const actionRow = new ActionRowBuilder().addComponents(channelInput);
        modal.addComponents(actionRow);
        
        await interaction.showModal(modal);
      }
      
      
      else if (interaction.customId === 'kufur_engel') {
        const modal = new ModalBuilder()
          .setCustomId('kufur_engel_modal')
          .setTitle('Küfür Engel Ayarları');
        
        const channelInput = new TextInputBuilder()
          .setCustomId('kanal_id')
          .setLabel('Kanal ID (Birden fazla için virgülle ayırın)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Örn: 123456789,987654321')
          .setRequired(true);
        
        const actionRow = new ActionRowBuilder().addComponents(channelInput);
        modal.addComponents(actionRow);
        
        await interaction.showModal(modal);
      }
      
      
      else if (interaction.customId === 'etiket_engel') {
        const modal = new ModalBuilder()
          .setCustomId('etiket_engel_modal')
          .setTitle('Etiket Engel Ayarları');
        
        const userInput = new TextInputBuilder()
          .setCustomId('user_id')
          .setLabel('Kullanıcı ID')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Örn: 123456789')
          .setRequired(true);
        
        const actionInput = new TextInputBuilder()
          .setCustomId('action')
          .setLabel('İşlem (ekle/kaldir)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('ekle veya kaldir yazın')
          .setRequired(true);
        
        const actionRow1 = new ActionRowBuilder().addComponents(userInput);
        const actionRow2 = new ActionRowBuilder().addComponents(actionInput);
        modal.addComponents(actionRow1, actionRow2);
        
        await interaction.showModal(modal);
      }
      
      
      else if (interaction.customId === 'everyone_engel') {
        const currentStatus = client.ayarlar.everyoneEngel.durum;
        client.ayarlar.everyoneEngel.durum = !currentStatus;
        client.saveSettings();
        
        const newStatus = client.ayarlar.everyoneEngel.durum;
        await interaction.reply({
          content: `Everyone/Here engel ${newStatus ? 'aktif' : 'devre dışı'} hale getirildi.`,
          ephemeral: true
        });
        
        
        const logChannel = interaction.guild.channels.cache.get(config.logChannel);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setTitle('🛡️ Everyone/Here Engel')
            .setDescription(`${interaction.user} tarafından Everyone/Here engel ${newStatus ? 'aktif' : 'devre dışı'} hale getirildi.`)
            .setColor(config.color)
            .setTimestamp();
          
          logChannel.send({ embeds: [embed] });
        }
      }
      
      
      else if (interaction.customId === 'reklam_engel') {
        const modal = new ModalBuilder()
          .setCustomId('reklam_engel_modal')
          .setTitle('Reklam Engel Ayarları');
        
        const channelInput = new TextInputBuilder()
          .setCustomId('kanal_id')
          .setLabel('Kanal ID')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Örn: 123456789')
          .setRequired(true);
        
        const actionInput = new TextInputBuilder()
          .setCustomId('action')
          .setLabel('İşlem (ekle/kaldir)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('ekle veya kaldir yazın')
          .setRequired(true);
        
        const actionRow1 = new ActionRowBuilder().addComponents(channelInput);
        const actionRow2 = new ActionRowBuilder().addComponents(actionInput);
        modal.addComponents(actionRow1, actionRow2);
        
        await interaction.showModal(modal);
      }
      
      
      else if (interaction.customId === 'self_rol') {
        const modal = new ModalBuilder()
          .setCustomId('self_rol_modal')
          .setTitle('Self Rol Ayarları');
        
        const roleInput = new TextInputBuilder()
          .setCustomId('role_id')
          .setLabel('Rol ID')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Örn: 123456789')
          .setRequired(true);
        
        const actionInput = new TextInputBuilder()
          .setCustomId('action')
          .setLabel('İşlem (ekle/kaldir)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('ekle veya kaldir yazın')
          .setRequired(true);
        
        const actionRow1 = new ActionRowBuilder().addComponents(roleInput);
        const actionRow2 = new ActionRowBuilder().addComponents(actionInput);
        modal.addComponents(actionRow1, actionRow2);
        
        await interaction.showModal(modal);
      }
    } 
    
    else if (interaction.isModalSubmit()) {
      
      if (interaction.customId === 'dosya_engel_modal') {
        const kanalIds = interaction.fields.getTextInputValue('kanal_id').split(',').map(id => id.trim());
        
       
        const gecerliKanallar = [];
        for (const id of kanalIds) {
          const kanal = interaction.guild.channels.cache.get(id);
          if (kanal) {
            gecerliKanallar.push(id);
          }
        }
        
        
        if (gecerliKanallar.length > 0) {
          client.ayarlar.dosyaEngel.durum = true;
          client.ayarlar.dosyaEngel.kanallar = gecerliKanallar;
          client.saveSettings();
          
          await interaction.reply({
            content: `✅ Dosya engel sistemi aktif edildi. Koruma altındaki kanallar: ${gecerliKanallar.map(id => `<#${id}>`).join(', ')}`,
            ephemeral: true
          });
        } else {
          client.ayarlar.dosyaEngel.durum = false;
          client.ayarlar.dosyaEngel.kanallar = [];
          client.saveSettings();
          
          await interaction.reply({
            content: '❌ Geçerli kanal bulunamadı. Dosya engel sistemi devre dışı bırakıldı.',
            ephemeral: true
          });
        }
        
        
        const logChannel = interaction.guild.channels.cache.get(config.logChannel);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setTitle('🛡️ Dosya Engel')
            .setDescription(`${interaction.user} tarafından dosya engel sistemi ${client.ayarlar.dosyaEngel.durum ? 'aktif edildi' : 'devre dışı bırakıldı'}.`)
            .setColor(config.color)
            .setTimestamp();
          
          if (client.ayarlar.dosyaEngel.durum) {
            embed.addFields(
              { name: 'Korunan Kanallar', value: gecerliKanallar.map(id => `<#${id}>`).join(', ') }
            );
          }
          
          logChannel.send({ embeds: [embed] });
        }
      }
      
      
      else if (interaction.customId === 'kufur_engel_modal') {
        const kanalIds = interaction.fields.getTextInputValue('kanal_id').split(',').map(id => id.trim());
        
        // Kanalları kontrol et
        const gecerliKanallar = [];
        for (const id of kanalIds) {
          const kanal = interaction.guild.channels.cache.get(id);
          if (kanal) {
            gecerliKanallar.push(id);
          }
        }
        
        
        if (gecerliKanallar.length > 0) {
          client.ayarlar.kufurEngel.durum = true;
          client.ayarlar.kufurEngel.kanallar = gecerliKanallar;
          client.saveSettings();
          
          await interaction.reply({
            content: `✅ Küfür engel sistemi aktif edildi. Koruma altındaki kanallar: ${gecerliKanallar.map(id => `<#${id}>`).join(', ')}`,
            ephemeral: true
          });
        } else {
          client.ayarlar.kufurEngel.durum = false;
          client.ayarlar.kufurEngel.kanallar = [];
          client.saveSettings();
          
          await interaction.reply({
            content: '❌ Geçerli kanal bulunamadı. Küfür engel sistemi devre dışı bırakıldı.',
            ephemeral: true
          });
        }
        
        
        const logChannel = interaction.guild.channels.cache.get(config.logChannel);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setTitle('🛡️ Küfür Engel')
            .setDescription(`${interaction.user} tarafından küfür engel sistemi ${client.ayarlar.kufurEngel.durum ? 'aktif edildi' : 'devre dışı bırakıldı'}.`)
            .setColor(config.color)
            .setTimestamp();
          
          if (client.ayarlar.kufurEngel.durum) {
            embed.addFields(
              { name: 'Korunan Kanallar', value: gecerliKanallar.map(id => `<#${id}>`).join(', ') }
            );
          }
          
          logChannel.send({ embeds: [embed] });
        }
      }
      
      
      else if (interaction.customId === 'etiket_engel_modal') {
        const userId = interaction.fields.getTextInputValue('user_id');
        const action = interaction.fields.getTextInputValue('action').toLowerCase();
        
        
        try {
          const user = await client.users.fetch(userId);
          
          
          if (action === 'ekle') {
            client.ayarlar.etiketEngel.kullanicilar[userId] = true;
            client.saveSettings();
            
            await interaction.reply({
              content: `✅ ${user.tag} kullanıcısı için etiket engel sistemi aktif edildi.`,
              ephemeral: true
            });
          } else if (action === 'kaldir') {
            delete client.ayarlar.etiketEngel.kullanicilar[userId];
            client.saveSettings();
            
            await interaction.reply({
              content: `✅ ${user.tag} kullanıcısı için etiket engel sistemi kaldırıldı.`,
              ephemeral: true
            });
          } else {
            await interaction.reply({
              content: '❌ Geçersiz işlem! Lütfen `ekle` veya `kaldir` yazın.',
              ephemeral: true
            });
            return;
          }
          
          
          const logChannel = interaction.guild.channels.cache.get(config.logChannel);
          if (logChannel) {
            const embed = new EmbedBuilder()
              .setTitle('🛡️ Etiket Engel')
              .setDescription(`${interaction.user} tarafından ${user.tag} kullanıcısı için etiket engel sistemi ${action === 'ekle' ? 'aktif edildi' : 'kaldırıldı'}.`)
              .setColor(config.color)
              .setTimestamp();
            
            logChannel.send({ embeds: [embed] });
          }
        } catch (error) {
          await interaction.reply({
            content: '❌ Geçersiz kullanıcı ID\'si! Lütfen geçerli bir kullanıcı ID\'si girin.',
            ephemeral: true
          });
        }
      }
      
      
      else if (interaction.customId === 'reklam_engel_modal') {
        const kanalId = interaction.fields.getTextInputValue('kanal_id');
        const action = interaction.fields.getTextInputValue('action').toLowerCase();
        
        
        const kanal = interaction.guild.channels.cache.get(kanalId);
        if (!kanal) {
          await interaction.reply({
            content: '❌ Geçersiz kanal ID\'si! Lütfen geçerli bir kanal ID\'si girin.',
            ephemeral: true
          });
          return;
        }
        
        
        if (action === 'ekle') {
          client.ayarlar.reklamEngel.kanallar[kanalId] = true;
          client.saveSettings();
          
          await interaction.reply({
            content: `✅ ${kanal.name} kanalı için reklam engel sistemi aktif edildi.`,
            ephemeral: true
          });
        } else if (action === 'kaldir') {
          delete client.ayarlar.reklamEngel.kanallar[kanalId];
          client.saveSettings();
          
          await interaction.reply({
            content: `✅ ${kanal.name} kanalı için reklam engel sistemi kaldırıldı.`,
            ephemeral: true
          });
        } else {
          await interaction.reply({
            content: '❌ Geçersiz işlem! Lütfen `ekle` veya `kaldir` yazın.',
            ephemeral: true
          });
          return;
        }
        
       
        const logChannel = interaction.guild.channels.cache.get(config.logChannel);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setTitle('🛡️ Reklam Engel')
            .setDescription(`${interaction.user} tarafından ${kanal.name} kanalı için reklam engel sistemi ${action === 'ekle' ? 'aktif edildi' : 'kaldırıldı'}.`)
            .setColor(config.color)
            .setTimestamp();
          
          logChannel.send({ embeds: [embed] });
        }
      }
      
      
      else if (interaction.customId === 'self_rol_modal') {
  const typeSelect = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('selfrole_type_select')
        .setPlaceholder('İşlem türünü seçin')
        .addOptions([
          { label: 'Rol İşlemleri', value: 'role', emoji: '🎭' },
          { label: 'Kullanıcı İşlemleri', value: 'user', emoji: '👤' }
        ])
    );

  await interaction.reply({
    content: '**Self Rol Yönetimi**\nLütfen işlem yapacağınız türü seçin:',
    components: [typeSelect],
    ephemeral: true
  });
}


if (interaction.isStringSelectMenu() && interaction.customId === 'selfrole_type_select') {
  const type = interaction.values[0];
  
  // 2. Adım: Hedef Seçimi
  let targetSelect;
  if (type === 'role') {
    targetSelect = new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId(`selfrole_target_${type}`)
        .setPlaceholder('Rol seçin')
        .setMaxValues(1)
    );
  } else {
    targetSelect = new ActionRowBuilder().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId(`selfrole_target_${type}`)
        .setPlaceholder('Kullanıcı seçin')
        .setMaxValues(1)
    );
  }

  await interaction.update({
    content: `**${type === 'role' ? 'Rol' : 'Kullanıcı'} Seçimi**\nLütfen bir hedef seçin:`,
    components: [targetSelect]
  });
}


if (
  (interaction.isRoleSelectMenu() || interaction.isUserSelectMenu()) && 
  interaction.customId.startsWith('selfrole_target_')
) {
  const type = interaction.customId.split('_')[2];
  const targetId = interaction.values[0];
  
  
  const actionRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`selfrole_action_${type}_${targetId}_add`)
      .setLabel('Ekle')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`selfrole_action_${type}_${targetId}_remove`)
      .setLabel('Kaldır')
      .setStyle(ButtonStyle.Danger)
  );

  await interaction.update({
    content: `**İşlem Seçimi**\nSeçilen hedef için aksiyonu seçin:`,
    components: [actionRow]
  });
}


if (interaction.isButton() && interaction.customId.startsWith('selfrole_action_')) {
  const [,, type, targetId, action] = interaction.customId.split('_');
  
 
  let target;
  try {
    if (type === 'role') {
      target = await interaction.guild.roles.fetch(targetId);
    } else {
      target = await interaction.guild.members.fetch(targetId);
    }
  } catch {
    target = null;
  }

  if (!target) {
    await interaction.reply({ content: '❌ Hedef bulunamadı!', ephemeral: true });
    return;
  }

  
  if (!Array.isArray(client.ayarlar.selfRoller)) client.ayarlar.selfRoller = [];
  if (!client.ayarlar.selfRoller.every(i => i?.type)) {
    client.ayarlar.selfRoller = client.ayarlar.selfRoller.map(id => 
      typeof id === 'string' ? { type: 'role', id } : id
    );
  }

  
  const existingIndex = client.ayarlar.selfRoller.findIndex(i => 
    i.id === targetId && i.type === type
  );

  if (action === 'add') {
    if (existingIndex > -1) {
      await interaction.reply({ 
        content: `❌ ${target.toString()} zaten listede mevcut!`,
        ephemeral: true 
      });
      return;
    }
    
    client.ayarlar.selfRoller.push({ type, id: targetId });
    client.saveSettings();
    
    await interaction.reply({
      content: `✅ ${target.toString()} başarıyla eklendi!`,
      ephemeral: true
    });
  } 
  else {
    if (existingIndex === -1) {
      await interaction.reply({ 
        content: `❌ ${target.toString()} listede bulunamadı!`,
        ephemeral: true 
      });
      return;
    }
    
    client.ayarlar.selfRoller.splice(existingIndex, 1);
    client.saveSettings();
    
    await interaction.reply({
      content: `✅ ${target.toString()} başarıyla kaldırıldı!`,
      ephemeral: true
    });
  }

  
  const logChannel = interaction.guild.channels.cache.get(config.logChannel);
  if (logChannel) {
    const embed = new EmbedBuilder()
      .setTitle(`🛡️ Self ${type === 'role' ? 'Rol' : 'Kullanıcı'} Yönetimi`)
      .setDescription(`${interaction.user} ${action === 'add' ? 'ekledi' : 'kaldırdı'} ➜ ${target.toString()}`)
      .setColor(action === 'add' ? '#00ff00' : '#ff0000')
      .setTimestamp();
      
    logChannel.send({ embeds: [embed] });
    }
    }
    }
  } 
}; 