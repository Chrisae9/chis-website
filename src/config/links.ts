export interface DynamicLink {
  name: string;
  url: string;
  icon?: {
    prefix: string;
    name: string;
  };
}

export const links: DynamicLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/chrisae9"
  },
  {
    name: "Coin Flip Tracker",
    url: "https://coin.chis.dev/"
  },
  {
    name: "File Hosting",
    url: "https://share.chis.dev/"
  },
  {
    name: "Steam Roulette",
    url: "https://steam.chis.dev/"
  },
  {
    name: "Phase10 Randomizer",
    url: "https://phase.chis.dev/"
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/chrisae9/"
  },
  {
    name: "TypeRacer",
    url: "https://data.typeracer.com/pit/profile?user=chrisae9"
  }
];