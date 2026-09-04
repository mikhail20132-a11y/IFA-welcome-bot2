
require('dotenv').config();
const {
  Client, GatewayIntentBits, Partials, AttachmentBuilder,
  Events, PermissionFlagsBits
} = require('discord.js');
const { get, set } = require('./src/settings');
const { makeBanner } = require('./src/banner');

if (!process.env.DISCORD_TOKEN) throw new Error('Missing DISCORD_TOKEN in .env');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.GuildMember, Partials.User]
});

const getChannel = (guild, id) => id ? guild.channels.cache.get(id) : null;

async function sendWelcome(member) {
  const cfg = get(member.guild.id);
  const channel = getChannel(member.guild, cfg.welcomeChannelId);
  if (!channel?.isTextBased()) return;
  const file = await makeBanner({
    username: member.user.username,
    memberNumber: member.guild.memberCount,
    type: 'welcome'
  });
  await channel.send({
    content: `🏆 **WELCOME TO THE IMPERIAL FOOTBALL ASSOCIATION**\n\nWelcome ${member}!\nYou are now **member #${member.guild.memberCount}** of IFA.\n\nPlease check the server rules and enjoy your time in IFA!`,
    files: [new AttachmentBuilder(file, { name: 'ifa-welcome.png' })]
  });
}

async function sendGoodbye(member) {
  const cfg = get(member.guild.id);
  const channel = getChannel(member.guild, cfg.goodbyeChannelId);
  if (!channel?.isTextBased()) return;
  const username = member.user?.username || member.displayName || 'A member';
  const file = await makeBanner({
    username,
    memberNumber: member.guild.memberCount,
    type: 'goodbye'
  });
  await channel.send({
    content: `👋 **MEMBER DEPARTURE**\n\n**${username}** has left the Imperial Football Association.\n\nWe wish you the best of luck!`,
    files: [new AttachmentBuilder(file, { name: 'ifa-goodbye.png' })]
  });
}

client.once(Events.ClientReady, c => console.log(`IFA bot online as ${c.user.tag}`));
client.on(Events.GuildMemberAdd, m => sendWelcome(m).catch(console.error));
client.on(Events.GuildMemberRemove, m => sendGoodbye(m).catch(console.error));

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand() || !interaction.guild) return;

  if (interaction.commandName === 'setup') {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild))
      return interaction.reply({ content: 'You need **Manage Server** permission.', ephemeral: true });

    const type = interaction.options.getString('type', true);
    const channel = interaction.options.getChannel('channel', true);
    set(interaction.guild.id, {
      [type === 'welcome' ? 'welcomeChannelId' : 'goodbyeChannelId']: channel.id
    });
    return interaction.reply({
      content: `✅ ${type === 'welcome' ? 'Welcome' : 'Goodbye'} channel set to ${channel}.`,
      ephemeral: true
    });
  }

  const type = interaction.commandName === 'welcome-preview' ? 'welcome'
             : interaction.commandName === 'goodbye-preview' ? 'goodbye' : null;
  if (!type) return;

  const cfg = get(interaction.guild.id);
  const needed = type === 'welcome' ? cfg.welcomeChannelId : cfg.goodbyeChannelId;
  if (!needed)
    return interaction.reply({ content: `Set the ${type} channel first with \`/setup\`.`, ephemeral: true });

  const file = await makeBanner({
    username: interaction.user.username,
    memberNumber: interaction.guild.memberCount,
    type
  });

  await interaction.reply({
    content: type === 'welcome' ? `🏆 **IFA Welcome Preview**\nWelcome ${interaction.user}!`
                                : `👋 **IFA Departure Preview**`,
    files: [new AttachmentBuilder(file, { name: `ifa-${type}-preview.png` })]
  });
});

client.login(process.env.DISCORD_TOKEN);
