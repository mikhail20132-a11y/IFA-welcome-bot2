
require('dotenv').config();
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID)
  throw new Error('Missing DISCORD_TOKEN or CLIENT_ID in .env');

const commands = [
  new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configure IFA welcome or goodbye channels.')
    .addStringOption(o => o.setName('type').setDescription('Channel type').setRequired(true)
      .addChoices({name:'Welcome',value:'welcome'},{name:'Goodbye',value:'goodbye'}))
    .addChannelOption(o => o.setName('channel').setDescription('Text channel').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  new SlashCommandBuilder().setName('welcome-preview').setDescription('Preview the IFA welcome banner.'),
  new SlashCommandBuilder().setName('goodbye-preview').setDescription('Preview the IFA departure banner.')
].map(c => c.toJSON());

new REST({version:'10'}).setToken(process.env.DISCORD_TOKEN)
  .put(Routes.applicationCommands(process.env.CLIENT_ID), {body: commands})
  .then(() => console.log('Slash commands registered.'))
  .catch(err => { console.error(err); process.exit(1); });
