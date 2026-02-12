import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

// BRIGHT VIBRANT COLORS - Neon Palette
const COLORS = {
  blue: "#3b82f6", // Bright blue
  emerald: "#10b981", // Bright emerald
  amber: "#f59e0b", // Bright amber
  purple: "#8b5cf6", // Bright purple
  pink: "#ec4899", // Bright pink
  teal: "#14b8a6", // Bright teal
  cyan: "#06b6d4", // Bright cyan
  lime: "#84cc16", // Bright lime
  indigo: "#6366f1", // Bright indigo
  rose: "#f43f5e", // Bright rose
};

const SkillsEvaluation = ({
  extractedSkills,
  searchQuery,
  setSearchQuery,
  loadMore,
  hasMore,
  loadingMore,
}) => {
  const lastElementRef = useInfiniteScroll(loadMore, hasMore, loadingMore);

  if (extractedSkills.length === 0 && !searchQuery) {
    return (
      <div className="col-span-full text-center py-12 text-gray-200 bg-white/5 rounded-2xl border-2 border-dashed border-white/20">
        <p className="text-xl font-semibold">
          No skills extracted yet. Analyze a repository to extract skills.
        </p>
      </div>
    );
  }

  if (extractedSkills.length === 0 && searchQuery) {
    return (
      <div className="col-span-full text-center py-12 text-gray-200 bg-white/5 rounded-2xl border-2 border-dashed border-white/20">
        <p className="text-xl font-semibold">
          No skills found matching "{searchQuery}".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="mb-6 relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
        <input
          type="text"
          placeholder="🔍 Search skills by repository name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="relative w-full px-5 py-3 bg-gray-900 border-2 border-white/20 rounded-xl text-white text-base placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all shadow-xl"
        />
      </div>

      {extractedSkills.map((skill, index) => {
        // Prepare radar chart data for core competencies
        const radarData = [
          {
            skill: "Technical",
            value: skill.technicalDepthScore || 0,
            fullMark: 100,
          },
          {
            skill: "Collaboration",
            value: skill.collaborationScore || 0,
            fullMark: 100,
          },
          {
            skill: "Consistency",
            value: skill.consistencyScore || 0,
            fullMark: 100,
          },
          {
            skill: "Architecture",
            value: skill.architectureScore || 0,
            fullMark: 100,
          },
          {
            skill: "Maturity",
            value: skill.maturityScore || 0,
            fullMark: 100,
          },
          {
            skill: "Career Ready",
            value: skill.careerReadinessIndex || 0,
            fullMark: 100,
          },
        ];

        // Prepare engineering skills bar data
        const engineeringData = skill.engineeringSkills
          ? [
              {
                name: "Git Flow",
                level: skill.engineeringSkills.gitWorkflowLevel || 0,
                fill: COLORS.emerald,
              },
              {
                name: "Testing",
                level: skill.engineeringSkills.testingLevel || 0,
                fill: COLORS.blue,
              },
              {
                name: "CI/CD",
                level: skill.engineeringSkills.ciCdLevel || 0,
                fill: COLORS.amber,
              },
              {
                name: "Quality",
                level: skill.engineeringSkills.codeQualityLevel || 0,
                fill: COLORS.purple,
              },
              {
                name: "Collaboration",
                level: skill.engineeringSkills.collaborationLevel || 0,
                fill: COLORS.pink,
              },
            ]
          : [];

        return (
          <div
            key={skill._id}
            ref={index === extractedSkills.length - 1 ? lastElementRef : null}
            className="bg-gray-900/40 backdrop-blur-md rounded-2xl border-2 border-white/20 p-6 md:p-8 hover:border-blue-400/50 hover:bg-gray-900/60 transition-all shadow-2xl hover:shadow-blue-500/10"
          >
            {/* Overall Scores Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h4 className="text-white text-2xl font-bold m-0 flex items-center gap-2 tracking-wide">
                  <span className="text-3xl">✨</span>
                  {skill.projectName}
                </h4>
                {skill.overallLevel && (
                  <span className="bg-blue-500/20 text-blue-200 px-4 py-1.5 rounded-lg text-base font-bold border border-blue-500/40 shadow-sm shadow-blue-900/20">
                    Level {skill.overallLevel}/5
                  </span>
                )}
              </div>

              {/* Overall Score Progress Bar */}
              {skill.overallScore !== undefined && (
                <div className="mb-8 bg-gray-800/50 rounded-2xl p-6 border-2 border-white/10 shadow-inner">
                  <div className="flex justify-between mb-3 items-end">
                    <p className="text-blue-300 text-lg font-bold">
                      🏆 Overall Score
                    </p>
                    <p className="text-white font-bold text-3xl">
                      {Math.round(skill.overallScore)}
                      <span className="text-lg text-gray-400 font-normal">
                        /100
                      </span>
                    </p>
                  </div>
                  <div className="h-6 rounded-full overflow-hidden border border-white/20 bg-gray-900">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg relative"
                      style={{ width: `${skill.overallScore}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Core Competency Scores Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {skill.technicalDepthScore !== undefined && (
                  <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                    <p className="text-blue-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                      Technical Depth
                    </p>
                    <p className="text-white font-bold text-2xl">
                      {Math.round(skill.technicalDepthScore)}
                    </p>
                  </div>
                )}
                {skill.collaborationScore !== undefined && (
                  <div className="p-4 bg-amber-900/20 rounded-xl border border-amber-500/30">
                    <p className="text-amber-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                      Collaboration
                    </p>
                    <p className="text-white font-bold text-2xl">
                      {Math.round(skill.collaborationScore)}
                    </p>
                  </div>
                )}
                {skill.consistencyScore !== undefined && (
                  <div className="p-4 bg-emerald-900/20 rounded-xl border border-emerald-500/30">
                    <p className="text-emerald-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                      Consistency
                    </p>
                    <p className="text-white font-bold text-2xl">
                      {Math.round(skill.consistencyScore)}
                    </p>
                  </div>
                )}
                {skill.architectureScore !== undefined && (
                  <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-500/30">
                    <p className="text-purple-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                      Architecture
                    </p>
                    <p className="text-white font-bold text-2xl">
                      {Math.round(skill.architectureScore)}
                    </p>
                  </div>
                )}
                {skill.maturityScore !== undefined && (
                  <div className="p-4 bg-pink-900/20 rounded-xl border border-pink-500/30">
                    <p className="text-pink-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                      Maturity
                    </p>
                    <p className="text-white font-bold text-2xl">
                      {Math.round(skill.maturityScore)}
                    </p>
                  </div>
                )}
                {skill.careerReadinessIndex !== undefined && (
                  <div className="p-4 bg-teal-900/20 rounded-xl border border-teal-500/30">
                    <p className="text-teal-300/80 text-xs uppercase tracking-wider font-bold mb-1">
                      Career Ready
                    </p>
                    <p className="text-white font-bold text-2xl">
                      {Math.round(skill.careerReadinessIndex)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Radar Chart for Core Competencies */}
              <div className="bg-gray-800/50 rounded-2xl p-6 border-2 border-white/10 shadow-inner">
                <h5 className="text-blue-300 text-lg font-bold mb-4 flex items-center gap-2">
                  🎯 Competency Radar
                </h5>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="75%"
                    data={radarData}
                  >
                    <PolarGrid stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{
                        fill: "#cbd5e1",
                        fontSize: 13,
                        fontWeight: "600",
                      }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{
                        fill: "#cbd5e1",
                        fontSize: 11,
                        fontWeight: "bold",
                      }}
                      stroke="rgba(255,255,255,0.2)"
                    />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke={COLORS.blue}
                      fill={COLORS.blue}
                      fillOpacity={0.6}
                      strokeWidth={3}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)", // dark slate
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontWeight: "bold",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Engineering Skills Bar Chart */}
              {engineeringData.length > 0 && (
                <div className="bg-gray-800/50 rounded-2xl p-6 border-2 border-white/10 shadow-inner">
                  <h5 className="text-emerald-300 text-lg font-bold mb-4 flex items-center gap-2">
                    🛠️ Engineering Skills Matrix
                  </h5>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={engineeringData} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.1)"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        domain={[0, 5]}
                        ticks={[0, 1, 2, 3, 4, 5]}
                        stroke="#cbd5e1"
                        fontSize={12}
                        fontWeight="bold"
                        tick={{ fill: "#cbd5e1" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#fff"
                        fontSize={13}
                        fontWeight="600"
                        tick={{ fill: "#fff" }}
                        width={100}
                        axisLine={false}
                        tickLine={false}
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
                      <Bar dataKey="level" radius={[0, 10, 10, 0]} barSize={25}>
                        {engineeringData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Language Skills */}
            {skill.languageSkills && skill.languageSkills.length > 0 && (
              <div className="mb-6 p-6 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl border-2 border-blue-500/30 hover:border-blue-500/50 transition-colors">
                <h5 className="text-blue-200 text-lg font-bold mb-4 border-b border-blue-500/30 pb-2">
                  💻 Language Skills
                </h5>
                <div className="flex flex-wrap gap-3">
                  {skill.languageSkills.map((langSkill, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-500/10 px-4 py-2.5 rounded-xl flex items-center gap-3 border border-blue-500/20 hover:bg-blue-500/20 transition-all shadow-md"
                    >
                      <span className="text-white font-bold text-base">
                        {langSkill.skillName}
                      </span>
                      <span className="bg-blue-500/30 text-blue-100 px-2 py-0.5 rounded-md text-xs font-bold border border-blue-400/50">
                        L{langSkill.level}
                      </span>
                      {langSkill.confidence !== undefined && (
                        <span className="text-blue-300 text-xs font-semibold">
                          {Math.round(langSkill.confidence * 100)}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skill.strengths && skill.strengths.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 p-6 rounded-2xl border-2 border-emerald-500/30 shadow-inner">
                  <p className="text-emerald-200 text-lg mb-4 font-bold border-b border-emerald-500/30 pb-2">
                    💪 Strengths
                  </p>
                  <div className="flex flex-col gap-3">
                    {skill.strengths.slice(0, 5).map((strength, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <span className="text-emerald-400 mt-1">✓</span>
                        <span className="text-gray-100 text-sm font-medium leading-relaxed">
                          {strength}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {skill.gaps && skill.gaps.length > 0 && (
                <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 p-6 rounded-2xl border-2 border-red-500/30 shadow-inner">
                  <p className="text-red-200 text-lg mb-4 font-bold border-b border-red-500/30 pb-2">
                    ⚠️ Improvement Areas
                  </p>
                  <div className="flex flex-col gap-3">
                    {skill.gaps.slice(0, 5).map((gap, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <span className="text-red-400 mt-1">!</span>
                        <span className="text-gray-100 text-sm font-medium leading-relaxed">
                          {gap}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Evaluated Timestamp */}
            {skill.evaluatedAt && (
              <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
                <p className="text-gray-400 text-xs font-semibold bg-black/20 px-3 py-1 rounded-full border border-white/5">
                  Evaluated on{" "}
                  {new Date(skill.evaluatedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Loading More Indicator */}
      {loadingMore && hasMore && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-300 mt-3 font-semibold">
            Loading more skills...
          </p>
        </div>
      )}

      {/* End of List Indicator */}
      {!hasMore && extractedSkills.length > 0 && (
        <div className="text-center py-8">
          <p className="py-2 px-6 bg-white/5 inline-block rounded-full text-gray-400 text-sm font-semibold border border-white/10">
            ✓ All skills loaded
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillsEvaluation;
