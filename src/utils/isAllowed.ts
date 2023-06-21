import lDifference from "lodash.difference";
import { UserRoleCognito } from "./Enums";

/**
 * ADMIN users can perform any user action
 * Users are only allowed to list users belonging to clients they have access to
 * */
export default function isAllowed(payload: { currentTargetGroups: string[]; newTargetGroups?: string[]; currentRequesterGroups: string[] }): boolean {
  const { currentRequesterGroups, currentTargetGroups, newTargetGroups = currentTargetGroups } = payload;

  console.log("currentRequesterGroups", { currentRequesterGroups });
  if (currentRequesterGroups.some((group) => group.split(":").pop() === UserRoleCognito.ADMIN)) {
    return true;
  }

  console.log("newTargetGroups", { newTargetGroups });
  if (newTargetGroups.some((el) => el.split(":").pop() === UserRoleCognito.ADMIN)) {
    return false;
  }

  const currentTargetClientIds = currentTargetGroups.map((el) => el.split(":").shift());
  const newTargetClientIds = newTargetGroups.map((el) => el.split(":").shift());

  const clientIdsToRemove = lDifference(currentTargetClientIds, newTargetClientIds);
  const clientIdsToAdd = lDifference(newTargetClientIds, currentTargetClientIds);
  console.log("clientIdsToRemove", { clientIdsToRemove });
  console.log("clientIdsToAdd", { clientIdsToAdd });
  return [...clientIdsToRemove, ...clientIdsToAdd].every((clientId) =>
    currentTargetGroups.some((currentRequesterGroup) => currentRequesterGroup.split(":").shift() === clientId)
  );
}
