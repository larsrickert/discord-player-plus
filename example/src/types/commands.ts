import {
  ChatInputApplicationCommandData,
  CommandInteraction,
} from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
  run: (interaction: CommandInteraction<"cached">) => Promise<unknown>;
}

export interface TrackFormattingOptions {
  includePlaylist?: boolean;
  escapeLinks?: boolean;
}
