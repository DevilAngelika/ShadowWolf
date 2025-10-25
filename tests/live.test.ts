import { Colors } from 'discord.js';
const liveCommand = require('../commands/live');

// Mock dependencies
jest.mock('../helper/embed', () => ({
  createEmbed: jest.fn((title, description, color, imageName) => ({
    data: { title, description, color, image: imageName ? { url: imageName } : undefined },
  })),
}));

jest.mock('../helper/channel', () => ({
  getChannel: jest.fn(() => ({
    isSendable: () => true,
    send: jest.fn(),
  })),
}));

jest.mock('../helper/attachment', () => ({
  createAttachment: jest.fn((path: string, name: string) => ({ path, name })),
}));

jest.mock('../config', () => ({
  config: {
    acl: { admin: '111', streaming: '222' },
    channels: { liveId: '999' },
    names: { devilangelika: '@Devil' },
  },
}));

describe('/live command', () => {
  const mockSend = jest.fn();
  const mockReply = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send correct embed for stream "mi"', async () => {
    const mockInteraction: any = {
      options: {
        getString: jest.fn().mockReturnValue('mi'),
      },
      member: {
        roles: { cache: new Map([['222', { id: '222' }]]) },
        user: { username: 'Tester' },
      },
      reply: mockReply,
    };

    // Mock channel and helpers
    const { getChannel } = require('../helper/channel');
    getChannel.mockReturnValue({ isSendable: () => true, send: mockSend });

    const { createEmbed } = require('../helper/embed');

    await liveCommand.execute(mockInteraction);

    // Check embed creation
    expect(createEmbed).toHaveBeenCalledWith(
      expect.stringContaining("C'est l'heure du live"),
      expect.stringContaining('https://www.twitch.tv/miission2567'),
      Colors.Purple,
      'mi-live.png'
    );

    // Check message sent
    expect(mockSend).toHaveBeenCalledWith({
      embeds: [
        expect.objectContaining({
          data: expect.objectContaining({
            title: "C'est l'heure du live",
            color: Colors.Purple,
          }),
        }),
      ],
      files: [
        expect.objectContaining({
          name: 'mi-live.png',
          path: expect.stringMatching(/mi-live\.png$/),
        }),
      ],
    });
  });
});
