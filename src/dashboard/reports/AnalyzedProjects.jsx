import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

// BRIGHT VIBRANT COLORS - Neon Palette
const COLORS = {
  blue: "#3b82f6", // Bright blue
  emerald: "#10b981", // Bright emerald
  amber: "#f59e0b", // Bright amber
  purple: "#8b5cf6", // Bright purple
  pink: "#ec4899", // Bright pink
  cyan: "#06b6d4", // Bright cyan
  red: "#ef4444", // Bright red
  lime: "#84cc16", // Bright lime
  orange: "#f97316", // Bright orange
  indigo: "#6366f1", // Bright indigo
};

const AnalyzedProjects = ({
  analyzedProjects,
  searchQuery,
  setSearchQuery,
  loadMore,
  hasMore,
  loadingMore,
}) => {
  const lastElementRef = useInfiniteScroll(loadMore, hasMore, loadingMore);

  if (analyzedProjects.length === 0 && !searchQuery) {
    return (
      <div className="text-center py-12 text-gray-200 bg-white/5 rounded-2xl border-2 border-dashed border-white/20">
        <p className="text-xl font-semibold">
          No analyzed projects yet. Analyze a repository to see it here.
        </p>
      </div>
    );
  }

  if (analyzedProjects.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12 text-gray-200 bg-white/5 rounded-2xl border-2 border-dashed border-white/20">
        <p className="text-xl font-semibold">
          No projects found matching "{searchQuery}".
        </p>
      </div>
    );
  }

  return (
    <div className="reports-list space-y-8">
      {/* Search Bar */}
      <div className="mb-6 relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
        <input
          type="text"
          placeholder="🔍 Search analyzed projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="relative w-full px-5 py-3 bg-gray-900 border-2 border-white/20 rounded-xl text-white text-base placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all shadow-xl"
        />
      </div>

      {analyzedProjects.map((project, index) => {
        // Prepare data for charts with fallback checks
        const languageData = project.languageStats?.languagePercentage
          ? Object.entries(project.languageStats.languagePercentage).map(
              ([name, value]) => ({
                name,
                value,
              }),
            )
          : [];

        const commitActivityData = [
          {
            name: "Commits",
            value: project.commitStats?.totalCommits || 0,
            fill: COLORS.emerald,
          },
          {
            name: "Weeks",
            value: project.commitStats?.activeWeeks || 0,
            fill: COLORS.amber,
          },
          {
            name: "Files",
            value: Math.min(project.commitStats?.totalFilesChanged || 0, 500), // Cap for visual balance
            fill: COLORS.purple,
          },
        ];

        const healthMetrics = [
          {
            name: "Health",
            value: project.healthIndex || 0,
            fill: COLORS.emerald,
          },
          {
            name: "Maturity",
            value: (project.maturityLevel || 0) * 20,
            fill: COLORS.purple,
          },
          {
            name: "Consistency",
            value: project.commitStats?.consistencyScore || 0,
            fill: COLORS.blue,
          },
        ];

        return (
          <div
            key={project._id}
            ref={index === analyzedProjects.length - 1 ? lastElementRef : null}
            className="bg-gray-900/40 backdrop-blur-md rounded-2xl border-2 border-white/20 p-6 md:p-8 hover:border-blue-400/50 hover:bg-gray-900/60 transition-all shadow-2xl hover:shadow-blue-500/10"
          >
            {/* Header with Title and Badges */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h4 className="text-white text-2xl font-bold m-0 flex items-center gap-2 tracking-wide">
                <span className="text-3xl">📊</span>
                {project.repoName}
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.maturityLevel && (
                  <span className="bg-purple-500/20 text-purple-200 px-4 py-1.5 rounded-lg text-sm font-bold border border-purple-500/40 shadow-sm shadow-purple-900/20">
                    Level {project.maturityLevel}
                  </span>
                )}
                {project.healthIndex && (
                  <span
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold border shadow-sm ${
                      project.healthIndex >= 70
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-900/20"
                        : project.healthIndex >= 40
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-900/20"
                          : "bg-red-500/20 text-red-300 border-red-500/40 shadow-red-900/20"
                    }`}
                  >
                    Health: {Math.round(project.healthIndex)}
                  </span>
                )}
              </div>
            </div>

            {/* Charts Section - High Contrast Backgrounds */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Language Distribution Pie Chart */}
              {languageData.length > 0 && (
                <div className="bg-gray-800/50 rounded-2xl p-6 border-2 border-white/10 shadow-inner">
                  <h5 className="text-blue-300 text-lg font-bold mb-4 flex items-center gap-2">
                    📝 Language Distribution
                  </h5>
                  <div className="relative z-10">
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={languageData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            percent > 0.05 ? `${name} ` : ""
                          }
                          outerRadius={90}
                          innerRadius={50}
                          fill="#8884d8"
                          dataKey="value"
                          stroke="rgba(0,0,0,0.5)"
                          strokeWidth={2}
                          paddingAngle={2}
                        >
                          {languageData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                Object.values(COLORS)[
                                  index % Object.values(COLORS).length 
                                ]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.95)", // dark slate
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "12px",
                            color: "#fff",
                            fontWeight: "bold",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
                          }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Legend
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                          iconType="circle"
                          wrapperStyle={{ fontSize: "12px", fontWeight: "600" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Health Metrics Radial Chart */}
              <div className="bg-gray-800/50 rounded-2xl p-6 border-2 border-white/10 shadow-inner">
                <h5 className="text-emerald-300 text-lg font-bold mb-4 flex items-center gap-2">
                  🎯 Health Metrics
                </h5>
                <div className="relative z-10">
                  <ResponsiveContainer width="100%" height={240}>
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="20%"
                      outerRadius="100%"
                      barSize={16}
                      data={healthMetrics}
                    >
                      <RadialBar
                        minAngle={15}
                        background={{ fill: "rgba(255,255,255,0.05)" }}
                        clockWise
                        dataKey="value"
                        cornerRadius={8}
                        label={{
                          position: "insideStart",
                          fill: "#fff",
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      />
                      <Legend
                        iconSize={14}
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{
                          fontSize: "14px",
                          color: "#e2e8f0",
                          fontWeight: "bold",
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.95)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "12px",
                          color: "#fff",
                          fontWeight: "bold",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
                        }}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Commit Activity Bar Chart - Full Width */}
            {project.commitStats && (
              <div className="mb-8 p-6 bg-gray-800/50 rounded-2xl border-2 border-white/10 shadow-inner">
                <h5 className="text-purple-300 text-lg font-bold mb-4 flex items-center gap-2">
                  💻 Commit Activity Overview
                </h5>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={commitActivityData} barSize={40}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#cbd5e1"
                      fontSize={14}
                      fontWeight="600"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#cbd5e1"
                      fontSize={13}
                      fontWeight="600"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {commitActivityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Stats Grid - High Visibility Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Language Stats */}
              {project.languageStats && (
                <div className="p-6 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl border-2 border-blue-500/30 hover:border-blue-500/50 transition-colors">
                  <h5 className="text-blue-200 text-lg font-bold mb-4 border-b border-blue-500/30 pb-2">
                    📝 Language Intelligence
                  </h5>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-blue-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                        Primary Language
                      </p>
                      <p className="text-white font-bold text-lg tracking-wide">
                        {project.languageStats.primaryLanguage}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                        Dominance
                      </p>
                      <p className="text-cyan-300 font-bold text-lg tracking-wide">
                        {project.languageStats.dominantLanguagePercent?.toFixed(
                          1,
                        )}
                        %
                      </p>
                    </div>
                    {project.languageStats.totalLanguagesUsed && (
                      <div className="col-span-2 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-blue-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                              Languages Used
                            </p>
                            <p className="text-white font-bold text-xl">
                              {project.languageStats.totalLanguagesUsed}
                            </p>
                          </div>
                          {project.languageStats.multiLanguageScore && (
                            <div className="text-right">
                              <p className="text-blue-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                                Polyglot Score
                              </p>
                              <p className="text-amber-300 font-bold text-xl">
                                {Math.round(
                                  project.languageStats.multiLanguageScore,
                                )}
                                /100
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Commit Stats */}
              {project.commitStats && (
                <div className="p-6 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-colors">
                  <h5 className="text-emerald-200 text-lg font-bold mb-4 border-b border-emerald-500/30 pb-2">
                    💻 Commit Activity
                  </h5>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-emerald-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                        Total Commits
                      </p>
                      <p className="text-white font-bold text-lg tracking-wide">
                        {project.commitStats.totalCommits}
                      </p>
                    </div>
                    {project.commitStats.consistencyScore !== undefined && (
                      <div>
                        <p className="text-emerald-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                          Consistency
                        </p>
                        <p className="text-lime-300 font-bold text-lg tracking-wide">
                          {Math.round(project.commitStats.consistencyScore)}%
                        </p>
                      </div>
                    )}
                    {project.commitStats.activeWeeks && (
                      <div className="col-span-2 bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-emerald-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                              Active Weeks
                            </p>
                            <p className="text-white font-bold text-xl">
                              {project.commitStats.activeWeeks}
                            </p>
                          </div>
                          {project.commitStats.commitFrequencyPerWeek && (
                            <div className="text-right">
                              <p className="text-emerald-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                                Commits/Week
                              </p>
                              <p className="text-emerald-200 font-bold text-xl">
                                {project.commitStats.commitFrequencyPerWeek.toFixed(
                                  1,
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Collaboration Stats */}
              {project.collaborationStats && (
                <div className="p-6 bg-gradient-to-br from-amber-900/40 to-orange-900/40 rounded-2xl border-2 border-amber-500/30 hover:border-amber-500/50 transition-colors">
                  <h5 className="text-amber-200 text-lg font-bold mb-4 border-b border-amber-500/30 pb-2">
                    👥 Collaboration
                  </h5>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    {project.collaborationStats.totalContributors !==
                      undefined && (
                      <div>
                        <p className="text-amber-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                          Contributors
                        </p>
                        <p className="text-white font-bold text-lg tracking-wide">
                          {project.collaborationStats.totalContributors}
                        </p>
                      </div>
                    )}
                    {project.collaborationStats.prMergeRate !== undefined && (
                      <div>
                        <p className="text-amber-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                          PR Merge Rate
                        </p>
                        <p className="text-orange-300 font-bold text-lg tracking-wide">
                          {(
                            project.collaborationStats.prMergeRate * 100
                          ).toFixed(0)}
                          %
                        </p>
                      </div>
                    )}
                    {project.collaborationStats.issueResolutionRate !==
                      undefined && (
                      <div className="col-span-2 bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                        <p className="text-amber-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                          Issue Resolution Rate
                        </p>
                        <p className="text-white font-bold text-xl">
                          {(
                            project.collaborationStats.issueResolutionRate * 100
                          ).toFixed(0)}
                          %
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Architecture Stats */}
              {project.architectureStats && (
                <div className="p-6 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl border-2 border-purple-500/30 hover:border-purple-500/50 transition-colors">
                  <h5 className="text-purple-200 text-lg font-bold mb-4 border-b border-purple-500/30 pb-2">
                    🏗️ Architecture
                  </h5>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    {project.architectureStats.branchCount !== undefined && (
                      <div>
                        <p className="text-purple-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                          Branches
                        </p>
                        <p className="text-white font-bold text-lg tracking-wide">
                          {project.architectureStats.branchCount}
                        </p>
                      </div>
                    )}
                    {project.architectureStats.releaseCount !== undefined && (
                      <div>
                        <p className="text-purple-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                          Releases
                        </p>
                        <p className="text-pink-300 font-bold text-lg tracking-wide">
                          {project.architectureStats.releaseCount}
                        </p>
                      </div>
                    )}
                    <div className="col-span-2 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20 grid grid-cols-2 gap-4">
                      {project.architectureStats.hasCI !== undefined && (
                        <div>
                          <p className="text-purple-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                            CI/CD
                          </p>
                          <p
                            className={`font-bold text-base ${project.architectureStats.hasCI ? "text-emerald-300" : "text-red-300"}`}
                          >
                            {project.architectureStats.hasCI
                              ? "✓ Enabled"
                              : "✗ Disabled"}
                          </p>
                        </div>
                      )}
                      {project.architectureStats.hasTests !== undefined && (
                        <div>
                          <p className="text-purple-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                            Testing
                          </p>
                          <p
                            className={`font-bold text-base ${project.architectureStats.hasTests ? "text-emerald-300" : "text-red-300"}`}
                          >
                            {project.architectureStats.hasTests
                              ? "✓ Detected"
                              : "✗ Missing"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GitHub Link Button */}
            <div className="mt-8 flex justify-end">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg group"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View Repository on GitHub
                <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>
            </div>
          </div>
        );
      })}

      {/* Loading & End Indicators */}
      {loadingMore && hasMore && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-300 mt-3 font-semibold">
            Loading more projects...
          </p>
        </div>
      )}

      {!hasMore && analyzedProjects.length > 0 && (
        <div className="text-center py-8">
          <p className="py-2 px-6 bg-white/5 inline-block rounded-full text-gray-400 text-sm font-semibold border border-white/10">
            ✓ All analyzed projects loaded
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyzedProjects;
