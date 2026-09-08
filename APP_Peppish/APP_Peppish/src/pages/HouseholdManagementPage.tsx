import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { householdJoinRequestServiceApi } from "../services/householdJoinRequestService.api";
import {
  householdServiceApi,
  HouseholdMember,
} from "../services/householdService.api";
import logoImg from "../assets/logo_img.png";
import Loading from "../components/Loading";

interface JoinRequest {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  role: string;
  householdId: string;
  createdAt: string;
  status: string;
}

interface JoinCode {
  code: string;
  expiresAt: string;
}

export const HouseholdManagementPage = () => {
  const { user } = useAuth();
  const [householdName, setHouseholdName] = useState("");
  const [members, setMembers] = useState<HouseholdMember[]>([]);

  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [joinCode, setJoinCode] = useState<JoinCode | null>(null);
  const [creatingCode, setCreatingCode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        if (user?.householdId) {
          const household = await householdServiceApi.getHouseholdById(
            user.householdId,
          );

          if (household) {
            setHouseholdName(household.name);
            setMembers(household?.users ?? []);
          }
        }

        const data = await householdJoinRequestServiceApi.getPendingRequests();

        setRequests(data);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadRequests();
    }
  }, [user]);

  const createJoinCode = async () => {
    setCreatingCode(true);
    setCopied(false);

    try {
      const data = await householdJoinRequestServiceApi.createJoinCode();

      setJoinCode(data);
    } finally {
      setCreatingCode(false);
    }
  };

  const copyJoinCode = async () => {
    if (!joinCode) return;

    await navigator.clipboard.writeText(joinCode.code);
    setCopied(true);
  };

  const approveRequest = async (requestId: string) => {
    await householdJoinRequestServiceApi.approveRequest(requestId);

    setRequests((prev) => prev.filter((request) => request.id !== requestId));
  };

  const rejectRequest = async (requestId: string) => {
    await householdJoinRequestServiceApi.rejectRequest(requestId);

    setRequests((prev) => prev.filter((request) => request.id !== requestId));
  };

  if (!user) {
    return <div>Du måste vara inloggad.</div>;
  }

  if (loading) {
    return <Loading message="Laddar hushåll..." />;
  }

  return (
    <div className="household-page-container">
      <h1 className="logo-icon">
        <img src={logoImg} alt="App logo" />
        {householdName || "Hushåll"}
      </h1>

      <section id="invite-member">
        <h2>Bjud in en medlem till ditt hushåll: </h2>
        <button type="button" onClick={createJoinCode} disabled={creatingCode}>
          {creatingCode ? "Skapar kod..." : "Inbjudningskod"}
        </button>
      </section>

      <section>
        <h2>Medlemmar</h2>

        {members.length === 0 ? (
          <p>Det finns inga medlemmar i hushållet.</p>
        ) : (
          <div className="household-members">
            {members.map((member) => (
              <div className="household-member" key={member.id}>
                <div className="household-member-info">
                  <strong>{member.name}</strong>
                  <span>{member.email}</span>
                </div>

                <span className="household-member-role">
                  {member.role === "ADULT" ? "Vuxen" : "Barn"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Förfrågningar att hantera: </h2>

        {requests.length === 0 ? (
          <p>Det finns inga väntande förfrågningar.</p>
        ) : (
          <ul>
            {requests.map((request) => (
              <li key={request.id}>
                <div>
                  <strong>{request.displayName}</strong>
                  <div>{request.email}</div>
                  <div>Roll: {request.role}</div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => approveRequest(request.id)}
                  >
                    Godkänn
                  </button>

                  <button
                    type="button"
                    onClick={() => rejectRequest(request.id)}
                  >
                    Neka
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {joinCode && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Bjud in medlem</h2>

            <p>Ge den här koden till personen som ska gå med:</p>

            <div>
              <strong>{joinCode.code}</strong>

              <button type="button" onClick={copyJoinCode}>
                {copied ? "Kopierad!" : "Kopiera"}
              </button>
            </div>

            <p>
              Koden gäller till:{" "}
              {new Date(joinCode.expiresAt).toLocaleString("sv-SE")}
            </p>

            <button type="button" onClick={() => setJoinCode(null)}>
              Stäng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
