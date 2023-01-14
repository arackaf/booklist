import { redirect } from "@sveltejs/kit";

export const actions = {
  async saveSubject() {
    console.log("Save subject from settings");
  }
};

export function load() {
  throw redirect(308, "/settings/account-sync");
}
