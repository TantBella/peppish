import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { choreTemplateApi } from "../services/choreService.api";
import { useAuth } from "../context/AuthContext";
import { useChore } from "../hooks/useChores";
import Loading from "../components/Loading";

export const EditChorePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: chore, isLoading, error } = useChore(id || "");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardAmount, setRewardAmount] = useState<number>(0);
  const [rewardPoints, setRewardPoints] = useState<number>(0);
  const [recurrence, setRecurrence] = useState("Daily");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (chore) {
      setTitle(chore.title || "");
      setRewardAmount(chore.rewardAmount ?? 0);
    }
  }, [chore]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Missing id");
      return choreTemplateApi.update(id, {
        title,
        description,
        rewardAmount,
        rewardPoints,
        recurrence,
      });
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["chores"] });
      queryClient.setQueryData(["chore", id], updated);
      navigate("/chores");
    },
    onError: (err) =>
      setFormError(
        err instanceof Error ? err.message : "Failed to update chore",
      ),
  });

  if (isLoading) return <Loading message="Laddar..." />;
  if (error)
    return (
      <div className="error-message">
        <div>Failed to load chore</div>
        <button
          className="btn-primary"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["chore", id] })
          }
        >
          Retry
        </button>
      </div>
    );

  if (user?.role !== "Adult") {
    return (
      <div className="error-message">
        Du har inte behörighet att redigera uppgifter.
      </div>
    );
  }

  return (
    <div className="edit-chore-page">
      <h1>Ändra uppgift</h1>
      {formError && <div className="error-message">{formError}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateMutation.mutate();
        }}
      >
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
            <label htmlFor="recurrence">Upprepning</label>
            <select
              id="recurrence"
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
            >
              <option value="Daily">Dagligen</option>
              <option value="Weekly">Veckovis</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="rewardAmount">Belöning (kr)</label>
            <input
              id="rewardAmount"
              type="number"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(Number(e.target.value))}
              min={0}
            />
          </div>
          <div className="form-group">
            <label htmlFor="rewardPoints">Poäng</label>
            <input
              id="rewardPoints"
              type="number"
              value={rewardPoints}
              onChange={(e) => setRewardPoints(Number(e.target.value))}
              min={0}
            />
          </div>
        </div>
        <div className="form-actions">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="btn-primary"
          >
            {updateMutation.isPending ? "Sparar..." : "Spara ändringar"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/chores")}
          >
            Avbryt
          </button>
        </div>
      </form>
    </div>
  );
};
