import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { choreTemplateService } from "../services/choreTemplateService";
import { choreAssignmentServiceApi } from "../services/choreAssignmentService.api";
import { householdServiceApi } from "../services/householdService.api";
import { useAuth } from "../context/AuthContext";
import { HouseholdMember } from "../services/householdService.api";

import logoImg from "../assets/logo_img.png";

export const CreateChorePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardValue, setRewardValue] = useState<number | "">("");
  const [rewardType, setRewardType] = useState("Xp");
  const [recurrence, setRecurrence] = useState("None");
  const [assignedToUserId, setAssignedToUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMembers = async () => {
      if (!user?.householdId) {
        return;
      }

      try {
        const household = await householdServiceApi.getHouseholdById(
          user.householdId,
        );

        if (household) {
          setMembers(household.users);
        }
      } catch {
        setError("Kunde inte hämta hushållets medlemmar.");
      }
    };

    loadMembers();
  }, [user?.householdId]);

  const mutation = useMutation({
    mutationFn: async () => {
      const template = await choreTemplateService?.createTemplate({
        title,
        description,
        rewardValue: rewardValue === "" ? 0 : Number(rewardValue),
        rewardType,
        recurrence,
      });

      if (!template?.id) {
        throw new Error("Uppgiften kunde inte skapas.");
      }

      return choreAssignmentServiceApi.assignChore({
        choreTemplateId: template.id,
        assignedToUserId,
        startDate,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chore-templates"] });
      navigate("/chores");
    },

    onError: (err) => {
      setError(
        err instanceof Error ? err.message : "Kunde inte skapa uppgiften.",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate();
  };

  return (
    <>
      <h1 className="logo-icon">
        <img src={logoImg} alt="App logo" />
        Skapa quest
      </h1>

      <div className="create-chore-page">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Titel</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Beskrivning</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rewardValue">Belöning</label>
              <input
                id="rewardValue"
                type="number"
                value={rewardValue}
                onChange={(e) =>
                  setRewardValue(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                min={0}
              />
            </div>

            <div className="form-group">
              <label htmlFor="rewardType">Belöningstyp</label>
              <select
                id="rewardType"
                value={rewardType}
                onChange={(e) => setRewardType(e.target.value)}
              >
                <option value="Xp">XP</option>
                <option value="Money">Pengar</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="recurrence">Återkommer</label>
            <select
              id="recurrence"
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
            >
              <option value="None">En gång</option>
              <option value="Daily">Varje dag</option>
              <option value="Weekly">Varje vecka</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assignedToUserId">Tilldela till</label>
            <select
              id="assignedToUserId"
              value={assignedToUserId}
              onChange={(e) => setAssignedToUserId(e.target.value)}
            >
              <option value="">Välj person</option>

              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Startdatum</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary"
            >
              {mutation.isPending ? "Skapar..." : "Skapa quest"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
