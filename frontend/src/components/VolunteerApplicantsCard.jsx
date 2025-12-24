import { getApplicants } from "../API/VolunteerAPI";

export const VolunteerApplicantsCard = ({ listing, user }) => {
  const [expanded, setExpanded] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (
      !expanded &&
      applicants.length === 0 &&
      listing.applicantIds?.length > 0
    ) {
      setLoading(true);
      try {
        const data = await getApplicants(listing.id, user.id);
        setApplicants(data);
      } catch (err) {
        console.error("Error fetching applicants", err);
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 flex justify-between items-center">
        <div>
          <h4 className="font-bold text-slate-800">{listing.title}</h4>
          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold">
            Volunteer Recruitment
          </span>
        </div>
        <button
          onClick={handleToggle}
          className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg"
        >
          {expanded
            ? "Collapse"
            : `Applicants (${listing.applicantIds?.length || 0})`}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 p-4">
          {loading ? (
            <div className="text-center py-4 text-slate-400">
              Loading details...
            </div>
          ) : applicants.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-2">
              No applications yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {applicants.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-slate-800">{app.name}</p>
                    <p className="text-xs text-slate-500">{app.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {app.contactInfo || "No Phone Provided"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
