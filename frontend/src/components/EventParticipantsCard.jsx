import { getUserById } from "../API/ProfileAPI";

export const EventParticipantsCard = ({ event, user }) => {
  const [expanded, setExpanded] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  const realParticipantIds =
    event.participantIds?.filter((id) => id !== user.id) || [];

  const handleToggle = async () => {
    if (
      !expanded &&
      participants.length === 0 &&
      realParticipantIds.length > 0
    ) {
      setLoading(true);
      try {
        const details = await Promise.all(
          realParticipantIds.map((id) => getUserById(id))
        );
        setParticipants(details);
      } catch (err) {
        console.error("Error fetching participants", err);
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 flex justify-between items-center bg-white">
        <div>
          <h4 className="font-bold text-slate-800">{event.title}</h4>
          <p className="text-xs text-slate-500">
            {new Date(event.eventDate).toLocaleDateString()} •{" "}
            {realParticipantIds.length} Joined
          </p>
        </div>
        <button
          onClick={handleToggle}
          className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          {expanded ? "Hide" : "View Participants"}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 p-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-5 w-5 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
            </div>
          ) : realParticipantIds.length === 0 ? (
            <p className="text-center text-slate-400 text-sm italic">
              No participants yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-slate-400 text-left">
                <tr>
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Email</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {participants.map((p) => (
                  <tr key={p.id} className="border-t border-slate-200">
                    <td className="py-2 font-medium">{p.name || p.username}</td>
                    <td className="py-2 text-slate-500">{p.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
