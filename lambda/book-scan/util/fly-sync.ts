import { getSecrets } from "./getSecrets";

export async function syncWithFly() {
  try {
    const secrets = await getSecrets();
    const flyToken = secrets["fly-token"];
    const flySaveScannedApp = secrets["fly-save-scanned-books-app"];

    const response = await fetch(`https://api.machines.dev/v1/apps/${flySaveScannedApp}/machines`, {
      headers: {
        Authorization: `Bearer ${flyToken}`
      }
    });
    console.log("Syncing with Fly");
    const data = await response.json();
    const machineId = data?.[0]?.id;

    if (machineId) {
      console.log("Fly machine found", machineId);
      await fetch(`https://api.machines.dev/v1/apps/${flySaveScannedApp}/machines/${machineId}/start`, {
        headers: {
          Authorization: `Bearer ${flyToken}`
        },
        method: "POST"
      });

      console.log("Fly sync complete", machineId);
      return true;
    } else {
      console.log("Failure: No Fly machines found");
      return false;
    }
  } catch (err) {
    console.log("Error syncing with Fly", err);
    return false;
  }
}
