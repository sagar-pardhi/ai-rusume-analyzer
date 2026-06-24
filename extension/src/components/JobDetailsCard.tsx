import type { JobDetails } from "../types/job";

interface JobDetailsCardProps {
  jobData: JobDetails;
}

export function JobDetailsCard({ jobData }: JobDetailsCardProps) {
  return (
    <div className="mt-4 space-y-2 text-sm">
      <div>
        <strong>Title:</strong> {jobData.title}
      </div>

      <div>
        <strong>Company:</strong> {jobData.company}
      </div>

      <div>
        <strong>Experience:</strong> {jobData.experience}
      </div>

      <div>
        <strong>Location:</strong> {jobData.location}
      </div>

      <div>
        <strong>Skills:</strong>
      </div>

      <ul>
        {jobData.skills?.map((skill: string) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <div className="mt-3">
        <strong>Job Description</strong>

        <p className="mt-2 rounded-lg border p-3 text-sm">
          {jobData.description}
        </p>
      </div>
    </div>
  );
}
