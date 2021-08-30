"use strict";

import { getPendingCount } from "../util/data-helpers";
import { sendWsMessageToUser } from "../util/ws-helpers";

import { runBookLookupIfAble } from "../util/book-lookup";

export const handler = async event => {
  try {
    const userNotifications = notifyUserScanStatusUpdates(event);
    const lookup = runBookLookupIfAble();

    await Promise.all([userNotifications, lookup]);
  } catch (er) {
    console.log("ERROR in stream handler", er);
  }
};

const getNewDynamoRecordsFromEvent = event => {
  const records = event.Records || [];
  const result = [];
  for (const record of records) {
    const newImage = record?.dynamodb?.NewImage;
    if (newImage) {
      result.push(newImage);
    }
  }
  return result;
};

const notifyUserScanStatusUpdates = async event => {
  const usersScanned = new Set<string>([]);

  for (const newImage of getNewDynamoRecordsFromEvent(event)) {
    const pk = newImage.pk.S;

    if (pk.startsWith("UserScanStatus")) {
      const userId = pk.split("#")[1];
      usersScanned.add(userId);
    }
  }
  const notifyAllUsers = [...usersScanned].map(userId =>
    Promise.resolve(getPendingCount(userId).then(pendingCount => sendWsMessageToUser(userId, { type: "pendingCountSet", pendingCount })))
  );

  return Promise.all(notifyAllUsers);
};
