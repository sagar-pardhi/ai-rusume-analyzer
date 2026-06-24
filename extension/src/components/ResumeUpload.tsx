interface ResumeUploadProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ResumeUpload({ onUpload }: ResumeUploadProps) {
  return (
    <input
      type="file"
      accept=".pdf"
      onChange={onUpload}
    />
  );
}
