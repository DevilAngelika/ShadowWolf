import { AttachmentBuilder } from 'discord.js';

export function createAttachment(path: string, name: string): AttachmentBuilder {
  return new AttachmentBuilder(path, { name: name });
}
