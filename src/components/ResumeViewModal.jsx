import React from "react";

const ResumeViewModal = ({ isOpen, onClose, resumeData }) => {
  if (!isOpen || !resumeData) return null;

  // Handle nested structure: resumeData might have resumeDetails
  const resumeDetails = resumeData.resumeDetails || resumeData;
  const resumeText = resumeDetails.resumeText;
  const resumeUrl = resumeDetails.resumeUrl;
  const uploadedAt = resumeData.uploadedAt || resumeDetails.uploadedAt;

  if (!resumeText) return null;

  // Parse resume text into sections
  const parseResumeText = (text) => {
    const lines = text.split("\n");
    const sections = {
      personalDetails: { name: "", contact: "", location: "" },
      education: [],
      experience: [],
      projects: [],
      skills: [],
      achievements: [],
      socialLinks: { linkedin: "", github: "", website: "" },
    };

    let currentSection = "";

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Extract name (first line)
      if (index === 0 && trimmedLine) {
        sections.personalDetails.name = trimmedLine;
        return;
      }

      // Extract contact info and social links
      if (trimmedLine.includes("@") || trimmedLine.includes("+")) {
        const parts = trimmedLine.split("⋄").map((p) => p.trim());
        parts.forEach((part) => {
          if (part.includes("@")) sections.personalDetails.contact = part;
          if (part.includes("linkedin.com"))
            sections.socialLinks.linkedin = part;
          if (part.includes("github.com")) sections.socialLinks.github = part;
          if (
            !part.includes("@") &&
            !part.includes("linkedin") &&
            !part.includes("github") &&
            part.length > 5
          ) {
            sections.personalDetails.location = part;
          }
        });
        return;
      }

      // Detect sections
      if (
        trimmedLine === trimmedLine.toUpperCase() &&
        trimmedLine.length > 2 &&
        trimmedLine.length < 50
      ) {
        if (trimmedLine.includes("EDUCATION")) currentSection = "education";
        else if (trimmedLine.includes("EXPERIENCE"))
          currentSection = "experience";
        else if (trimmedLine.includes("PROJECT")) currentSection = "projects";
        else if (trimmedLine.includes("SKILL")) currentSection = "skills";
        else if (trimmedLine.includes("ACHIEVEMENT"))
          currentSection = "achievements";
        return;
      }

      // Add content to sections
      if (currentSection && trimmedLine) {
        sections[currentSection].push(trimmedLine);
      }
    });

    return sections;
  };

  const sections = parseResumeText(resumeText);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-white/20 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📄</span> Resume Details
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 flex items-center justify-center transition-colors border border-red-500/30"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Personal Details */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
              <span>👤</span> Personal Details
            </h3>
            <div className="space-y-2">
              <p className="text-white text-2xl font-bold">
                {sections.personalDetails.name}
              </p>
              {sections.personalDetails.contact && (
                <p className="text-gray-300">
                  📧 {sections.personalDetails.contact}
                </p>
              )}
              {sections.personalDetails.location && (
                <p className="text-gray-300">
                  📍 {sections.personalDetails.location}
                </p>
              )}
            </div>
          </div>

          {/* Social Links */}
          {(sections.socialLinks.linkedin || sections.socialLinks.github) && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                <span>🔗</span> Social Links
              </h3>
              <div className="space-y-2">
                {sections.socialLinks.linkedin && (
                  <p className="text-blue-400">
                    <span className="text-gray-400">LinkedIn:</span>{" "}
                    {sections.socialLinks.linkedin}
                  </p>
                )}
                {sections.socialLinks.github && (
                  <p className="text-blue-400">
                    <span className="text-gray-400">GitHub:</span>{" "}
                    {sections.socialLinks.github}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {sections.education.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                <span>🎓</span> Education
              </h3>
              <div className="space-y-3 text-gray-300">
                {sections.education.map((line, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {sections.experience.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-orange-300 mb-4 flex items-center gap-2">
                <span>💼</span> Experience
              </h3>
              <div className="space-y-3 text-gray-300">
                {sections.experience.map((line, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {sections.projects.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
                <span>🚀</span> Projects
              </h3>
              <div className="space-y-3 text-gray-300">
                {sections.projects.map((line, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {sections.skills.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-pink-300 mb-4 flex items-center gap-2">
                <span>🛠️</span> Skills
              </h3>
              <div className="space-y-2 text-gray-300">
                {sections.skills.map((line, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {sections.achievements.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                <span>🏆</span> Achievements
              </h3>
              <div className="space-y-2 text-gray-300">
                {sections.achievements.map((line, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            Uploaded on{" "}
            {uploadedAt ? new Date(uploadedAt).toLocaleDateString() : "N/A"}
          </p>
          <div className="flex gap-3">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium border border-blue-500/30"
            >
              Download PDF
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium border border-white/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewModal;
