import React, { useState, useEffect } from "react";
import type { Module } from "../../../shared/types/curriculum";
import { CURRICULUM_CONFIG } from "../../../shared/types/curriculum";
import "./CurriculumModule.css";

interface CurriculumModuleProps {
  day?: number;
  isCompleted?: boolean;
  onEnroll?: () => void;
}

export const CurriculumModule: React.FC<CurriculumModuleProps> = ({
  day,
  isCompleted = false,
  onEnroll,
}) => {
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModule = async () => {
      try {
        if (day) {
          // Fetch specific module by day
          const response = await fetch(`/api/curriculum/modules/${day}`);
          const data = await response.json();
          setModule(data);
        }
      } catch (error) {
        console.error("Failed to load module:", error);
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, [day]);

  if (loading) {
    return <div className="curriculum-module loading">Loading module...</div>;
  }

  if (!module) {
    return <div className="curriculum-module error">Module not found</div>;
  }

  return (
    <div className="curriculum-module">
      <div className="module-header">
        <div className="module-title-section">
          <span className="module-day-badge">Day {module.day}</span>
          <h3 className="module-title">{module.title}</h3>
        </div>
        {isCompleted && <span className="completion-badge">✓ Completed</span>}
      </div>

      <p className="module-description">{module.description}</p>

      <div className="module-details">
        <div className="detail-group">
          <h4>Duration</h4>
          <p>{module.duration}</p>
        </div>

        {module.topics && module.topics.length > 0 && (
          <div className="detail-group">
            <h4>Topics Covered</h4>
            <ul className="topics-list">
              {module.topics.map((topic, idx) => (
                <li key={idx}>{topic}</li>
              ))}
            </ul>
          </div>
        )}

        {module.learningOutcomes && module.learningOutcomes.length > 0 && (
          <div className="detail-group">
            <h4>Learning Outcomes</h4>
            <ul className="outcomes-list">
              {module.learningOutcomes.map((outcome, idx) => (
                <li key={idx}>{outcome}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="detail-group">
          <h4>Assessment Method</h4>
          <p className="assessment-type">
            {module.assessmentType.charAt(0).toUpperCase() +
              module.assessmentType.slice(1).replace("-", " ")}
          </p>
        </div>
      </div>

      {module.resources && module.resources.length > 0 && (
        <div className="module-resources">
          <h4>Resources</h4>
          <ul className="resources-list">
            {module.resources.map((resource) => (
              <li key={resource.id}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  {resource.title}
                </a>
                <span className="resource-type">{resource.type}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="module-actions">
        {!isCompleted && onEnroll && (
          <button className="btn btn-primary" onClick={onEnroll}>
            Enroll in Module
          </button>
        )}
        <a
          href={CURRICULUM_CONFIG.NOTEBOOKLM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          View Full Curriculum
        </a>
      </div>
    </div>
  );
};

export const CurriculumOverview: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurriculum = async () => {
      try {
        const response = await fetch("/api/curriculum/overview");
        const data = await response.json();
        setModules(data.modules || []);
      } catch (error) {
        console.error("Failed to load curriculum:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCurriculum();
  }, []);

  if (loading) {
    return <div className="curriculum-overview loading">Loading...</div>;
  }

  return (
    <div className="curriculum-overview">
      <div className="overview-header">
        <h2>10-Day Ophthalmic Technician Training Program</h2>
        <p>
          A comprehensive high-intensity multimedia training program designed to
          prepare you to become clinic-ready.
        </p>
      </div>

      <div className="modules-grid">
        {modules.map((module) => (
          <div key={module.day} className="module-card">
            <div className="card-header">
              <span className="day-number">Day {module.day}</span>
              <h3>{module.title}</h3>
            </div>
            <p className="card-description">{module.description}</p>
            <div className="card-assessment">
              <strong>Assessment:</strong> {module.assessmentType}
            </div>
          </div>
        ))}
      </div>

      <div className="curriculum-footer">
        <p>
          For detailed curriculum information, visit our{" "}
          <a
            href={CURRICULUM_CONFIG.NOTEBOOKLM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            complete curriculum guide
          </a>
        </p>
      </div>
    </div>
  );
};
