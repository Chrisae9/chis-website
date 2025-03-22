import { SearchBar } from './components/SearchBar';
import { TagList } from './components/TagList';
import { PostContent } from './components/PostContent';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { DynamicLinks } from './components/DynamicLinks';
import { TableOfContents } from './components/TableOfContents';
import { PostList } from './components/PostList';
import { links } from './config/links';
import { usePosts } from './hooks/usePosts';
import { useTheme } from './hooks/useTheme';
import { useSidebar } from './hooks/useSidebar';
import { useSectionNavigation } from './hooks/useSectionNavigation';

function App() {
  // Custom hooks for different concerns
  const { 
    filteredPosts, 
    selectedPostData, 
    searchTerm, 
    setSearchTerm,
    selectedTags,
    handleTagToggle,
    selectedCategory,
    setSelectedCategory,
    allTags,
    allCategories,
    sortOrder,
    setSortOrder,
    handlePostSelect,
    posts,
    isLoading,
    error
  } = usePosts();
  
  const { darkMode, toggleDarkMode } = useTheme();
  
  const { 
    showLeftSidebar, 
    setShowLeftSidebar, 
    showRightSidebar, 
    setShowRightSidebar 
  } = useSidebar();
  
  const {
    sectionState,
    hasConnectedPosts,
    scrollToConnectedPosts
  } = useSectionNavigation(selectedPostData || null, posts);

  // Left sidebar content - show table of contents when viewing a post
  const leftSidebarContent = selectedPostData ? (
    <Sidebar
      title="Table of Contents"
      onClose={() => setShowLeftSidebar(false)}
      showMobileHeader={true}
    >
      <div className="sticky-toc">
        <TableOfContents 
          content={selectedPostData.content} 
          hasConnectedPosts={hasConnectedPosts}
          onConnectedPostsClick={scrollToConnectedPosts}
          isConnectedPostsActive={sectionState.connected}
        />
      </div>
    </Sidebar>
  ) : (
    <Sidebar
      title="Tags"
      onClose={() => setShowLeftSidebar(false)}
      showMobileHeader={true}
    >
      <TagList
        tags={allTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
      />
    </Sidebar>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Error Loading Content</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      showLeftSidebar={showLeftSidebar}
      showRightSidebar={showRightSidebar}
      setShowLeftSidebar={setShowLeftSidebar}
      setShowRightSidebar={setShowRightSidebar}
      header={
        selectedPostData ? (
          <button
            onClick={() => handlePostSelect(null)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back to posts
          </button>
        ) : (
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        )
      }
      leftSidebar={leftSidebarContent}
      rightSidebar={
        <Sidebar
          title="Links"
          onClose={() => setShowRightSidebar(false)}
          showMobileHeader={true}
        >
          <div className="space-y-3">
            <DynamicLinks links={links} />
          </div>
        </Sidebar>
      }
      isPostView={!!selectedPostData}
    >
      {selectedPostData ? (
        <PostContent
          post={selectedPostData}
          onBack={() => handlePostSelect(null)}
          darkMode={darkMode}
          onPostClick={handlePostSelect}
          allPosts={posts}
          isConnectedPostsActive={sectionState.connected}
          isCommentsActive={sectionState.comments}
        />
      ) : (
        <PostList
          posts={filteredPosts}
          searchTerm={searchTerm}
          onPostClick={handlePostSelect}
          categories={allCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      )}
    </Layout>
  );
}

export default App;
