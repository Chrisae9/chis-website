/**
 * @file Integration tests for post loading functionality
 * @description Tests that verify all posts are properly loaded and searchable
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import App from '../../App';

// Mock the import.meta.glob for controlled testing
vi.mock('../../services/postService', async () => {
  const actual = await vi.importActual('../../services/postService');
  return {
    ...actual,
    loadPosts: vi.fn().mockImplementation(async (includeDrafts = false, includeHidden = false) => {
      // Simulate the actual posts from the filesystem
      const allPosts = [
        {
          slug: 'balatro-modded',
          frontmatter: {
            title: 'Modding Balatro on Steam Deck',
            date: '2025-03-21',
            summary: 'A guide to installing mods for Balatro on the Steam Deck using the Bunco mod framework.',
            tags: ['Gaming', 'Modding', 'Steam Deck'],
            category: 'Steam Deck',
          },
          content: 'Content about Balatro modding...'
        },
        {
          slug: 'remote-steam-deck',
          frontmatter: {
            title: 'Remotely Accessing Your Steam Deck',
            date: '2025-03-21',
            summary: 'A guide on how to remotely access your Steam Deck from another computer using Steam Link and SSH.',
            tags: ['Steam Deck', 'SSH'],
            category: 'Steam Deck',
          },
          content: 'Content about remote access...'
        },
        {
          slug: 'slay-the-spire-modded',
          frontmatter: {
            title: 'Modding Slay The Spire on Steam Deck',
            date: '2025-03-21',
            summary: 'A guide to installing mods for Slay the Spire on the Steam Deck, with a focus on the Downfall Expansion Mod.',
            tags: ['Gaming', 'Modding', 'Steam Deck'],
            category: 'Steam Deck',
          },
          content: 'Content about Slay The Spire modding...'
        },
        {
          slug: 'bolt-diy',
          frontmatter: {
            title: 'Using Bolt to Build a Website',
            date: '2025-03-18',
            summary: 'Exploring the capabilities of Bolt and Bolt.diy for building a personal website, comparing their features, limitations, and overall usability.',
            tags: ['AI', 'Website'],
            category: 'AI',
          },
          content: 'Content about Bolt website building...'
        },
        {
          slug: 'code-tunnel',
          frontmatter: {
            title: 'VSCode Tunnel Service on Arch Linux',
            date: '2024-01-30',
            summary: 'Guide on how to set up a VSCode tunnel service on your Arch Linux system, allowing you to connect to your remote development server seamlessly through the https://vscode.dev/ website.',
            tags: ['Arch', 'Chromebook', 'VSCode'],
            category: 'Docs',
          },
          content: 'Content about VSCode tunnel...'
        },
        {
          slug: 'discord-webhook',
          frontmatter: {
            title: 'Discord Webhook Integration',
            date: '2023-12-01',
            summary: 'A quick overview of Discord slash commands and a bit of history behind Discord bots.',
            tags: ['Discord', 'Server', 'Webhook'],
            category: 'Web',
          },
          content: 'Content about Discord webhooks...'
        },
        {
          slug: 'github-gpgsign',
          frontmatter: {
            title: 'Signing GitHub commits with GPG Key',
            date: '2022-06-09',
            summary: 'Signing GitHub commits with a GPG key. Reference to importing and exporting key to different devices through ssh/file transfer.',
            tags: ['Git', 'Security'],
            category: 'Docs',
          },
          content: 'Content about GPG signing...'
        },
        {
          slug: 'phase10randomizer',
          frontmatter: {
            title: 'Phase10 Randomizer',
            date: '2021-04-22',
            summary: 'How I created a web app to generate a new rules for Phase 10.',
            tags: ['App', 'Website'],
            category: 'Website',
          },
          content: 'Content about Phase10 randomizer...'
        },
        // Draft posts (should be excluded unless includeDrafts is true)
        {
          slug: 'pz-server',
          frontmatter: {
            title: 'Project Zomboid Server',
            date: '2025-01-01',
            summary: 'Setting up a Project Zomboid server.',
            tags: ['Gaming', 'Server'],
            category: 'Gaming',
            draft: true,
          },
          content: 'Content about PZ server...'
        },
        {
          slug: 'raid-troubleshoot',
          frontmatter: {
            title: 'RAID Troubleshooting',
            date: '2025-01-01',
            summary: 'Troubleshooting RAID issues.',
            tags: ['Hardware'],
            category: 'Hardware',
            draft: true,
          },
          content: 'Content about RAID...'
        },
        // Hidden posts (should be excluded unless includeHidden is true)
        {
          slug: 'privacy-policy',
          frontmatter: {
            title: 'Privacy Policy',
            date: '2025-01-01',
            summary: 'Privacy policy for the website.',
            tags: ['Legal'],
            category: 'Legal',
            hidden: true,
          },
          content: 'Privacy policy content...'
        },
        {
          slug: 'terms-of-service',
          frontmatter: {
            title: 'Terms of Service',
            date: '2025-01-01',
            summary: 'Terms of service for the website.',
            tags: ['Legal'],
            category: 'Legal',
            hidden: true,
          },
          content: 'Terms of service content...'
        },
      ];

      // Filter based on flags
      let filteredPosts = allPosts;
      
      if (!includeDrafts) {
        filteredPosts = filteredPosts.filter(post => !post.frontmatter.draft);
      }
      
      if (!includeHidden) {
        filteredPosts = filteredPosts.filter(post => !post.frontmatter.hidden);
      }
      
      return filteredPosts;
    })
  };
});

/**
 * Renders the App component within a router context for testing
 */
