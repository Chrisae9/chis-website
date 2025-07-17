// Third-party imports
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';

/**
 * Interface for external links displayed in the site navigation
 */
export interface DynamicLink {
  /** Display name of the link */
  name: string;
  /** URL for the link destination */
  url: string;
  /** Icon configuration for the link using Font Awesome */
  icon: {
    /** Font Awesome icon prefix ('fas' for solid, 'fab' for brands, etc.) */
    prefix: IconPrefix;
    /** Font Awesome icon name */
    name: IconName;
  };
}

/**
 * External links displayed in the sidebar
 * These are personal projects and social media profiles
 */
export const links: DynamicLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/chrisae9",
    icon: {
      prefix: "fab",
      name: "github"
    }
  },
  {
    name: "Coin Flip Tracker",
    url: "https://coin.chis.dev/",
    icon: {
      prefix: "fas",
      name: "coins"
    }
  },
  {
    name: "File Hosting",
    url: "https://share.chis.dev/",
    icon: {
      prefix: "fas",
      name: "folder"
    }
  },
  {
    name: "Steam Roulette",
    url: "https://steam.chis.dev/",
    icon: {
      prefix: "fab",
      name: "steam"
    }
  },
  {
    name: "Phase10 Randomizer",
    url: "https://phase.chis.dev/",
    icon: {
      prefix: "fas",
      name: "shuffle"
    }
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/chrisae9/",
    icon: {
      prefix: "fab",
      name: "linkedin"
    }
  },
  {
    name: "TypeRacer",
    url: "https://data.typeracer.com/pit/profile?user=chrisae9",
    icon: {
      prefix: "fas",
      name: "keyboard"
    }
  }
];
