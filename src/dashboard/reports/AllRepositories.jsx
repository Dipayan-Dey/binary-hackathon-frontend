import React, { useEffect } from "react";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const AllRepositories = ({
  repos,
  handleAnalyzeRepo,
  analyzing,
  selectedRepo,
  searchQuery,
  setSearchQuery,
  languageFilter,
  setLanguageFilter,
  visibilityFilter,
  setVisibilityFilter,
  analyzedRepos,
  loadMore,
  hasMore,
  loadingMore,
}) => {
  // Infinite scroll hook
  const lastElementRef = useInfiniteScroll(loadMore, hasMore, loadingMore);

  // Get unique languages for filter
  const uniqueLanguages = [
    ...new Set(repos.map((r) => r.language).filter(Boolean)),
  ];

  // Client-side filtering for language and visibility
  const filteredRepos = repos.filter((repo) => {
    const matchesLanguage =
      languageFilter === "all" || repo.language === languageFilter;
    const matchesVisibility =
      visibilityFilter === "all" ||
      (visibilityFilter === "public" && !repo.private) ||
      (visibilityFilter === "private" && repo.private);
    return matchesLanguage && matchesVisibility;
  });

  return (
    <>
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        {/* Search */}
        <div className="flex-1 min-w-[250px]">
          <input
            type="text"
            placeholder="🔍 Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white text-base placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Language Filter */}
        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white text-base cursor-pointer focus:border-blue-400 focus:outline-none transition-colors"
        >
          <option value="all" className="bg-gray-800">
            All Languages
          </option>
          {uniqueLanguages.map((lang) => (
            <option key={lang} value={lang} className="bg-gray-800">
              {lang}
            </option>
          ))}
        </select>

        {/* Visibility Filter */}
        <select
          value={visibilityFilter}
          onChange={(e) => setVisibilityFilter(e.target.value)}
          className="px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white text-base cursor-pointer focus:border-blue-400 focus:outline-none transition-colors"
        >
          <option value="all" className="bg-gray-800">
            All Repos
          </option>
          <option value="public" className="bg-gray-800">
            Public Only
          </option>
          <option value="private" className="bg-gray-800">
            Private Only
          </option>
        </select>
      </div>

      {/* Repository List */}
      <div className="space-y-4">
        {filteredRepos.length === 0 ? (
          <div className="text-center py-12 text-gray-300">
            <p className="text-lg">No repositories found</p>
          </div>
        ) : (
          filteredRepos.map((repo, index) => (
            <div
              key={repo.fullName}
              ref={index === filteredRepos.length - 1 ? lastElementRef : null}
              className="bg-white/10 rounded-xl border-2 border-white/30 p-5 hover:border-sky-400 hover:bg-white/20 transition-all shadow-lg hover:shadow-sky-500/20"
            >
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h4 className="text-white text-xl font-bold m-0 tracking-wide">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sky-300 transition-colors flex items-center gap-2"
                      >
                        {repo.name}
                      </a>
                    </h4>
                    {repo.private ? (
                      <span className="bg-amber-500/20 text-amber-200 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/50 shadow-sm shadow-amber-900/20">
                        🔒 Private
                      </span>
                    ) : (
                      <span className="bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/50 shadow-sm shadow-emerald-900/20">
                        🔓 Public
                      </span>
                    )}
                  </div>
                  <p className="text-gray-100 mb-4 text-sm leading-relaxed border-l-2 border-white/20 pl-3">
                    {repo.description ||
                      "No description provided for this repository."}
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="bg-blue-600/30 text-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-400/50 flex items-center gap-2">
                      {repo.language || "Unknown"}
                    </span>
                    <span className="text-yellow-200 text-sm font-semibold flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20">
                      ⭐ {repo.stars || 0} Stars
                    </span>
                    {/* <span className="text-purple-200 text-sm font-semibold flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/20">
                      🍴 {repo.forks || 0} Forks
                    </span> */}
                  </div>
                </div>

                <div className="w-full md:w-auto mt-4 md:mt-0">
                  <button
                    onClick={() => handleAnalyzeRepo(repo.fullName)}
                    disabled={
                      (analyzing && selectedRepo === repo.fullName) ||
                      analyzedRepos.has(repo.fullName)
                    }
                    className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg border-2 ${
                      analyzedRepos.has(repo.fullName)
                        ? "bg-green-600/20 text-green-300 border-green-500/50 cursor-not-allowed"
                        : analyzing && selectedRepo === repo.fullName
                          ? "bg-blue-600/20 text-blue-300 border-blue-500/50 cursor-wait animate-pulse"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-transparent hover:border-blue-300 hover:shadow-blue-500/50 active:scale-95"
                    }`}
                  >
                    {analyzing && selectedRepo === repo.fullName ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                        Analyzing...
                      </>
                    ) : analyzedRepos.has(repo.fullName) ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Analyzed
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                          />
                        </svg>
                        Analyze Repo
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Loading More Indicator */}
      {loadingMore && hasMore && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-300 mt-3 font-semibold">
            Loading more repositories...
          </p>
        </div>
      )}

      {/* End of List Indicator */}
      {!hasMore && repos.length > 0 && (
        <div className="text-center py-6">
          <p className="text-gray-400 text-sm font-semibold">
            ✓ All repositories loaded
          </p>
        </div>
      )}
    </>
  );
};

export default AllRepositories;