function renderApp() {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

describe('Post Loading Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load and display all visible posts (excluding drafts and hidden)', async () => {
    renderApp();
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument();
    });

    // Verify all visible posts are displayed (8 posts total: excluding 2 drafts and 2 hidden)
    await waitFor(() => {
      expect(screen.getByText('Modding Balatro on Steam Deck')).toBeInTheDocument();
      expect(screen.getByText('Remotely Accessing Your Steam Deck')).toBeInTheDocument();
      expect(screen.getByText('Modding Slay The Spire on Steam Deck')).toBeInTheDocument();
      expect(screen.getByText('Using Bolt to Build a Website')).toBeInTheDocument();
      expect(screen.getByText('VSCode Tunnel Service on Arch Linux')).toBeInTheDocument();
      expect(screen.getByText('Discord Webhook Integration')).toBeInTheDocument();
      expect(screen.getByText('Signing GitHub commits with GPG Key')).toBeInTheDocument();
      expect(screen.getByText('Phase10 Randomizer')).toBeInTheDocument();
    });

    // Verify draft posts are NOT displayed
    expect(screen.queryByText('Project Zomboid Server')).not.toBeInTheDocument();
    expect(screen.queryByText('RAID Troubleshooting')).not.toBeInTheDocument();

    // Verify hidden posts are NOT displayed
    expect(screen.queryByText('Privacy Policy')).not.toBeInTheDocument();
    expect(screen.queryByText('Terms of Service')).not.toBeInTheDocument();
  });

  it('should make all visible posts searchable', async () => {
    renderApp();
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', { name: /search posts/i });

    // Test search for "Steam" - should find Steam Deck posts
    fireEvent.change(searchInput, { target: { value: 'Steam' } });
    
    await waitFor(() => {
      expect(screen.getByText('Modding Balatro on Steam Deck')).toBeInTheDocument();
      expect(screen.getByText('Remotely Accessing Your Steam Deck')).toBeInTheDocument();
      expect(screen.getByText('Modding Slay The Spire on Steam Deck')).toBeInTheDocument();
    });

    // Test search for "AI" - should find Bolt post
    fireEvent.change(searchInput, { target: { value: 'AI' } });
    
    await waitFor(() => {
      expect(screen.getByText('Using Bolt to Build a Website')).toBeInTheDocument();
      // Other posts should not be visible
      expect(screen.queryByText('Modding Balatro on Steam Deck')).not.toBeInTheDocument();
    });

    // Test search for "Discord" - should find Discord webhook post
    fireEvent.change(searchInput, { target: { value: 'Discord' } });
    
    await waitFor(() => {
      expect(screen.getByText('Discord Webhook Integration')).toBeInTheDocument();
    });

    // Test search for "GPG" - should find GitHub commits post
    fireEvent.change(searchInput, { target: { value: 'GPG' } });
    
    await waitFor(() => {
      expect(screen.getByText('Signing GitHub commits with GPG Key')).toBeInTheDocument();
    });
  });

  it('should filter posts by tags correctly', async () => {
    renderApp();
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument();
    });

    // Click on the "Gaming" tag
    const gamingTag = screen.getByRole('button', { name: 'Gaming' });
    fireEvent.click(gamingTag);

    // Should only show gaming posts
    await waitFor(() => {
      expect(screen.getByText('Modding Balatro on Steam Deck')).toBeInTheDocument();
      expect(screen.getByText('Modding Slay The Spire on Steam Deck')).toBeInTheDocument();
      
      // Non-gaming posts should not be visible
      expect(screen.queryByText('Using Bolt to Build a Website')).not.toBeInTheDocument();
      expect(screen.queryByText('VSCode Tunnel Service on Arch Linux')).not.toBeInTheDocument();
    });
  });

  it('should filter posts by category correctly', async () => {
    renderApp();
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument();
    });

    // Open category dropdown
    const categoryButton = screen.getByRole('button', { name: /category filter/i });
    fireEvent.click(categoryButton);

    // Select "Steam Deck" category
    const steamDeckOption = screen.getByRole('button', { name: 'Steam Deck' });
    fireEvent.click(steamDeckOption);

    // Should only show Steam Deck posts
    await waitFor(() => {
      expect(screen.getByText('Modding Balatro on Steam Deck')).toBeInTheDocument();
      expect(screen.getByText('Remotely Accessing Your Steam Deck')).toBeInTheDocument();
      expect(screen.getByText('Modding Slay The Spire on Steam Deck')).toBeInTheDocument();
      
      // Non-Steam Deck posts should not be visible
      expect(screen.queryByText('Using Bolt to Build a Website')).not.toBeInTheDocument();
    });
  });

  it('should sort posts correctly', async () => {
    renderApp();
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument();
    });

    // Get all post titles in order
    const postTitles = screen.getAllByRole('heading', { level: 2 });
    
    // Should be sorted by newest first by default (March 2025 posts first)
    expect(postTitles[0]).toHaveTextContent('Modding Balatro on Steam Deck');
    expect(postTitles[1]).toHaveTextContent('Remotely Accessing Your Steam Deck');
    expect(postTitles[2]).toHaveTextContent('Modding Slay The Spire on Steam Deck');
    
    // Click "Oldest" to sort by oldest first
    const oldestButton = screen.getByRole('button', { name: /sort by oldest first/i });
    fireEvent.click(oldestButton);

    await waitFor(() => {
      const sortedPostTitles = screen.getAllByRole('heading', { level: 2 });
      // Should now be sorted by oldest first (2021 post first)
      expect(sortedPostTitles[0]).toHaveTextContent('Phase10 Randomizer');
    });
  });

  it('should handle empty search results gracefully', async () => {
    renderApp();
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', { name: /search posts/i });

    // Search for something that doesn't exist
    fireEvent.change(searchInput, { target: { value: 'nonexistent-term-xyz' } });
    
    await waitFor(() => {
      expect(screen.getByText('No posts found. Try adjusting your filters.')).toBeInTheDocument();
    });
  });
});
