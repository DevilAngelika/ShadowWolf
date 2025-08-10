import { ChannelType, Interaction, PermissionsBitField } from "discord.js";
import { config } from "../config";

export async function createTicket(name: string, interaction: Interaction) {
    const username: string = interaction.user.username;
    const channelName = `${name}-${username}`;

    const ticketChannel = await interaction.guild?.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: config.channels.ticketId,
        permissionOverwrites: [
            {
                id: interaction.guild.roles.everyone,
                deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: interaction.user.id,
                allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.AttachFiles,
                PermissionsBitField.Flags.EmbedLinks,
                PermissionsBitField.Flags.ReadMessageHistory
                ]
            },
            {
                id: config.acl.admin,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
            }
        ]
    });

    // Faire l'embed

    // Ajouter usecase membre
/**Salut et bienvenue ! 👋

Tu as ouvert un ticket pour devenir membre du serveur.
Voici ce que cela signifie :

✅ En tant que membre, tu auras accès à toutes les sections principales du serveur :
🎶 Musique – 🎮 Gaming – ✍️ Écriture – 💬 Discussions générales...

🚫 L’accès à la section "Contenu adulte / Pornographique" n’est pas inclus avec le rôle de membre.
Cette partie est réservée à un processus séparé avec vérification et accord spécifique.

Si tu confirmes vouloir devenir membre (hors contenu adulte), un modérateur passera bientôt pour t’attribuer le rôle. Merci de ta patience ! */
    // Réponse

    // Ajouter le cloture du ticket

}