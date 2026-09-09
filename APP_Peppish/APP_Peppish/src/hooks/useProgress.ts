import { useQuery } from "@tanstack/react-query";
import { progressService } from "../services/progressService";

export const useProgress = () => {
  return useQuery({
    queryKey: ["progress"],
    queryFn: () => progressService.getProgress(),
  });
};
