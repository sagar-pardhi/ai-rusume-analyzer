interface UnsupportedSiteProps {
  currentDomain: string;
}

export function UnsupportedSite({ currentDomain }: UnsupportedSiteProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <h3 className="font-semibold text-red-700">Unsupported Website</h3>

      <p className="mt-1 text-sm text-red-600">
        This extension currently works only on Naukri.com job pages.
      </p>

      <p className="mt-2 text-xs text-gray-500">
        Current site: {currentDomain}
      </p>
    </div>
  );
}
