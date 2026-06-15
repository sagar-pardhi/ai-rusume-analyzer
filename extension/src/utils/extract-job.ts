export interface JobDetails {
  title: string;
  company: string;
  experience: string;
  location: string;
}

export function extractJob(): JobDetails {
  const title =
    document.querySelector("#job_header h1")?.textContent?.trim() || "";

  const company =
    document.querySelector("#job_header a")?.textContent?.trim() || "";

  const experience =
    document.querySelector('[class*="exp"] span')?.textContent?.trim() || "";

  const location =
    document.querySelector('[class*="loc"] a')?.textContent?.trim() || "";

  return {
    title,
    company,
    experience,
    location,
  };
}
